'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface MemoryData {
  _id: string
  title: string
  authorName: string
  authorImage?: string
  occasion?: string
  year?: string
  createdAt: string
}

interface Activity {
  id: string
  type: 'memory' | 'like' | 'comment'
  authorName: string
  authorImage?: string
  title?: string
  action: string
  timestamp: string
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await fetch('/api/memories')
        if (response.ok) {
          const memories: MemoryData[] = await response.json()
          
          // Convert memories to activities and sort by date
          const memoryActivities: Activity[] = memories
            .slice(0, 5) // Get 5 most recent
            .map((memory: MemoryData) => ({
              id: memory._id,
              type: 'memory' as const,
              authorName: memory.authorName || 'Anonymous',
              authorImage: memory.authorImage,
              title: memory.title,
              action: `shared a new memory${memory.occasion ? ` from ${memory.occasion}` : ''}${memory.year ? ` (${memory.year})` : ''}`,
              timestamp: memory.createdAt
            }))

          setActivities(memoryActivities)
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'memory': return '📸'
      case 'like': return '❤️'
      case 'comment': return '💬'
      default: return '✨'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'memory': return 'bg-amber-100 text-amber-600'
      case 'like': return 'bg-red-100 text-red-600'
      case 'comment': return 'bg-blue-100 text-blue-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 mb-20 border border-slate-200/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-slate-50/50 rounded-2xl"></div>
        <div className="relative">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-8">Recent Activity</h3>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50/50 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 mb-20 border border-slate-200/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-slate-50/50 rounded-2xl"></div>
        <div className="relative">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-8">Recent Activity</h3>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <p className="text-slate-600 mb-4">No recent activity yet</p>
            <p className="text-sm text-slate-500">
              Share the first memory to get the community started!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 mb-20 border border-slate-200/50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-slate-50/50 rounded-2xl"></div>
      <div className="relative">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-8">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors border border-slate-200/30">
              <div className="flex items-center space-x-3">
                {/* Activity Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* User Avatar */}
                {activity.authorImage ? (
                  <Image
                    src={activity.authorImage}
                    alt={activity.authorName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getInitials(activity.authorName)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 truncate">
                  <span className="font-medium">{activity.authorName}</span> {activity.action}
                  {activity.title && (
                    <span className="text-purple-600 font-medium"> &ldquo;{activity.title}&rdquo;</span>
                  )}
                </p>
                <p className="text-sm text-slate-500">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length > 0 && (
          <div className="text-center mt-6">
            <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors">
              View All Activity →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}