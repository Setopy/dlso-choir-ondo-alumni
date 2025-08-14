// src/app/api/memories/route.ts - ENHANCED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'

// GET memories - NO AUTH REQUIRED (everyone can view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()

    // Get memories with proper error handling
    const memories = await db.collection('memories')
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Ensure consistent array format with proper serialization
    const serializedMemories = memories.map(memory => ({
      ...memory,
      _id: memory._id.toString(),
      likes: memory.likes || 0,
      likedBy: memory.likedBy || [],
      comments: memory.comments || [],
      authorName: memory.authorName || 'Anonymous',
      authorImage: memory.authorImage || null,
      imageUrl: memory.imageUrl || null,
      createdAt: memory.createdAt ? memory.createdAt.toISOString() : new Date().toISOString()
    }))

    return NextResponse.json({
      success: true,
      memories: serializedMemories,
      pagination: {
        page,
        limit,
        total: await db.collection('memories').countDocuments({ isPublic: true })
      }
    })

  } catch (error) {
    console.error('❌ Error fetching memories:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch memories',
        memories: [] // Always return empty array on error
      }, 
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
          success: false,
          error: 'Please sign in to share memories',
          requiresAuth: true 
        }, 
        { status: 401 }
      )
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON payload' 
        }, 
        { status: 400 }
      )
    }

    const { title, description, imageUrl, category, year, occasion } = body

    // Enhanced validation
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Title and description are required and cannot be empty' 
        }, 
        { status: 400 }
      )
    }

    if (title.length > 200) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Title must be less than 200 characters' 
        }, 
        { status: 400 }
      )
    }

    if (description.length > 2000) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Description must be less than 2000 characters' 
        }, 
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Create memory with enhanced structure
    const memory = {
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl || null,
      category: category || 'general',
      year: year || null,
      occasion: occasion || null,
      
      // User attribution
      authorId: session.user.id,
      authorName: session.user.name,
      authorEmail: session.user.email,
      authorImage: session.user.image,
      
      // Interaction data
      likes: 0,
      likedBy: [],
      comments: [],
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true,
      viewCount: 0
    }

    const result = await db.collection('memories').insertOne(memory)

    console.log(`✅ Memory created by: ${session.user.name} (${session.user.email})`)

    return NextResponse.json({
      success: true,
      message: 'Memory shared successfully!',
      memoryId: result.insertedId.toString(),
      memory: {
        ...memory,
        _id: result.insertedId.toString(),
        createdAt: memory.createdAt.toISOString()
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error creating memory:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create memory. Please try again.' 
      }, 
      { status: 500 }
    )
  }
}