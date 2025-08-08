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

    // Add timeout for database operation
    const dbOperation = async () => {
      const { db } = await connectToDatabase()
      
      const newMemory = {
        title,
        description,
        year: year || '',
        occasion: occasion || '',
        imageUrl: imageUrl || '',
        authorName: 'Anonymous',
        authorEmail: '',
        likes: 0,
        likedBy: [],
        comments: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const result = await db.collection('memories').insertOne(newMemory)
      return result
    }

    // Race the database operation against a timeout
    const result = await Promise.race([
      dbOperation(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timeout')), 10000)
      )
    ])
    
    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: 'Memory shared successfully!',
      imageUrl: imageUrl
    })

  } catch (error) {
    console.error('Error creating memory:', error)
    
    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Database connection timeout. Please try again.' },
          { status: 503 }
        )
      }
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please try again.' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create memory. Please try again.' },
      { status: 500 }
    )
  }
}
