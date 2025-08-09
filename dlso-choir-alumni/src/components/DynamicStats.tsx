'use client'

import { useState, useEffect } from 'react'

interface Memory {
  _id: string
  title: string
  description: string
  authorEmail?: string
  authorId?: string
  likes: number
  createdAt: string
}

interface Stats {
  totalMemories: number
  totalUsers: number
  yearsActive: number
  totalLikes: number
}

export default function DynamicStats() {
  const [stats, setStats] = useState<Stats>({
    totalMemories: 0,
    totalUsers: 0,
    yearsActive: 0,
    totalLikes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch memories to calculate stats
        const memoriesResponse = await fetch('/api/memories')
        if (memoriesResponse.ok) {
          const memories: Memory[] = await memoriesResponse.json()
          
          // Calculate stats from real data
          const totalMemories = memories.length
          const totalLikes = memories.reduce((sum: number, memory: Memory) => sum + (memory.likes || 0), 0)
          
          // Get unique users
          const uniqueUsers = new Set(memories.map((memory: Memory) => memory.authorEmail || memory.authorId))
          const totalUsers = uniqueUsers.size
          
          // Calculate years active (from 2005 when DLSO Youth Choir started)
          const currentYear = new Date().getFullYear()
          const yearsActive = currentYear - 2005
          
          setStats({
            totalMemories,
            totalUsers,
            yearsActive,
            totalLikes
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
      <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Our Impact</h3>
      <div className="grid md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-amber-600 mb-2">
            {stats.totalUsers}+
          </div>
          <div className="text-gray-600">Alumni Members</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.yearsActive}+
          </div>
          <div className="text-gray-600">Years of Ministry</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.totalMemories}+
          </div>
          <div className="text-gray-600">Shared Memories</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {stats.totalLikes}+
          </div>
          <div className="text-gray-600">Memories Loved</div>
        </div>
      </div>
      
      {stats.totalMemories === 0 && (
        <div className="text-center mt-6 p-4 bg-amber-50 rounded-lg">
          <p className="text-amber-800">
            🎵 Start sharing memories to see our community grow!
          </p>
        </div>
      )}
    </div>
  )
}