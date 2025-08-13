// src/app/api/upload/route.ts - AUTHENTICATION RE-ENABLED
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Upload API called (VERCEL BLOB - AUTHENTICATION ENABLED)')
    
    // Debug environment variables
    console.log('Environment Debug:', {
      NODE_ENV: process.env.NODE_ENV,
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length,
      platform: process.env.NETLIFY ? 'Netlify' : 'Other'
    })

    // ✅ RE-ENABLED: Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.log('❌ No session found')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    console.log('✅ User authenticated:', session.user.email)

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    console.log('📤 File validation passed:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Generate unique filename with actual user
    const timestamp = Date.now()
    const userId = session.user.email?.split('@')[0] || 'user'
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `memories/${userId}/${timestamp}.${extension}`

    console.log('📁 Generated filename:', filename)
    console.log('🚀 Starting Vercel Blob upload...')

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log('✅ Vercel Blob upload successful:', {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename,
      size: file.size,
      type: file.type,
      pathname: blob.pathname,
      contentType: blob.contentType,
      uploadedAt: new Date().toISOString(),
      user: session.user.email
    })

  } catch (error) {
    console.error('💥 Upload error occurred:', error)
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5)
      })
    }

    return NextResponse.json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length,
        platform: process.env.NETLIFY ? 'Netlify' : 'Other'
      }
    }, { status: 500 })
  }
}