'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface ExcoMember {
  id: string
  name: string
  title: string
  role: string
  phone: string
  whatsappLink: string
  bio: string
  detailedBio: string
  currentPositions: string[]
  personalInfo: {
    birthday?: string
    wedding?: string
    bornAgain?: string
    bibleVerse?: string
    maritalStatus?: string
    favoriteColors?: string[]
    favoriteMeal?: string
    hobbies?: string[]
  }
  image?: string
  location: string
  country: string
  ministryFocus: string
}

export default function ExcoLeadershipSection() {
  const [selectedMember, setSelectedMember] = useState<ExcoMember | null>(null)
  const [members, setMembers] = useState<ExcoMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [uploadingMember, setUploadingMember] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchExcoMembers()
  }, [])

  const fetchExcoMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/exco-members')
      const data = await response.json()
      
      if (data.success) {
        setMembers(data.members)
      } else {
        setError(data.error || 'Failed to fetch EXCO members')
      }
    } catch {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const getCountryFlag = (country: string) => {
    if (country === 'Nigeria') return '🇳🇬'
    if (country === 'South Africa') return '🇿🇦'
    if (country === 'Mexico') return '🇲🇽'
    return '🌍'
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
  }

  const getRoleIcon = (role: string) => {
    if (role === 'President') return '👑'
    if (role === 'Vice President') return '🌟'
    if (role === 'General Secretary') return '📋'
    if (role === 'Program & Publicity Secretary') return '📢'
    if (role === 'Financial Secretary') return '💰'
    if (role === 'Prayer & Welfare Secretary') return '🙏'
    return '⭐'
  }

  const getRoleBadgeColor = (role: string) => {
    if (role === 'President') return 'bg-yellow-500 text-white'
    if (role === 'Vice President') return 'bg-blue-500 text-white'
    if (role === 'General Secretary') return 'bg-green-500 text-white'
    if (role === 'Program & Publicity Secretary') return 'bg-orange-500 text-white'
    if (role === 'Financial Secretary') return 'bg-purple-500 text-white'
    if (role === 'Prayer & Welfare Secretary') return 'bg-pink-500 text-white'
    return 'bg-gray-500 text-white'
  }

  const handlePhotoUpload = async (memberId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploadingMember(memberId)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('memberId', memberId)

      const response = await fetch('/api/upload-exco-photo', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setMembers(prev => prev.map(member => 
          member.id === memberId ? { ...member, image: data.imageUrl } : member
        ))
        alert('Photo uploaded successfully!')
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploadingMember(null)
      setEditingMember(null)
    }
  }

  const triggerFileInput = (memberId: string) => {
    setEditingMember(memberId)
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && editingMember) {
      handlePhotoUpload(editingMember, file)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-yellow-400 text-xl mb-4">Loading EXCO Leadership...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-400 text-xl mb-4">Error Loading EXCO Leadership</div>
          <div className="text-purple-200 mb-6">{error}</div>
          <button onClick={fetchExcoMembers} className="bg-yellow-500 hover:bg-yellow-400 text-purple-900 px-6 py-3 rounded-lg font-semibold">
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <div>
      <section className="py-16 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-yellow-500 rounded-full px-6 py-2 mb-6">
              <span className="text-2xl">👑</span>
              <span className="text-purple-900 font-bold">Executive Committee</span>
            </div>
            
            <h2 className="text-5xl font-bold mb-6">
              Meet Our EXCO Leadership
            </h2>
            
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Our dedicated Executive Committee members serve our global alumni community with passion and commitment.
            </p>
          </div>

          <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8 mb-16">
            {members.map((member) => (
              <div key={member.id} className="bg-white/10 rounded-xl p-6 border border-purple-300/20 hover:border-yellow-400/50 transition-all duration-300 group">
                
                <div className="relative mb-6">
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 p-1">
                    <div className="w-full h-full rounded-full bg-purple-900 flex items-center justify-center relative cursor-pointer" onClick={() => triggerFileInput(member.id)}>
                      
                      {uploadingMember === member.id ? (
                        <div className="text-yellow-400 flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mb-1"></div>
                          <span className="text-xs">Uploading...</span>
                        </div>
                      ) : member.image ? (
                        <Image src={member.image} alt={member.name} width={100} height={100} className="rounded-full object-cover w-full h-full" />
                      ) : (
                        <span className="text-yellow-400 font-bold text-2xl">{getInitials(member.name)}</span>
                      )}
                      
                    </div>
                  </div>
                  
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-sm shadow-lg">
                    {getCountryFlag(member.country)}
                  </div>

                  <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-lg shadow-lg">
                    {getRoleIcon(member.role)}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{member.title} {member.name}</h3>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${getRoleBadgeColor(member.role)}`}>
                    {member.role}
                  </div>
                  
                  <div className="text-purple-200 text-sm mb-3">{member.location}, {member.country}</div>
                  
                  <div className="text-yellow-300 text-sm font-medium mb-4 bg-purple-800/50 rounded-lg px-3 py-2">
                    {member.ministryFocus}
                  </div>
                  
                  <p className="text-purple-100 text-sm mb-6">{member.bio}</p>

                  <div className="space-y-3">
                    <a href={member.whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </a>
                    
                    <button onClick={() => setSelectedMember(member)} className="w-full bg-yellow-500 hover:bg-yellow-400 text-purple-900 px-4 py-3 rounded-lg font-semibold">
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 rounded-xl p-8 border border-purple-300/20">
              <h3 className="text-3xl font-bold text-yellow-400 mb-6">Our EXCO Mission</h3>
              <p className="text-xl text-purple-100 mb-8 max-w-4xl mx-auto">
                Our Executive Committee stands ready to serve and support your journey in the DLSO Alumni community.
              </p>
            </div>
          </div>

        </div>
      </section>

      {selectedMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            
            <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10">
              ✕
            </button>
            
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{selectedMember!.title} {selectedMember!.name}</h3>
                <div className="text-yellow-400 font-semibold text-lg mb-2">{selectedMember!.role}</div>
                <div className="text-purple-200">{selectedMember!.location}, {selectedMember!.country}</div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Current Positions</h4>
                <div className="space-y-2">
                  {selectedMember!.currentPositions.map((position, index) => (
                    <div key={index} className="p-2 bg-purple-50 rounded-lg">
                      <span className="text-gray-700">{position}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMember!.personalInfo && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Personal Information</h4>
                  <div className="bg-purple-50 rounded-lg p-4 space-y-3 text-sm">
                    {selectedMember!.personalInfo.birthday && (
                      <div>Birthday: {selectedMember!.personalInfo.birthday}</div>
                    )}
                    {selectedMember!.personalInfo.bibleVerse && (
                      <div>Favorite Verse: {selectedMember!.personalInfo.bibleVerse}</div>
                    )}
                    {selectedMember!.personalInfo.maritalStatus && (
                      <div>{selectedMember!.personalInfo.maritalStatus}</div>
                    )}
                    {selectedMember!.personalInfo.favoriteColors && selectedMember!.personalInfo.favoriteColors.length > 0 && (
                      <div>Favorite Colors: {selectedMember!.personalInfo.favoriteColors.join(', ')}</div>
                    )}
                    {selectedMember!.personalInfo.hobbies && selectedMember!.personalInfo.hobbies.length > 0 && (
                      <div>Hobbies: {selectedMember!.personalInfo.hobbies.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-center">
                <a href={selectedMember!.whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2">
                  <span>💬</span>
                  <span>Connect via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}