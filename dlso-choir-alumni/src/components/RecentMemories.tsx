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
  authorEmail?: string
  authorImage?: string
  likes: number
  likedBy?: string[]
  comments?: Comment[]
  createdAt: string
}

export default function RecentMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchRecentMemories = async () => {
      try {
        const response = await fetch('/api/memories')
        if (response.ok) {
          const data = await response.json()
          // Show only the 6 most recent memories
          setMemories(data.slice(0, 6))
        }
      } catch (error) {
        console.error('Error fetching memories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentMemories()
  }, [])

  const handleImageError = (memoryId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(memoryId))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
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
                    alt={memory.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(memory._id)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  {memory.title}
                </h3>
                
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                  {memory.description}
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