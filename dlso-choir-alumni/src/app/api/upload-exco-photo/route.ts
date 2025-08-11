// src/app/api/upload-exco-photo/route.ts - FIXED TYPESCRIPT ERRORS
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberId, imageUrl } = body

    console.log('🔍 EXCO Photo API Called:')
    console.log('memberId:', memberId)
    console.log('imageUrl:', imageUrl)

    // Validation
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Update database using same pattern as memories
    try {
      const { db } = await connectToDatabase()
      
      console.log('🔄 Updating EXCO member in database...')
      
      const updateResult = await db.collection('exco_members').findOneAndUpdate(
        { id: memberId },
        { 
          $set: {
            image: imageUrl,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )

      if (!updateResult || !updateResult.value) {
        console.log(`❌ EXCO member ${memberId} not found`)
        
        // Debug: Get all existing members
        const existingMembers = await db.collection('exco_members').find({}).toArray()
        console.log('📋 Existing EXCO members:', existingMembers.map(m => ({ id: m.id, name: m.name })))
        
        return NextResponse.json({
          error: `EXCO member with ID "${memberId}" not found in database`,
          debug: {
            searchedId: memberId,
            existingMembers: existingMembers.map(m => ({ id: m.id, name: m.name }))
          }
        }, { status: 404 })
      }

      console.log(`✅ Photo updated for EXCO member ${memberId}: ${imageUrl}`)

      return NextResponse.json({
        success: true,
        message: 'Photo updated successfully',
        imageUrl: imageUrl,
        member: updateResult.value
      })

    } catch (dbError: unknown) {
      console.error('❌ Database update failed:', dbError)
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error'
      
      return NextResponse.json({
        error: 'Database update failed',
        details: errorMessage
      }, { status: 500 })
    }

  } catch (error: unknown) {
    console.error('❌ API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown API error'
    
    return NextResponse.json({
      error: 'Upload failed',
      details: errorMessage
    }, { status: 500 })
  }
}