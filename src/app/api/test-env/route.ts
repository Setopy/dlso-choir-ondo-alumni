// src/app/api/test-env/route.ts - CREATE THIS FILE FOR TESTING
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    platform: process.env.NETLIFY ? 'Netlify' : 'Other',
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    blobTokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasMongoUri: !!process.env.MONGODB_URI,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    // Don't log sensitive values, just their existence
  })
}