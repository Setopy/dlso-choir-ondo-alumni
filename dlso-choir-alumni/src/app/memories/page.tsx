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

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories')
      if (response.ok) {
        const data = await response.json()
        setMemories(data)
      } else {
        setError('Failed to load memories')
      }
    } catch (err) {
      setError('Error loading memories')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading memories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="w-12 h-12 bg-gradient-to-br from-amber-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎵</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Memory Wall</h1>
                <p className="text-gray-600">Cherished moments from our choir family</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/memories/new" 
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
              >
                + Share Memory
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {memories.length === 0 && !loading && !error ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📸</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No memories shared yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Be the first to share a special moment from our choir family! 
              Your memories help preserve our musical and spiritual legacy.
            </p>
            <Link 
              href="/memories/new"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
            >
              Share Your First Memory
            </Link>
          </div>
        ) : (
          /* Memory Grid */
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Our Choir Memories ({memories.length})
              </h2>
              <div className="text-sm text-gray-500">
                Latest memories first
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {memories.map((memory) => (
                <div 
                  key={memory._id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Memory Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-amber-100 to-blue-100 flex items-center justify-center">
                    {memory.imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={memory.imageUrl}
                          alt={memory.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <span className="text-4xl mb-2 block">🎵</span>
                        <p className="text-sm">No photo</p>
                      </div>
                    )}
                  </div>

                  {/* Memory Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                        {memory.title}
                      </h3>
                      {(memory.year || memory.occasion) && (
                        <div className="flex flex-col items-end text-xs text-gray-500 ml-4">
                          {memory.year && <span>{memory.year}</span>}
                          {memory.occasion && <span>{memory.occasion}</span>}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {memory.description}
                    </p>

                    {/* Memory Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span>{memory.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{memory.comments?.length || 0}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{memory.authorName}</p>
                        <p className="text-xs">{formatDate(memory.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}