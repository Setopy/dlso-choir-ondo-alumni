'use client'

import { useState, useEffect } from 'react'
import { alumniContacts } from '@/data/alumniContacts'

interface NewsletterSubscriber {
  id: string
  email: string
  name: string
  subscribed: boolean
  subscribedAt: string
  country?: string
  ministrySection?: string
}

interface Newsletter {
  id: string
  subject: string
  content: string
  recipientCount: number
  sentAt: string
  openRate?: number
}

export default function EmailNewsletterSystem() {
  const [activeTab, setActiveTab] = useState<'compose' | 'subscribers' | 'history'>('compose')
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  
  // Newsletter composition
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'nigeria' | 'international' | 'dlso'>('all')
  const [previewMode, setPreviewMode] = useState(false)
  const [sending, setSending] = useState(false)

  // Load subscribers from alumni contacts + additional subscribers
  useEffect(() => {
    // Extract emails from alumni contacts who have provided them
    const alumniEmails = alumniContacts
      .filter(contact => contact.additionalInfo?.includes('@'))
      .map(contact => ({
        id: contact.id,
        email: contact.additionalInfo!,
        name: contact.name,
        subscribed: true,
        subscribedAt: '2025-01-01',
        country: contact.country,
        ministrySection: contact.ministrySection
      }))

    // Mock additional subscribers who signed up via website
    const websiteSubscribers: NewsletterSubscriber[] = [
      {
        id: 'web_001',
        email: 'john.alumni@gmail.com',
        name: 'John Alumni',
        subscribed: true,
        subscribedAt: '2025-01-15',
        country: 'Nigeria',
        ministrySection: 'DLSO Alumni'
      },
      {
        id: 'web_002', 
        email: 'mary.dlso@yahoo.com',
        name: 'Mary DLSO',
        subscribed: true,
        subscribedAt: '2025-01-20',
        country: 'Canada',
        ministrySection: 'DLSO Alumni'
      }
    ]

    setSubscribers([...alumniEmails, ...websiteSubscribers])

    // Mock newsletter history
    setNewsletters([
      {
        id: 'news_001',
        subject: 'Welcome to DLSO Alumni Platform!',
        content: 'Our new platform is now live...',
        recipientCount: 45,
        sentAt: '2025-01-10',
        openRate: 78
      },
      {
        id: 'news_002',
        subject: 'January Alumni Gathering',
        content: 'Join us for our monthly gathering...',
        recipientCount: 52,
        sentAt: '2025-01-05',
        openRate: 65
      }
    ])
  }, [])

  // Filter subscribers by segment
  const getFilteredSubscribers = () => {
    const activeSubscribers = subscribers.filter(sub => sub.subscribed)
    
    switch (selectedSegment) {
      case 'nigeria':
        return activeSubscribers.filter(sub => sub.country === 'Nigeria')
      case 'international': 
        return activeSubscribers.filter(sub => sub.country !== 'Nigeria')
      case 'dlso':
        return activeSubscribers.filter(sub => sub.ministrySection === 'DLSO Alumni')
      default:
        return activeSubscribers
    }
  }

  const filteredSubscribers = getFilteredSubscribers()

  // Email templates
  const templates = [
    {
      name: 'Platform Announcement',
      subject: 'DLSO Alumni Platform - New Features Available!',
      content: `Dear DLSO Alumni,

We're excited to share some amazing updates to our alumni platform!

🎉 NEW FEATURES:
• Enhanced alumni directory with ${alumniContacts.length} members
• Memory sharing system
• Prayer request community  
• International alumni from 5 countries

📸 SHARE YOUR MEMORIES
Help us build our memory wall with photos and stories from your DLSO days.

🙏 PRAYER COMMUNITY
Submit prayer requests and testimonies to strengthen our spiritual bond.

👥 CONNECT WITH ALUMNI
Find and reconnect with fellow alumni worldwide.

Visit: dlsondochoiralumni.netlify.app

Blessings and fellowship,
DLSO Alumni Team`
    },
    {
      name: 'Monthly Newsletter',
      subject: 'DLSO Alumni Monthly Update - [Month Year]',
      content: `Dear DLSO Family,

Greetings in the name of our Lord Jesus Christ!

📈 COMMUNITY GROWTH
• ${alumniContacts.length} alumni in our directory
• New members from [locations]
• [Number] memories shared this month

🎯 HIGHLIGHTS
• [Recent achievements of alumni]
• [Upcoming events]
• [Prayer testimonies]

🙏 PRAYER POINTS
• [Current prayer requests]
• [Thanksgiving items]

📅 UPCOMING EVENTS
• [Event details]
• [Registration information]

Stay connected and keep sharing your journey with us!

In His service,
DLSO Alumni Community`
    },
    {
      name: 'Event Invitation',
      subject: 'You\'re Invited: DLSO Alumni [Event Name]',
      content: `Dear [Name],

You're cordially invited to our upcoming DLSO Alumni gathering!

📅 EVENT DETAILS:
• Date: [Date]
• Time: [Time]  
• Location: [Location/Virtual Link]
• Theme: [Theme]

🎯 PROGRAM:
• Fellowship and networking
• Testimonies and updates
• Prayer and worship
• [Special activities]

💫 WHY ATTEND:
• Reconnect with old friends
• Share your journey
• Strengthen our spiritual bond
• Create new memories

Please RSVP by [Date] at: dlsondochoiralumni.netlify.app

Looking forward to seeing you!

Warmly,
DLSO Alumni Organizing Committee`
    }
  ]

  // Send newsletter
  const sendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) {
      alert('Please fill in both subject and content.')
      return
    }

    if (!confirm(`Send newsletter to ${filteredSubscribers.length} subscribers?`)) {
      return
    }

    setSending(true)

    try {
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content,
          recipients: filteredSubscribers.map(sub => ({ email: sub.email, name: sub.name })),
          segment: selectedSegment
        })
      })

      if (response.ok) {
        alert('Newsletter sent successfully!')
        
        // Add to history
        const newNewsletter: Newsletter = {
          id: `news_${Date.now()}`,
          subject,
          content,
          recipientCount: filteredSubscribers.length,
          sentAt: new Date().toISOString().split('T')[0]
        }
        setNewsletters([newNewsletter, ...newsletters])
        
        // Clear form
        setSubject('')
        setContent('')
      } else {
        throw new Error('Failed to send newsletter')
      }
    } catch (error) {
      alert('Failed to send newsletter. Please try again.')
      console.error('Send error:', error)
    } finally {
      setSending(false)
    }
  }

  // Newsletter preview
  const newsletterPreview = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background: linear-gradient(135deg, #f59e0b, #3b82f6); padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">✨ DLSO Alumni Newsletter</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Ondo Region & Beyond</p>
      </div>
      <div style="padding: 30px; background: white;">
        <h2 style="color: #1f2937; margin-top: 0;">${subject}</h2>
        <div style="white-space: pre-line; margin: 20px 0;">${content}</div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
          <p>You're receiving this because you're part of our DLSO Alumni community.</p>
          <p><a href="#" style="color: #3b82f6;">Visit Alumni Platform</a> | <a href="#" style="color: #6b7280;">Unsubscribe</a></p>
        </div>
      </div>
    </div>
  `

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📧</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Alumni Newsletter System</h1>
              <p className="text-gray-600">Communicate with your {subscribers.filter(s => s.subscribed).length} subscribers</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2">
            {[
              { id: 'compose', name: 'Compose', icon: '✍️' },
              { id: 'subscribers', name: 'Subscribers', icon: '👥' },
              { id: 'history', name: 'History', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'compose' | 'subscribers' | 'history')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Compose Newsletter */}
        {activeTab === 'compose' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Compose Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Compose Newsletter</h2>

              {/* Templates */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Templates
                </label>
                <div className="space-y-2">
                  {templates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSubject(template.subject)
                        setContent(template.content)
                      }}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <div className="font-medium text-blue-600">{template.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {template.subject}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience Segment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audience Segment
                </label>
                <select
                  value={selectedSegment}
                  onChange={(e) => setSelectedSegment(e.target.value as 'all' | 'nigeria' | 'international' | 'dlso')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Subscribers ({subscribers.filter(s => s.subscribed).length})</option>
                  <option value="nigeria">Nigeria Alumni ({subscribers.filter(s => s.subscribed && s.country === 'Nigeria').length})</option>
                  <option value="international">International Alumni ({subscribers.filter(s => s.subscribed && s.country !== 'Nigeria').length})</option>
                  <option value="dlso">DLSO Members ({subscribers.filter(s => s.subscribed && s.ministrySection === 'DLSO Alumni').length})</option>
                </select>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter newsletter subject..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Newsletter Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your newsletter content..."
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={sendNewsletter}
                  disabled={!subject.trim() || !content.trim() || sending}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {sending ? 'Sending...' : `📧 Send to ${filteredSubscribers.length} Subscribers`}
                </button>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  👁️ Preview
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Email Preview</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div dangerouslySetInnerHTML={{ __html: newsletterPreview }} />
              </div>
            </div>
          </div>
        )}

        {/* Subscribers Management */}
        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Subscriber Management</h2>
              <div className="text-sm text-gray-600">
                {subscribers.filter(s => s.subscribed).length} active subscribers
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Country</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Section</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Subscribed</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(subscriber => (
                    <tr key={subscriber.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{subscriber.name}</td>
                      <td className="py-3 px-4 text-blue-600">{subscriber.email}</td>
                      <td className="py-3 px-4">{subscriber.country}</td>
                      <td className="py-3 px-4">{subscriber.ministrySection || 'General'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{subscriber.subscribedAt}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscriber.subscribed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.subscribed ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Newsletter History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Newsletter History</h2>

            <div className="space-y-4">
              {newsletters.map(newsletter => (
                <div key={newsletter.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{newsletter.subject}</h3>
                    <span className="text-sm text-gray-500">{newsletter.sentAt}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {newsletter.content.substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-500">
                      📧 {newsletter.recipientCount} recipients
                    </div>
                    {newsletter.openRate && (
                      <div className="text-green-600">
                        📈 {newsletter.openRate}% open rate
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}