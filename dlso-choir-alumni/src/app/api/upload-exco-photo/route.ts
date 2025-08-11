// src/app/api/upload-exco-photo/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { updateExcoMemberPhoto, getExcoMemberById } from '@/lib/exco-db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const memberId = formData.get('memberId') as string

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Please upload an image file' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Create filename with timestamp to avoid conflicts
    const fileExtension = file.type.split('/')[1]
    const fileName = `${memberId}-${Date.now()}.${fileExtension}`
    
    // Ensure the directory exists
    const uploadDir = path.join(process.cwd(), 'public/images/exco')
    try {
      await mkdir(uploadDir, { recursive: true })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars  
    } catch (error) {
      // Directory might already exist, which is fine
    }
    
    const filePath = path.join(uploadDir, fileName)

    // Convert file to buffer and save to filesystem
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create the public URL
    const imageUrl = `/images/exco/${fileName}`
    
    // Save to MongoDB
    try {
      await updateExcoMemberPhoto(memberId, imageUrl)
      console.log(`Photo updated for EXCO member ${memberId}: ${imageUrl}`)
    } catch (dbError) {
      console.error('Database update failed:', dbError)
      // File was saved but DB update failed - you might want to delete the file
      // or implement a cleanup mechanism
      return NextResponse.json({ 
        error: 'Photo uploaded but database update failed. Please try again.' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      imageUrl, 
      success: true,
      message: 'Photo uploaded and saved successfully'
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed. Please try again.' 
    }, { status: 500 })
  }
}

// Optional: Add GET method to retrieve current photo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    const member = await getExcoMemberById(memberId)
    
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      imageUrl: member.image,
      memberName: member.name 
    })
    
  } catch (error) {
    console.error('Error fetching member photo:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch member photo' 
    }, { status: 500 })
  }
}