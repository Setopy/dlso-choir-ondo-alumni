// src/lib/auth.ts - Enhanced for Netlify deployment
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Collect email for newsletter when user signs in
        if (session.user.email) {
          try {
            // ✅ Fixed: Get database instance correctly
            const client = await clientPromise
            const db = client.db()
            
            // Check if email already exists
            const existingEmail = await db.collection('newsletter_emails').findOne({
              email: session.user.email
            })
            
            if (!existingEmail) {
              // Add new email to newsletter collection
              await db.collection('newsletter_emails').insertOne({
                email: session.user.email,
                name: session.user.name || '',
                source: 'google_signin',
                subscribedAt: new Date().toISOString(),
                subscribed: true,
                country: 'Unknown',
                createdAt: new Date()
              })
            }
          } catch (error) {
            console.error('Error collecting email for newsletter:', error)
          }
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Enhanced redirect handling for Netlify
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  events: {
    async signIn({ user }) {
      console.log('✅ User signed in:', user.email)
    },
    async signOut() {
      console.log('✅ User signed out')
    }
  },
  // Enhanced configuration for serverless deployment
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.your-domain.com' : undefined
      }
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  // Add URL configuration for better Netlify support
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
}