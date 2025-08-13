// src/types/exco.ts - Enhanced TypeScript interface

export interface ExcoMemberPersonalInfo {
  birthday?: string
  wedding?: string
  bornAgain?: string
  bibleVerse?: string // Can contain multiple verses separated by commas
  maritalStatus?: string
  favoriteColors?: string[]
  favoriteMeal?: string
  hobbies?: string[]
}

export interface ExcoMember {
  id: string
  name: string
  title: string
  role: 'President' | 'Vice President' | 'General Secretary' | 'Financial Secretary' | 'Program & Publicity Secretary' | 'Prayer & Welfare Secretary'
  phone: string
  whatsappLink: string
  bio: string
  detailedBio: string
  currentPositions: string[]
  personalInfo: ExcoMemberPersonalInfo
  image?: string
  location: string
  country: string
  ministryFocus: string
  createdAt: Date
  updatedAt: Date
}

export interface ExcoMembersResponse {
  success: boolean
  members: ExcoMember[]
  error?: string
}

export interface ExcoPhotoUploadRequest {
  memberId: string
  imageUrl: string
}

export interface ExcoPhotoUploadResponse {
  success: boolean
  message: string
  imageUrl?: string
  member?: ExcoMember
  error?: string
}