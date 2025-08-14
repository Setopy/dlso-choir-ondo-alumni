'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ErrorBoundary } from './ErrorBoundary'
import { validateMemoryArray, sanitizeMemoryData } from '@/lib/validation'

interface Comment {
  id: string
  text: string
  authorName: string
  createdAt: string
}

interface Memory {
  _id: string
  title: string
  description: string
  year: string
  occasion: string
  imageUrl?: string
  authorName: string
  authorEmail?: string
  authorImage?: string
  likes: number
  likedBy?: string[]
  comments?: Comment[]
  createdAt: string
}

function RecentMemoriesComponent() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchRecentMemories = async () => {
      try {
        setError(null)
        const response = await fetch('/api/memories')
        
        if (response.ok) {
          const data = await response.json()
          
          // ✅ EXTRACT AND VALIDATE MEMORIES ARRAY
          let memoriesArray: unknown[] = []
          if (Array.isArray(data)) {
            memoriesArray = data
          } else if (data.success && Array.isArray(data.memories)) {
            memoriesArray = data.memories
          } else if (data.memories) {
            // Fallback for different response formats
            memoriesArray = Array.isArray(data.memories) ? data.memories : []
          } else {
            console.error('❌ API returned unexpected format:', data)
            setError('Unable to load memories - unexpected data format')
            setMemories([])
            return
          }
          
          // Validate and sanitize the memories array
          if (!validateMemoryArray(memoriesArray)) {
            console.warn('⚠️ Invalid memories data, attempting to sanitize...')
            memoriesArray = memoriesArray
              .filter((item: unknown) => item && typeof item === 'object')
              .map((item: unknown) => sanitizeMemoryData(item as Record<string, unknown>))
          }
          
          console.log(`📊 Memories found: ${memoriesArray.length}`)
          
          // Debug image URLs
          memoriesArray.forEach((memory: unknown, index: number) => {
            const memoryObj = memory as Record<string, unknown>
            if (memoryObj.imageUrl) {
              console.log(`🖼️ Memory ${index + 1} image URL:`, memoryObj.imageUrl)
            }
          })
          
          setMemories((memoriesArray as Memory[]).slice(0, 6))
        } else {
          // Handle non-OK responses
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('❌ API Error:', response.status, errorData)
          setError(errorData.error || `Server error: ${response.status}`)
          setMemories([])
        }
      } catch (error) {
        console.error('❌ Fetch Error:', error)
        setError('Failed to load memories. Please check your connection and try again.')
        setMemories([]) // Ensure memories is always an array
      } finally {
        setLoading(false)
      }
    }

    fetchRecentMemories()
  }, [])

  const handleImageError = (memoryId: string, imageUrl?: string) => {
    console.error('❌ Image failed to load:', { memoryId, imageUrl })
    setImageLoadErrors(prev => new Set(prev).add(memoryId))
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Recent'
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Recent'
    }
  }

  if (loading) {
    return (
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">Latest Shared Memories</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden animate-pulse border border-slate-200/50">
                <div className="aspect-[5/4] bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">Unable to Load Memories</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (memories.length === 0) {
    return (
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">Memory Wall</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              No memories shared yet. Be the first to share a special moment from our DLSO family!
            </p>
            <Link 
              href="/memories/new"
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold inline-block shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Share Your First Memory
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30"></div>
      <div className="relative container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">
            Latest Shared Memories
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Relive the beautiful moments and ministry experiences from our DLSO journey together
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {memories.map((memory) => (
            <div 
              key={memory._id} 
              className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50"
            >
              <div className="relative aspect-[5/4] bg-gradient-to-br from-amber-100 to-blue-100">
                {memory.imageUrl && !imageLoadErrors.has(memory._id) ? (
                  <Image
                    src={memory.imageUrl}
                    alt={memory.title || 'Memory photo'}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(memory._id, memory.imageUrl)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={memory.imageUrl?.includes('blob.vercel-storage.com')}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-gray-500">
                    <div>
                      <span className="text-4xl mb-2 block">📸</span>
                      <p className="text-sm">
                        {memory.imageUrl ? 'Image unavailable' : 'No photo'}
                      </p>
                      {process.env.NODE_ENV === 'development' && memory.imageUrl && (
                        <p className="text-xs mt-2 break-all max-w-[200px] mx-auto">
                          {memory.imageUrl}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {memory.occasion && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {memory.occasion}
                    </span>
                  </div>
                )}

                {memory.year && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-amber-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {memory.year}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
                  {memory.title || 'Untitled Memory'}
                </h3>
                
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {memory.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3 text-slate-500">
                    <span className="flex items-center space-x-1">
                      <span>❤️</span>
                      <span>{memory.likes || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>💬</span>
                      <span>{memory.comments?.length || 0}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {memory.authorImage && (
                      <Image
                        src={memory.authorImage}
                        alt={memory.authorName || 'User'}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                        onError={(e) => {
                          // Hide broken author images
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="text-right">
                      <p className="font-medium text-slate-700 text-xs">{memory.authorName || 'Anonymous'}</p>
                      <p className="text-xs text-slate-500">{formatDate(memory.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA Section */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-amber-900 rounded-2xl p-10 text-center shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-6">
            Explore All Our Memories ✨
          </h3>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover the complete collection of Ondo DLSO Alumni memories, stories, and ministry experiences
            that have shaped our spiritual journey together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/memories"
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              View All Memories
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link 
              href="/memories/new"
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              Share Memory
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Export wrapped component with error boundary
export default function RecentMemories() {
  return (
    <ErrorBoundary>
      <RecentMemoriesComponent />
    </ErrorBoundary>
  )
}