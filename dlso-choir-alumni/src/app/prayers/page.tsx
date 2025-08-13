'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageCircle, Calendar, Tag, Send, Plus, Loader2 } from 'lucide-react'

const prayerCategories = [
  { value: 'healing', label: 'Healing', emoji: '🙏', color: 'bg-red-100 text-red-700' },
  { value: 'ministry', label: 'Ministry', emoji: '⛪', color: 'bg-blue-100 text-blue-700' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', color: 'bg-green-100 text-green-700' },
  { value: 'career', label: 'Career', emoji: '💼', color: 'bg-purple-100 text-purple-700' },
  { value: 'personal', label: 'Personal', emoji: '💭', color: 'bg-gray-100 text-gray-700' },
  { value: 'financial', label: 'Financial', emoji: '💰', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'spiritual-growth', label: 'Spiritual Growth', emoji: '📖', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'relationships', label: 'Relationships', emoji: '💝', color: 'bg-pink-100 text-pink-700' },
  { value: 'travel-safety', label: 'Travel Safety', emoji: '✈️', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'church-needs', label: 'Church Needs', emoji: '🏛️', color: 'bg-amber-100 text-amber-700' }
]

interface PrayerRequest {
  _id: string
  title: string
  description: string
  category: string
  requesterName: string
  isAnonymous: boolean
  urgencyLevel: string
  prayerCount: number
  createdAt: string
  status: string
  tags: string[]
}

export default function PrayerRequestsPage() {
  const [showForm, setShowForm] = useState(false)
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    isAnonymous: false,
    urgencyLevel: 'normal'
  })

  // Load prayer requests from database
  useEffect(() => {
    loadPrayerRequests()
  }, [])

  const loadPrayerRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/prayers')
      if (response.ok) {
        const data = await response.json()
        setPrayerRequests(data)
      } else {
        console.error('Failed to load prayer requests')
      }
    } catch (error) {
      console.error('Error loading prayers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      
      // Send to real database via API
      const response = await fetch('/api/prayers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requesterName: formData.isAnonymous ? 'Anonymous' : 'You',
          tags: []
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Success! Reset form and reload data
        setFormData({
          title: '',
          description: '',
          category: 'personal',
          isAnonymous: false,
          urgencyLevel: 'normal'
        })
        setShowForm(false)
        
        // Reload prayer requests to show the new one
        await loadPrayerRequests()
        
        alert('Prayer request submitted successfully! The choir family will pray for you. 🙏')
      } else {
        alert('Error submitting prayer request: ' + result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to submit prayer request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePray = async (id: string) => {
    // For now, just increment locally (we can add API endpoint later)
    setPrayerRequests(requests => 
      requests.map(req => 
        req._id === id 
          ? { ...req, prayerCount: req.prayerCount + 1 }
          : req
      )
    )
  }

  const getCategoryInfo = (category: string) => {
    return prayerCategories.find(cat => cat.value === category) || prayerCategories[0]
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🎵</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">DLSO Prayer Wall</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Prayer Requests</h1>
          <p className="text-xl text-gray-600 mb-6">
            Again I say unto you, That if two of you shall agree on earth as touching any thing 
            that they shall ask, it shall be done for them of my Father which is in heaven.- Matthew 18:19
          </p>
          
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2 mx-auto disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span>Submit Prayer Request</span>
          </button>
        </div>

        {/* Prayer Request Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submit a Prayer Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prayer Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief title for your prayer request..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {prayerCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.emoji} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please share more details about your prayer request..."
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                    Submit anonymously
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({...formData, urgencyLevel: e.target.value})}
                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{submitting ? 'Submitting...' : 'Submit Prayer Request'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading prayer requests...</p>
          </div>
        )}

        {/* Prayer Requests List */}
        {!loading && (
          <div className="space-y-6">
            {prayerRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="text-6xl mb-4">🙏</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Prayer Requests Yet</h3>
                <p className="text-gray-600">Be the first to submit a prayer request and start building our prayer community!</p>
              </div>
            ) : (
              prayerRequests.map((request) => {
                const categoryInfo = getCategoryInfo(request.category)
                
                return (
                  <div key={request._id} className="bg-white rounded-xl shadow-lg p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">{categoryInfo.emoji}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{request.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{request.requesterName}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatTimeAgo(request.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {request.urgencyLevel === 'urgent' && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                            Urgent
                          </span>
                        )}
                        {request.status === 'answered' && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                            ✅ Answered
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 mb-4">{request.description}</p>

                    {/* Category & Tags */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <span className={`px-2 py-1 rounded text-sm font-medium ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                      </div>
                      {request.tags?.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handlePray(request._id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Pray</span>
                          <span className="font-semibold">{request.prayerCount}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                          <MessageCircle className="w-4 h-4" />
                          <span>Comment</span>
                        </button>
                      </div>
                      
                      <span className="text-sm text-gray-500 capitalize">
                        Status: <span className="font-medium">{request.status}</span>
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {prayerRequests.length}
              </div>
              <div className="text-gray-600">Active Requests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {prayerRequests.reduce((sum, req) => sum + req.prayerCount, 0)}
              </div>
              <div className="text-gray-600">Prayers Offered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600 mb-1">
                {prayerRequests.filter(req => req.status === 'answered').length}
              </div>
              <div className="text-gray-600">Answered Prayers</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}