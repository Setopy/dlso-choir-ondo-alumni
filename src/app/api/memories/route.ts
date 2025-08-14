// src/app/api/memories/route.ts - ENHANCED FOR NETLIFY
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'

// ✅ ENHANCED: Circuit breaker for MongoDB connections
let connectionFailures = 0
let lastFailureTime = 0
const MAX_FAILURES = 5
const FAILURE_RESET_TIME = 60000 // 1 minute

function isCircuitBreakerOpen(): boolean {
  if (connectionFailures >= MAX_FAILURES) {
    if (Date.now() - lastFailureTime < FAILURE_RESET_TIME) {
      return true
    } else {
      // Reset circuit breaker
      connectionFailures = 0
      lastFailureTime = 0
    }
  }
  return false
}

function recordConnectionFailure(): void {
  connectionFailures++
  lastFailureTime = Date.now()
}

function recordConnectionSuccess(): void {
  connectionFailures = 0
  lastFailureTime = 0
}

// GET memories - NO AUTH REQUIRED (everyone can view)
export async function GET(request: NextRequest) {
  try {
    // Check circuit breaker
    if (isCircuitBreakerOpen()) {
      console.log('🔒 Circuit breaker open - rejecting request')
      return NextResponse.json(
        { 
          success: false,
          error: 'Database temporarily unavailable',
          memories: [],
          circuitBreakerOpen: true
        }, 
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    console.log('🔍 Fetching memories from MongoDB...')
    const { db } = await connectToDatabase()
    recordConnectionSuccess()

    // Get memories with proper error handling and timeout
    const memories = await Promise.race([
      db.collection('memories')
        .find({ isPublic: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 10000)
      )
    ])

    // Ensure consistent array format with proper serialization
    const serializedMemories = Array.isArray(memories) ? memories.map(memory => ({
      ...memory,
      _id: memory._id.toString(),
      likes: memory.likes || 0,
      likedBy: memory.likedBy || [],
      comments: memory.comments || [],
      authorName: memory.authorName || 'Anonymous',
      authorImage: memory.authorImage || null,
      imageUrl: memory.imageUrl || null,
      createdAt: memory.createdAt ? memory.createdAt.toISOString() : new Date().toISOString()
    })) : []

    // Get total count for pagination
    const total = await Promise.race([
      db.collection('memories').countDocuments({ isPublic: true }),
      new Promise<number>((_, reject) => 
        setTimeout(() => reject(new Error('Count timeout')), 5000)
      )
    ]).catch(() => serializedMemories.length)

    console.log(`✅ Successfully fetched ${serializedMemories.length} memories`)

    return NextResponse.json({
      success: true,
      memories: serializedMemories,
      pagination: {
        page,
        limit,
        total: typeof total === 'number' ? total : serializedMemories.length
      }
    })

  } catch (error) {
    console.error('❌ Error fetching memories:', error)
    recordConnectionFailure()
    
    // Return graceful fallback
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch memories - database connection issue',
        memories: [], // Always return empty array on error
        retryAfter: Math.ceil(connectionFailures * 10) // Suggest retry time
      }, 
      { status: 503 } // Service Unavailable
    )
  }
}

// POST memory - REQUIRES AUTH (only signed-in users can post)
export async function POST(request: NextRequest) {
  try {
    // Check circuit breaker
    if (isCircuitBreakerOpen()) {
      console.log('🔒 Circuit breaker open - rejecting POST request')
      return NextResponse.json(
        { 
          success: false,
          error: 'Database temporarily unavailable - please try again later',
          circuitBreakerOpen: true
        }, 
        { status: 503 }
      )
    }

    // Check if user is signed in
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
    } catch (parseError) {
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

    console.log('💾 Saving memory to MongoDB...')
    const { db } = await connectToDatabase()
    recordConnectionSuccess()

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

    const result = await Promise.race([
      db.collection('memories').insertOne(memory),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Insert timeout')), 15000)
      )
    ])

    console.log(`✅ Memory created by: ${session.user.name} (${session.user.email})`)

    return NextResponse.json({
      success: true,
      message: 'Memory shared successfully!',
      memoryId: (result as any).insertedId.toString(),
      memory: {
        ...memory,
        _id: (result as any).insertedId.toString(),
        createdAt: memory.createdAt.toISOString()
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error creating memory:', error)
    recordConnectionFailure()
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create memory - database connection issue. Please try again.' 
      }, 
      { status: 503 }
    )
  }
}