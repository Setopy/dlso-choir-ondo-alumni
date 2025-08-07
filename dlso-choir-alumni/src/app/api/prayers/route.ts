import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const prayers = await db.collection('prayer_requests')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json(prayers)
  } catch (error) {
    console.error('Error fetching prayers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prayer requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()
    
    const newPrayer = {
      ...body,
      prayerCount: 0,
      prayerSupporters: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('prayer_requests').insertOne(newPrayer)
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Prayer request submitted successfully!' 
    })
  } catch (error) {
    console.error('Error creating prayer:', error)
    return NextResponse.json(
      { error: 'Failed to create prayer request' },
      { status: 500 }
    )
  }
}