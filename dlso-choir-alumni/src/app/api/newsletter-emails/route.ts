// src/app/api/newsletter-emails/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const emails = await db.collection('newsletter_emails')
      .find({})
      .sort({ subscribedAt: -1 })
      .toArray()

    const emailList = emails.map(item => ({
      id: item._id.toString(),
      email: item.email,
      name: item.name,
      subscribedAt: item.subscribedAt,
      source: item.source
    }))

    const emailAddresses = emails.map(item => item.email)

    return NextResponse.json({
      success: true,
      total: emails.length,
      emails: emailList,
      emailAddresses: emailAddresses
    })

  } catch (error) {
    console.error('Error fetching newsletter emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' }, 
      { status: 500 }
    )
  }
}