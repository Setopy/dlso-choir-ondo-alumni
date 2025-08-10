'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { alumniContacts, getAlumniStats} from '@/data/alumniContacts'

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
          
          if (Array.isArray(data)) {
            memories = data as MemoryFromAPI[]
          } else if (data && typeof data === 'object' && data !== null) {
            const dataObj = data as Record<string, unknown>
            if (Array.isArray(dataObj.data)) {
              memories = dataObj.data as MemoryFromAPI[]
            }
          }
          
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
        }
        
        // Add contact-based alumni
        const contactBasedAlumni: AlumniMember[] = alumniContacts.map(contact => ({
          name: contact.name,
          email: undefined,
          image: undefined,
          memoriesCount: 0,
          totalLikes: 0,
          latestMemory: '',
          joinedDate: '',
          phone: contact.phone,
          whatsappLink: contact.whatsappLink,
          title: contact.title,
          location: contact.location,
          country: contact.country,
          ministrySection: contact.ministrySection,
          isFromContacts: true
        }))
        
        // Merge and deduplicate
        const allAlumni = [...memoryBasedAlumni]
        
        contactBasedAlumni.forEach(contactAlumni => {
          // Check if this person already exists in memory-based alumni
          const existing = memoryBasedAlumni.find(memAlumni => 
            memAlumni.name.toLowerCase().trim() === contactAlumni.name.toLowerCase().trim()
          )
          
          if (existing) {
            // Enhance existing with contact info
            existing.phone = contactAlumni.phone
            existing.whatsappLink = contactAlumni.whatsappLink
            existing.title = contactAlumni.title
            existing.location = contactAlumni.location
            existing.country = contactAlumni.country
            existing.ministrySection = contactAlumni.ministrySection
          } else {
            // Add new contact-only alumni
            allAlumni.push(contactAlumni)
          }
        })
        
        // Sort: memory-based alumni first, then by name
        const sortedAlumni = allAlumni.sort((a, b) => {
          if (a.memoriesCount > 0 && b.memoriesCount === 0) return -1
          if (a.memoriesCount === 0 && b.memoriesCount > 0) return 1
          if (a.memoriesCount !== b.memoriesCount) return b.memoriesCount - a.memoriesCount
          return a.name.localeCompare(b.name)
        })
        
        setAlumni(sortedAlumni)
        
      } catch (error: unknown) {
        console.error('Error fetching alumni:', error)
        setAlumni(alumniContacts.map(contact => ({
          name: contact.name,
          email: undefined,
          image: undefined,
          memoriesCount: 0,
          totalLikes: 0,
          latestMemory: '',
          joinedDate: '',
          phone: contact.phone,
          whatsappLink: contact.whatsappLink,
          title: contact.title,
          location: contact.location,
          country: contact.country,
          ministrySection: contact.ministrySection,
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
                         member.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.ministrySection?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === 'active') return matchesSearch && member.memoriesCount > 0
    if (activeTab === 'contacts') return matchesSearch && member.isFromContacts && member.memoriesCount === 0
    return matchesSearch
  })

  const stats = getAlumniStats()
  const activeAlumni = alumni.filter(a => a.memoriesCount > 0).length

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Contact Info'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  const getCountryFlag = (country: string) => {
    switch (country) {
      case 'Nigeria': return '🇳🇬'
      case 'Norway': return '🇳🇴'
      case 'Canada': return '🇨🇦'
      default: return '🌍'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50">
        <header className="bg-white shadow-sm border-b-2 border-amber-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="w-12 h-12 bg-gradient-to-br from-amber-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✨</span>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Alumni Directory</h1>
                  <p className="text-gray-600">Connect with fellow Ondo DLSO Alumni</p>
                </div>
              </div>
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50">
      <header className="bg-white shadow-sm border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="w-12 h-12 bg-gradient-to-br from-amber-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">✨</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Alumni Directory</h1>
                <p className="text-gray-600">Connect with fellow Ondo DLSO Alumni</p>
              </div>
            </div>
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Stats and Search */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-600">{alumni.length}</div>
                <div className="text-sm text-gray-600">Total Alumni</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{activeAlumni}</div>
                <div className="text-sm text-gray-600">Active on Platform</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.countries}</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.withTitles}</div>
                <div className="text-sm text-gray-600">With Titles</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Alumni ({alumni.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Active ({activeAlumni})
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'contacts' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Contacts ({alumni.length - activeAlumni})
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search alumni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {filteredAlumni.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {searchTerm ? 'No alumni found' : 'No alumni yet'}
            </h3>
            <p className="text-gray-600 mb-8">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Alumni will appear here as they share memories on the platform'
              }
            </p>
            <Link 
              href="/memories/new"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
            >
              Share Your First Memory
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((member, index) => (
              <div 
                key={member.email || member.phone || member.name + index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
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
                      <span className="text-white font-bold text-lg">
                        {getInitials(member.name)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      {member.name}
                      {member.country && (
                        <span className="text-sm">{getCountryFlag(member.country)}</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      {member.ministrySection || 'DLSO Alumni'}
                      {member.memoriesCount > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {member.memoriesCount > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Memories shared:</span>
                        <span className="font-medium text-amber-600">{member.memoriesCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total likes received:</span>
                        <span className="font-medium text-red-500">{member.totalLikes}</span>
                      </div>
                    </>
                  )}
                  
                  {member.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-blue-600">{member.location}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-700">
                      {member.memoriesCount > 0 ? formatDate(member.latestMemory) : 'Contact Available'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  {member.whatsappLink && (
                    <a 
                      href={member.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors w-full text-center block"
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  
                  {member.memoriesCount > 0 && (
                    <Link 
                      href="/memories" 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium block text-center"
                    >
                      View their memories →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Connect with Our Alumni Community! ✨
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join {alumni.length} Ondo DLSO Alumni from {stats.countries} countries. Share memories, 
              connect via WhatsApp, and strengthen our spiritual fellowship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/memories/new"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
              >
                Share Your Memory
              </Link>
              <Link 
                href="/memories"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse Memories
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}