import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      isVerified?: boolean
      choirYears?: number[]
      currentChurch?: {
        name: string
        denomination: string
        location: string
      }
      currentMinistryRoles?: string[]
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    isVerified?: boolean
    choirYears?: number[]
    currentChurch?: {
      name: string
      denomination: string
      location: string
    }
    currentMinistryRoles?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    isVerified?: boolean
    choirYears?: number[]
  }
}