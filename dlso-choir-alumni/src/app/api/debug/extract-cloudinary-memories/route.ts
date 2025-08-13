// Create this as src/app/api/debug/extract-cloudinary-memories/route.ts
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    console.log('🔍 Searching Cloudinary for memory data...')
    
    // Search for all images with potential memory metadata
    const searchResult = await cloudinary.search
      .expression('resource_type:image')
      .with_field(['metadata', 'context', 'tags'])
      .max_results(100)
      .sort_by('created_at', 'desc')
      .execute()
    
    console.log(`📊 Found ${searchResult.resources.length} images in Cloudinary`)
    
    // Look for images that might have memory data
    const potentialMemories = []
    
    for (const resource of searchResult.resources) {
      const memoryData = {
        public_id: resource.public_id,
        url: resource.secure_url,
        created_at: resource.created_at,
        filename: resource.filename,
        hasMetadata: false,
        hasContext: false,
        extractedData: {
          title: null,
          description: null,
          year: null,
          occasion: null,
          author: null
        }
      }
      
      // Check metadata for memory information
      if (resource.metadata && Object.keys(resource.metadata).length > 0) {
        memoryData.hasMetadata = true
        console.log(`📝 Metadata found for ${resource.public_id}:`, resource.metadata)
        
        // Extract common memory fields
        memoryData.extractedData.title = resource.metadata.title || resource.metadata.memory_title || resource.metadata.name
        memoryData.extractedData.description = resource.metadata.description || resource.metadata.memory_description || resource.metadata.story
        memoryData.extractedData.year = resource.metadata.year || resource.metadata.memory_year
        memoryData.extractedData.occasion = resource.metadata.occasion || resource.metadata.event || resource.metadata.memory_occasion
        memoryData.extractedData.author = resource.metadata.author || resource.metadata.uploaded_by || resource.metadata.created_by
      }
      
      // Check context for memory information
      if (resource.context && Object.keys(resource.context).length > 0) {
        memoryData.hasContext = true
        console.log(`🏷️ Context found for ${resource.public_id}:`, resource.context)
        
        // Context can override metadata
        memoryData.extractedData.title = resource.context.title || memoryData.extractedData.title
        memoryData.extractedData.description = resource.context.description || memoryData.extractedData.description
        memoryData.extractedData.year = resource.context.year || memoryData.extractedData.year
        memoryData.extractedData.occasion = resource.context.occasion || memoryData.extractedData.occasion
        memoryData.extractedData.author = resource.context.author || memoryData.extractedData.author
      }
      
      // Check if this looks like a memory (has title or description)
      const hasMemoryData = memoryData.extractedData.title || memoryData.extractedData.description
      
      if (hasMemoryData || memoryData.hasMetadata || memoryData.hasContext) {
        potentialMemories.push(memoryData)
      }
    }
    
    console.log(`🎯 Found ${potentialMemories.length} potential memories`)
    
    return NextResponse.json({
      success: true,
      totalImages: searchResult.resources.length,
      potentialMemoriesCount: potentialMemories.length,
      potentialMemories: potentialMemories,
      summary: {
        withMetadata: potentialMemories.filter(m => m.hasMetadata).length,
        withContext: potentialMemories.filter(m => m.hasContext).length,
        withTitle: potentialMemories.filter(m => m.extractedData.title).length,
        withDescription: potentialMemories.filter(m => m.extractedData.description).length,
      },
      // Show first few as examples
      examples: potentialMemories.slice(0, 5).map(m => ({
        url: m.url,
        title: m.extractedData.title,
        description: m.extractedData.description,
        hasData: !!(m.extractedData.title || m.extractedData.description)
      }))
    })
    
  } catch (error) {
    console.error('❌ Cloudinary extraction error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}