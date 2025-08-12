// src/app/api/newsletter-history/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const newsletters = await db.collection('newsletter_history')
      .find({})
      .sort({ sentAt: -1 })
      .toArray()

    const formattedNewsletters = newsletters.map(newsletter => ({
      id: newsletter._id.toString(),
      subject: newsletter.subject,
      sentAt: new Date(newsletter.sentAt).toLocaleDateString(),
      recipientCount: newsletter.recipientCount || 0,
      status: newsletter.status || 'sent'
    }))

    return NextResponse.json({
      success: true,
      newsletters: formattedNewsletters
    })

  } catch (error) {
    console.error('Error fetching newsletter history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter history' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const newEntry = {
      subject: body.subject,
      content: body.content,
      recipientCount: body.recipientCount || 0,
      sentAt: new Date(),
      status: 'sent',
      createdAt: new Date()
    }

    const result = await db.collection('newsletter_history').insertOne(newEntry)

    return NextResponse.json({
      success: true,
      id: result.insertedId
    })

  } catch (error) {
    console.error('Error saving newsletter history:', error)
    return NextResponse.json(
      { error: 'Failed to save newsletter history' }, 
      { status: 500 }
    )
  }
}