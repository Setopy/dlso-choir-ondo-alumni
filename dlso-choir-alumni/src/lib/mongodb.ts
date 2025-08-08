import { MongoClient, Db, MongoClientOptions } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI

// Ultra-robust options for Netlify Functions
const options: MongoClientOptions = {
  maxPoolSize: 5, // Reduced for serverless
  serverSelectionTimeoutMS: 3000, // Very fast selection
  socketTimeoutMS: 20000, // Shorter socket timeout
  connectTimeoutMS: 5000, // Quick connection
  maxIdleTimeMS: 10000, // Close idle connections quickly
  retryWrites: true,
  // Force IPv4 for better Netlify compatibility
  family: 4,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production, create new connection each time for reliability
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    // Add timeout to the connection attempt itself
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 8000)
      )
    ])
    
    const db = client.db('dlso-choir-alumni')
    return { client, db }
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    throw new Error('Database connection failed')
  }
}

export default clientPromise
