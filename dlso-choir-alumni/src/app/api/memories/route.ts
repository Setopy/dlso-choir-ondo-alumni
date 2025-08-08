import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const memories = await db.collection('memories')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json(memories)
  } catch (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, year, occasion, imageUrl } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' }, 
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    const newMemory = {
      title,
      description,
      year: year || '',
      occasion: occasion || '',
      imageUrl: imageUrl || '', // Now properly handles uploaded image URL
      authorName: 'Anonymous', // TODO: Get from session when auth is 
added
      authorEmail: '', // TODO: Get from session when auth is added
      likes: 0,
      likedBy: [],
      comments: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('memories').insertOne(newMemory)
    
    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: 'Memory shared successfully!',
      imageUrl: imageUrl // Return the image URL for confirmation
    })
  } catch (error) {
    console.error('Error creating memory:', error)
    return NextResponse.json(
      { error: 'Failed to create memory' },
      { status: 500 }
    )
  }
}
