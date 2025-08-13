// src/app/api/upload/route.ts - ENHANCED WITH URL DEBUGGING
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Upload API called (ENHANCED WITH URL DEBUGGING)')
    
    // Debug environment variables
    console.log('Environment Debug:', {
      NODE_ENV: process.env.NODE_ENV,
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length,
      platform: process.env.NETLIFY ? 'Netlify' : 'Other'
    })

    // Check authentication
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

    // ✅ ENHANCED: Better filename generation with proper extension handling
    const timestamp = Date.now()
    const userId = session.user.email?.split('@')[0] || 'user'
    const originalExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    
    // Ensure we have a valid image extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    const extension = validExtensions.includes(originalExtension) ? originalExtension : 'jpg'
    
    const filename = `memories/${userId}/${timestamp}.${extension}`

    console.log('📁 Generated filename details:', {
      originalName: file.name,
      originalExtension,
      finalExtension: extension,
      filename,
      userId,
      timestamp
    })

    console.log('🚀 Starting Vercel Blob upload...')

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    // ✅ ENHANCED: Detailed URL logging
    console.log('✅ Vercel Blob upload successful!')
    console.log('📊 Blob response details:', {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      urlLength: blob.url.length,
      urlValid: blob.url.startsWith('https://'),
      filename: filename
    })

    // ✅ ENHANCED: Validate URL before returning
    if (!blob.url || !blob.url.startsWith('https://')) {
      console.error('❌ Invalid blob URL returned:', blob.url)
      return NextResponse.json({ 
        error: 'Invalid image URL generated',
        debug: { blobUrl: blob.url }
      }, { status: 500 })
    }

    const response = {
      success: true,
      url: blob.url,
      filename: filename,
      size: file.size,
      type: file.type,
      pathname: blob.pathname,
      contentType: blob.contentType,
      uploadedAt: new Date().toISOString(),
      user: session.user.email,
      // ✅ ADD: URL validation info
      urlValidation: {
        isValid: true,
        length: blob.url.length,
        startsWithHttps: blob.url.startsWith('https://'),
        containsFilename: blob.url.includes(timestamp.toString())
      }
    }

    console.log('📤 Returning response:', response)
    return NextResponse.json(response)

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