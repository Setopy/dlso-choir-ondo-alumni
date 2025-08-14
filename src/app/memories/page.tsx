'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
  likes: number
  likedBy: string[]
  comments: Comment[]
  createdAt: string
}

export default function MemoryWallPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories')
      if (response.ok) {
        const data = await response.json()
        
        // ✅ FIXED: Handle new API response format
        let memoriesArray: Memory[] = []
        if (Array.isArray(data)) {
          memoriesArray = data
        } else if (data.success && Array.isArray(data.memories)) {
          memoriesArray = data.memories
        } else if (data.memories && Array.isArray(data.memories)) {
          memoriesArray = data.memories
        } else {
          console.error('❌ Unexpected API response format for memories page:', data)
          memoriesArray = []
        }
        
        setMemories(memoriesArray)
      } else {
        setError('Failed to load memories')
      }
    } catch (err) {
      setError('Error loading memories')
      console.error('❌ Error loading memories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (memoryId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(memoryId))
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Recent'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Recent'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">
              Memory Wall
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Loading cherished moments from our DLSO family...
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden animate-pulse border border-slate-200/50">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30 flex items-center justify-center">
        <div className="text-center p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 max-w-md mx-4">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Unable to Load Memories</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (memories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">
              Memory Wall
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              No memories have been shared yet. Be the first to add a cherished moment from our DLSO journey!
            </p>
            <Link 
              href="/memories/new"
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold text-lg inline-block shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Share Your First Memory
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">
            Memory Wall
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Explore the beautiful collection of memories, experiences, and moments that define our DLSO Ondo Alumni community.
          </p>
          <Link 
            href="/memories/new"
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-lg inline-block shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mb-12"
          >
            + Add New Memory
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memories.map((memory) => (
            <div 
              key={memory._id}
              className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-blue-100">
                {memory.imageUrl && !imageLoadErrors.has(memory._id) ? (
                  <Image
                    src={memory.imageUrl}
                    alt={memory.title || 'Memory photo'}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(memory._id)}
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
                    </div>
                  </div>
                )}
                
                {memory.occasion && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {memory.occasion}
                    </span>
                  </div>
                )}

                {memory.year && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {memory.year}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                  {memory.title || 'Untitled Memory'}
                </h2>
                
                <p className="text-slate-600 mb-4 line-clamp-3">
                  {memory.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span className="flex items-center space-x-1">
                      <span>❤️</span>
                      <span>{memory.likes || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>💬</span>
                      <span>{memory.comments?.length || 0}</span>
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {memory.authorName || 'Anonymous'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(memory.createdAt)}
                    </p>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {memories.length > 0 && (
          <div className="text-center mt-16">
            <p className="text-slate-600 mb-4">
              Showing {memories.length} precious memories from our DLSO family
            </p>
            <div className="text-sm text-slate-500">
              Want to contribute? <Link href="/memories/new" className="text-purple-600 hover:text-purple-700 font-medium">Share your story</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}