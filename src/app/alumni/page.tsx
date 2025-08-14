'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { alumniContacts, getAlumniStats } from '@/data/alumniContacts'

interface MemoryFromAPI {
  _id: string
  title: string
  description: string
  year?: string
  occasion?: string
  imageUrl?: string
  authorName: string
  authorEmail?: string
  authorImage?: string
  likes: number
  likedBy?: string[]
  comments?: Comment[]
  createdAt: string
}

interface AlumniMember {
  name: string
  email?: string
  image?: string
  memoriesCount: number
  totalLikes: number
  latestMemory: string
  joinedDate: string
  phone?: string
  whatsappLink?: string
  title?: string
  location?: string
  country?: string
  ministrySection?: string
  isFromContacts: boolean
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'contacts'>('all')

  useEffect(() => {
    const fetchAlumni = async (): Promise<void> => {
      try {
        // Fetch memory-based alumni
        const response = await fetch('/api/memories')
        let memoryBasedAlumni: AlumniMember[] = []
        
        if (response.ok) {
          const data: unknown = await response.json()
          let memories: MemoryFromAPI[] = []
          
          // ✅ FIXED: Handle new API response format properly
          if (Array.isArray(data)) {
            memories = data as MemoryFromAPI[]
          } else if (data && typeof data === 'object' && data !== null) {
            const dataObj = data as Record<string, unknown>
            
            // Handle new {success, memories} format
            if (dataObj.success && Array.isArray(dataObj.memories)) {
              memories = dataObj.memories as MemoryFromAPI[]
            }
            // Handle legacy {data} format
            else if (Array.isArray(dataObj.data)) {
              memories = dataObj.data as MemoryFromAPI[]
            }
            // Handle direct memories property
            else if (Array.isArray(dataObj.memories)) {
              memories = dataObj.memories as MemoryFromAPI[]
            }
          }
          
          console.log('📊 Alumni page - processed memories:', memories.length)
          
          if (Array.isArray(memories) && memories.length > 0) {
            const alumniMap = new Map<string, AlumniMember>()
            
            memories.forEach((memory: MemoryFromAPI) => {
              const authorKey = memory.authorEmail || memory.authorName
              if (!authorKey) return
              
              if (alumniMap.has(authorKey)) {
                const existing = alumniMap.get(authorKey)!
                existing.memoriesCount++
                existing.totalLikes += (memory.likes || 0)
                if (new Date(memory.createdAt) > new Date(existing.latestMemory)) {
                  existing.latestMemory = memory.createdAt
                }
              } else {
                alumniMap.set(authorKey, {
                  name: memory.authorName || 'Anonymous',
                  email: memory.authorEmail,
                  image: memory.authorImage,
                  memoriesCount: 1,
                  totalLikes: memory.likes || 0,
                  latestMemory: memory.createdAt,
                  joinedDate: memory.createdAt,
                  isFromContacts: false
                })
              }
            })
            
            memoryBasedAlumni = Array.from(alumniMap.values())
          }
        } else {
          console.error('❌ Failed to fetch memories for alumni:', response.status)
        }
        
        // Add contact-based alumni - ✅ FIXED: Use correct properties
        const contactBasedAlumni: AlumniMember[] = alumniContacts.map(contact => ({
          name: contact.name,
          email: undefined, // AlumniContactData doesn't have email field
          image: undefined, // AlumniContactData doesn't have image field
          phone: contact.phone,
          whatsappLink: contact.whatsappLink,
          title: contact.title,
          location: contact.location,
          country: contact.country,
          ministrySection: contact.ministrySection,
          memoriesCount: 0,
          totalLikes: 0,
          latestMemory: '',
          joinedDate: '2005-01-01', // Default to when DLSO Ondo started
          isFromContacts: true
        }))

        // Merge alumni (memory-based takes priority)
        const mergedAlumni = [...memoryBasedAlumni]
        
        contactBasedAlumni.forEach(contactAlumni => {
          const exists = memoryBasedAlumni.find(memAlumni => 
            memAlumni.email === contactAlumni.email || 
            memAlumni.name === contactAlumni.name
          )
          
          if (!exists) {
            mergedAlumni.push(contactAlumni)
          } else {
            // Update with contact info
            Object.assign(exists, {
              phone: contactAlumni.phone || exists.phone,
              whatsappLink: contactAlumni.whatsappLink || exists.whatsappLink,
              title: contactAlumni.title || exists.title,
              location: contactAlumni.location || exists.location,
              country: contactAlumni.country || exists.country,
              ministrySection: contactAlumni.ministrySection || exists.ministrySection,
            })
          }
        })

        // Sort by activity level
        mergedAlumni.sort((a, b) => {
          if (a.memoriesCount !== b.memoriesCount) {
            return b.memoriesCount - a.memoriesCount
          }
          return b.totalLikes - a.totalLikes
        })

        setAlumni(mergedAlumni)
      } catch (error) {
        console.error('❌ Error fetching alumni:', error)
        setAlumni(alumniContacts.map(contact => ({
          name: contact.name,
          email: undefined,
          image: undefined,
          phone: contact.phone,
          whatsappLink: contact.whatsappLink,
          title: contact.title,
          location: contact.location,
          country: contact.country,
          ministrySection: contact.ministrySection,
          memoriesCount: 0,
          totalLikes: 0,
          latestMemory: '',
          joinedDate: '2005-01-01',
          isFromContacts: true
        })))
      } finally {
        setLoading(false)
      }
    }

    fetchAlumni()
  }, [])

  const filteredAlumni = alumni.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.ministrySection?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && member.memoriesCount > 0) ||
                      (activeTab === 'contacts' && member.isFromContacts)

    return matchesSearch && matchesTab
  })

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Long time ago'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
  }

  const stats = getAlumniStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">
              DLSO Alumni Directory
            </h1>
            <p className="text-xl text-slate-600">Loading our amazing community...</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/90 rounded-xl p-6 animate-pulse border border-slate-200/50">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-amber-50/30">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">
            DLSO Alumni Directory
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
            Connect with fellow DLSO Ondo alumni from across the globe. Our community spans continents, 
            united by the bonds of faith and fellowship formed during our time together.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {alumni.length}
              </div>
              <div className="text-slate-600 font-medium">Total Alumni</div>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {stats.countries}+
              </div>
              <div className="text-slate-600 font-medium">Countries</div>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                {alumni.filter(a => a.memoriesCount > 0).length}
              </div>
              <div className="text-slate-600 font-medium">Active Members</div>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {new Date().getFullYear() - 2005}+
              </div>
              <div className="text-slate-600 font-medium">Years Strong</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 mb-12 border border-slate-200/50">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search alumni by name, email, location, or ministry section..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'contacts'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="ml-2 text-sm">
                    ({tab === 'all' ? alumni.length : 
                      tab === 'active' ? alumni.filter(a => a.memoriesCount > 0).length :
                      alumni.filter(a => a.isFromContacts).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        {filteredAlumni.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">No alumni found</h3>
            <p className="text-slate-600 mb-8">
              {searchTerm ? 'Try adjusting your search terms.' : 'No alumni match the current filter.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {filteredAlumni.map((member, index) => (
                <div 
                  key={`${member.email || member.name}-${index}`}
                  className="group bg-white/90 backdrop-blur-md rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{getInitials(member.name)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">{member.name}</h3>
                      {member.title && <p className="text-sm text-purple-600 font-medium">{member.title}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {member.location && (
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="w-4 mr-2">📍</span>
                        <span className="truncate">{member.location}{member.country && `, ${member.country}`}</span>
                      </div>
                    )}

                    {member.ministrySection && (
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="w-4 mr-2">🎵</span>
                        <span className="truncate">{member.ministrySection}</span>
                      </div>
                    )}

                    {member.memoriesCount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          {member.memoriesCount} memories • {member.totalLikes} likes
                        </span>
                        <span className="text-emerald-600 font-medium">Active</span>
                      </div>
                    )}

                    {member.email && (
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="w-4 mr-2">✉️</span>
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className="text-xs text-slate-500">
                        Joined {formatDate(member.joinedDate)}
                      </span>
                      {member.whatsappLink && (
                        <a 
                          href={member.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 transition-colors"
                          title="Message on WhatsApp"
                        >
                          <span className="text-lg">💬</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-slate-600 mb-6">
                Showing {filteredAlumni.length} of {alumni.length} alumni members
              </p>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Want to be added to our directory? <Link href="/memories/new" className="text-purple-600 hover:text-purple-700 font-medium">Share a memory</Link> to join our active community.
                </p>
                <p className="text-sm text-slate-500">
                  Missing someone? <a href="mailto:admin@dlsoalumni.org" className="text-purple-600 hover:text-purple-700 font-medium">Let us know</a> and we&apos;ll reach out to them.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}