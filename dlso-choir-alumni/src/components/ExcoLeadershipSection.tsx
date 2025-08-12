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
  const [uploadProgress, setUploadProgress] = useState<number>(0)
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
        console.log('🔍 EXCO Members loaded:')
        data.members.forEach((member: ExcoMember) => {
          console.log(`- ${member.name}: ID = "${member.id}" (type: ${typeof member.id})`)
        })
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

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    console.log('=== EXCO CLOUDINARY UPLOAD DEBUG ===')
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    console.log('Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'choir_memories')

    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    console.log('Upload URL:', uploadUrl)
    console.log('Upload preset: choir_memories')

    try {
      console.log('Starting EXCO photo upload to Cloudinary...')
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed - Error response:', errorText)
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ EXCO UPLOAD SUCCESS!')
      console.log('Cloudinary response:', data)
      console.log('📸 EXCO Image URL:', data.secure_url)
      
      return data.secure_url
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error)
      throw new Error('Failed to upload EXCO image')
    }
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

    console.log('🔍 Debug Info:')
    console.log('memberId:', memberId)
    console.log('memberId type:', typeof memberId)
    console.log('memberId length:', memberId?.length)
    console.log('file:', file.name, file.size)

    if (!memberId || memberId.trim() === '') {
      alert('⚠️ Member ID is missing! Please try again.')
      console.error('❌ Member ID is invalid:', memberId)
      return
    }

    setUploadingMember(memberId)
    setUploadProgress(0)

    try {
      setUploadProgress(25)
      console.log('📤 Uploading to Cloudinary...')
      const imageUrl = await uploadImageToCloudinary(file)
      console.log('📸 Cloudinary upload successful:', imageUrl)

      setUploadProgress(75)
      console.log('📤 Sending to API:', { memberId, imageUrl })
      
      const response = await fetch('/api/upload-exco-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: memberId,
          imageUrl: imageUrl
        })
      })
      
      const data = await response.json()
      console.log('📥 API Response:', data)
      console.log('Response status:', response.status)
      
      if (response.ok && data.success) {
        setUploadProgress(100)
        setMembers(prev => prev.map(member => 
          member.id === memberId ? { ...member, image: imageUrl } : member
        ))
        alert('Photo uploaded successfully!')
      } else {
        alert(data.error || 'Upload failed')
        console.error('❌ Upload failed:', data)
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUploadingMember(null)
      setEditingMember(null)
      setUploadProgress(0)
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

  // ENHANCED: Better Bible verse formatting for multiple verses
  const formatBibleVerses = (verses?: string) => {
    if (!verses) return null
    const verseList = verses.split(',').map(verse => verse.trim())
    if (verseList.length === 1) return verses
    return verseList.join(' • ')
  }

  // ENHANCED: Better position formatting for long titles
  const formatPosition = (position: string) => {
    // Break long positions into multiple lines if needed
    if (position.length > 50) {
      const parts = position.split(',')
      if (parts.length > 1) {
        return parts.map(part => part.trim()).join(',\n')
      }
    }
    return position
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

          {/* Upload Progress Bar */}
          {uploadingMember && uploadProgress > 0 && (
            <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
              <div className="max-w-6xl mx-auto px-4 py-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {uploadProgress < 50 ? 'Uploading image...' : 
                     uploadProgress < 100 ? 'Saving photo...' : 'Complete!'}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{uploadProgress}%</span>
                </div>
              </div>
            </div>
          )}

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
                  
                  {/* ENHANCED: Better bio display with line height */}
                  <p className="text-purple-100 text-sm mb-6 leading-relaxed">{member.bio}</p>

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

      {/* ENHANCED: Improved modal layout with better spacing and typography */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            
            <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10">
              ✕
            </button>
            
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-t-xl text-white">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-3">{selectedMember!.title} {selectedMember!.name}</h3>
                <div className="text-yellow-400 font-semibold text-xl mb-3">{selectedMember!.role}</div>
                <div className="text-purple-200 text-lg">{selectedMember!.location}, {selectedMember!.country}</div>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              
              {/* ENHANCED: Better detailed bio presentation */}
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                  <span className="text-purple-600 mr-2">📋</span>
                  About {selectedMember!.name}
                </h4>
                <div className="bg-purple-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed text-base">{selectedMember!.detailedBio}</p>
                </div>
              </div>

              {/* ENHANCED: Better current positions display */}
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                  <span className="text-purple-600 mr-2">💼</span>
                  Current Positions & Responsibilities
                </h4>
                <div className="grid gap-3">
                  {selectedMember!.currentPositions.map((position, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <span className="text-gray-700 font-medium whitespace-pre-line">
                        {formatPosition(position)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ENHANCED: Comprehensive personal information display */}
              {selectedMember!.personalInfo && (
                <div>
                  <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                    <span className="text-purple-600 mr-2">👤</span>
                    Personal Information
                  </h4>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      {selectedMember!.personalInfo.birthday && (
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🎂</span>
                          <div>
                            <div className="font-semibold text-gray-800">Birthday</div>
                            <div className="text-gray-600">{selectedMember!.personalInfo.birthday}</div>
                          </div>
                        </div>
                      )}

                      {selectedMember!.personalInfo.wedding && (
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">💒</span>
                          <div>
                            <div className="font-semibold text-gray-800">Wedding Anniversary</div>
                            <div className="text-gray-600">{selectedMember!.personalInfo.wedding}</div>
                          </div>
                        </div>
                      )}

                      {selectedMember!.personalInfo.bornAgain && (
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">✝️</span>
                          <div>
                            <div className="font-semibold text-gray-800">Born Again</div>
                            <div className="text-gray-600">{selectedMember!.personalInfo.bornAgain}</div>
                          </div>
                        </div>
                      )}

                      {selectedMember!.personalInfo.maritalStatus && (
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">👨‍👩‍👧‍👦</span>
                          <div>
                            <div className="font-semibold text-gray-800">Family</div>
                            <div className="text-gray-600">{selectedMember!.personalInfo.maritalStatus}</div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* ENHANCED: Better Bible verse display for multiple verses */}
                    {selectedMember!.personalInfo.bibleVerse && (
                      <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">📖</span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 mb-2">Favorite Bible Verse(s)</div>
                            <div className="text-gray-700 font-medium italic">
                              {formatBibleVerses(selectedMember!.personalInfo.bibleVerse)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ENHANCED: Better color and meal display */}
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      
                      {selectedMember!.personalInfo.favoriteColors && selectedMember!.personalInfo.favoriteColors.length > 0 && (
                        <div>
                          <div className="font-semibold text-gray-800 mb-2 flex items-center">
                            <span className="mr-2">🎨</span>
                            Favorite Colors
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedMember!.personalInfo.favoriteColors.map((color, index) => (
                              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedMember!.personalInfo.favoriteMeal && (
                        <div>
                          <div className="font-semibold text-gray-800 mb-2 flex items-center">
                            <span className="mr-2">🍽️</span>
                            Favorite Meal
                          </div>
                          <div className="text-gray-700 bg-purple-100 rounded-lg p-3">
                            {selectedMember!.personalInfo.favoriteMeal}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* ENHANCED: Better hobbies display */}
                    {selectedMember!.personalInfo.hobbies && selectedMember!.personalInfo.hobbies.length > 0 && (
                      <div className="mt-6">
                        <div className="font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="mr-2">🎯</span>
                          Hobbies & Interests
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember!.personalInfo.hobbies.map((hobby, index) => (
                            <span key={index} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-medium">
                              {hobby}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              <div className="text-center pt-6 border-t border-gray-200">
                <a href={selectedMember!.whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center space-x-2 text-lg">
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