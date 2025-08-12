// src/app/api/memories/route.ts - SIMPLE VERSION
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'

// GET memories - NO AUTH REQUIRED (everyone can view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const { db } = await connectToDatabase()

    const memories = await db.collection('memories')
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      memories: memories.map(memory => ({
        ...memory,
        _id: memory._id.toString()
      }))
    })

  } catch (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memories' }, 
      { status: 500 }
    )
  }
}

// POST memory - REQUIRES AUTH (only signed-in users can post)
export async function POST(request: NextRequest) {
  try {
    // Check if user is signed in (but don't block the endpoint)
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { 
          error: 'Please sign in to share memories',
          requiresAuth: true 
        }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, imageUrl, category } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' }, 
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Create memory with user info
    const memory = {
      title,
      description,
      imageUrl: imageUrl || null,
      category: category || 'general',
      
      // User attribution
      authorId: session.user.id,
      authorName: session.user.name,
      authorEmail: session.user.email,
      authorImage: session.user.image,
      
      // Metadata
      createdAt: new Date(),
      isPublic: true,
      viewCount: 0,
      likes: []
    }

    const result = await db.collection('memories').insertOne(memory)

    console.log(`✅ Memory created by: ${session.user.name} (${session.user.email})`)

    return NextResponse.json({
      success: true,
      message: 'Memory shared successfully!',
      memoryId: result.insertedId
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating memory:', error)
    return NextResponse.json(
      { error: 'Failed to create memory' }, 
      { status: 500 }
    )
  }
}