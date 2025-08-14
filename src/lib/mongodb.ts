import { MongoClient, Db, MongoClientOptions } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI

// ✅ ENHANCED: Optimized MongoDB options for Netlify Functions
const options: MongoClientOptions = {
  // Connection Pool Settings
  maxPoolSize: 10, // Increased for better performance
  minPoolSize: 1,  // Keep minimum connections alive
  
  // Timeout Settings - More generous for serverless
  serverSelectionTimeoutMS: 15000, // Increased from 3000ms to 15000ms
  socketTimeoutMS: 45000,           // Increased from 20000ms to 45000ms  
  connectTimeoutMS: 15000,          // Increased from 5000ms to 15000ms
  maxIdleTimeMS: 30000,             // Increased from 10000ms to 30000ms
  
  // Retry and Durability Settings
  retryWrites: true,
  retryReads: true,
  
  // Network Settings
  family: 4, // Force IPv4 for better Netlify compatibility
  
  // Heartbeat Settings
  heartbeatFrequencyMS: 10000,
  
  // Buffer Settings for Large Payloads
  maxBsonObjectSize: 16 * 1024 * 1024, // 16MB
  
  // Compression for Better Performance
  compressors: ['snappy', 'zlib', 'zstd'],
  
  // SSL/TLS Settings
  ssl: true,
  sslValidate: true,
  
  // Read/Write Concerns
  readPreference: 'primaryPreferred', // Allow reads from secondaries if primary unavailable
  writeConcern: { w: 'majority', wtimeout: 10000 }
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// ✅ ENHANCED: Better connection management for serverless
if (process.env.NODE_ENV === 'development') {
  // In development, reuse connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production/serverless, optimize connection reuse
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
}

// ✅ ENHANCED: Robust connection function with retry logic
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔗 MongoDB connection attempt ${attempt}/${maxRetries}`)
      
      // Add timeout wrapper for the entire connection process
      const client = await Promise.race([
        clientPromise,
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Connection timeout after 20s (attempt ${attempt})`)), 20000)
        )
      ])
      
      // Test the connection with a simple ping
      const db = client.db('dlso-choir-alumni')
      await db.admin().ping()
      
      console.log('✅ MongoDB connected successfully')
      return { client, db }
      
    } catch (error) {
      lastError = error as Error
      console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error)
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        console.log(`⏳ Waiting ${waitTime}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        
        // Reset the client promise for next attempt
        client = new MongoClient(uri, options)
        clientPromise = client.connect()
        global._mongoClientPromise = clientPromise
      }
    }
  }
  
  console.error('💥 All MongoDB connection attempts failed')
  throw new Error(`Database connection failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`)
}

// ✅ ENHANCED: Connection health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { client, db } = await connectToDatabase()
    await db.admin().ping()
    return true
  } catch (error) {
    console.error('🏥 Database health check failed:', error)
    return false
  }
}

// ✅ ENHANCED: Graceful connection cleanup
export async function closeDatabaseConnection(): Promise<void> {
  try {
    if (global._mongoClientPromise) {
      const client = await global._mongoClientPromise
      await client.close()
      global._mongoClientPromise = undefined
      console.log('🔒 MongoDB connection closed')
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error)
  }
}

export default clientPromise