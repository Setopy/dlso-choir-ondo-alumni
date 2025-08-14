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
          const data = await memoriesResponse.json()
          
          // ✅ HANDLE NEW API RESPONSE FORMAT: Extract memories array
          let memories: Memory[] = []
          if (Array.isArray(data)) {
            memories = data
          } else if (data.success && Array.isArray(data.memories)) {
            memories = data.memories
          } else if (data.memories && Array.isArray(data.memories)) {
            memories = data.memories
          } else {
            console.error('❌ Unexpected API response format for stats:', data)
            memories = []
          }
          
          // Calculate stats from real data
          const totalMemories = memories.length
          const totalLikes = memories.reduce((sum: number, memory: Memory) => sum + (memory.likes || 0), 0)
          
          // Get unique users
          const uniqueUsers = new Set(
            memories
              .map((memory: Memory) => memory.authorEmail || memory.authorId)
              .filter(Boolean) // Remove null/undefined values
          )
          const totalUsers = uniqueUsers.size
          
          // Calculate years active (from 2005 when DLSO Ondo Region started)
          const currentYear = new Date().getFullYear()
          const yearsActive = currentYear - 2005
          
          setStats({
            totalMemories,
            totalUsers,
            yearsActive,
            totalLikes
          })
        } else {
          console.error('❌ Failed to fetch memories for stats:', memoriesResponse.status)
        }
      } catch (error) {
        console.error('❌ Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 mb-20 border border-slate-200/50">
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
    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 mb-20 border border-slate-200/50">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-purple-50/30 rounded-2xl"></div>
      <div className="relative">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-10 text-center">
          Our Impact
        </h3>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
              {stats.totalUsers}+
            </div>
            <div className="text-slate-600 font-medium">Alumni Members</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
              {stats.yearsActive}+
            </div>
            <div className="text-slate-600 font-medium">Years of Ministry</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
              {stats.totalMemories}+
            </div>
            <div className="text-slate-600 font-medium">Shared Memories</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
              {stats.totalLikes}+
            </div>
            <div className="text-slate-600 font-medium">Memories Loved</div>
          </div>
        </div>
        
        {stats.totalMemories === 0 && (
          <div className="text-center mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
            <p className="text-amber-800 font-medium">
              ✨ Start sharing memories to see our community grow!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}