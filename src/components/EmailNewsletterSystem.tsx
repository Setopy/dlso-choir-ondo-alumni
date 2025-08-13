// src/components/EmailNewsletterSystem.tsx
'use client'

import { useState, useEffect } from 'react'

interface Subscriber {
  id: string
  email: string
  name: string
  subscribedAt: string
  source: string
  country?: string
  subscribed: boolean
}

interface Newsletter {
  id: string
  subject: string
  sentAt: string
  recipientCount: number
  status: string
}

interface ApiResponse {
  success: boolean
  emails?: Subscriber[]
  total?: number
  emailAddresses?: string[]
  error?: string
}

interface NewsletterResponse {
  success: boolean
  newsletters?: Newsletter[]
  error?: string
}

export default function EmailNewsletterSystem() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [activeTab, setActiveTab] = useState<'compose' | 'subscribers' | 'history'>('compose')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: '',
    previewMode: false
  })

  useEffect(() => {
    loadSubscribers()
    loadNewsletterHistory()
  }, [])

  const loadSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter-emails')
      const data: ApiResponse = await response.json()
      
      if (data.success && data.emails) {
        const formattedSubscribers = data.emails.map(email => ({
          ...email,
          country: email.country || 'Unknown',
          subscribed: true
        }))
        setSubscribers(formattedSubscribers)
      }
    } catch (error) {
      console.error('Error loading subscribers:', error)
      setMessage('Failed to load subscribers')
    }
  }

  const loadNewsletterHistory = async () => {
    try {
      const response = await fetch('/api/newsletter-history')
      const data: NewsletterResponse = await response.json()
      
      if (data.success && data.newsletters) {
        setNewsletters(data.newsletters)
      }
    } catch (error) {
      console.error('Error loading newsletter history:', error)
    }
  }

  const handleFormChange = (field: keyof typeof newsletterForm, value: string | boolean) => {
    setNewsletterForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const sendNewsletter = async () => {
    if (!newsletterForm.subject.trim() || !newsletterForm.content.trim()) {
      setMessage('Please fill in both subject and content')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newsletterForm.subject,
          content: newsletterForm.content,
          recipients: subscribers.filter(s => s.subscribed).map(s => s.email)
        })
      })

      const result = await response.json()

      if (result.success) {
        setMessage('Newsletter sent successfully!')
        setNewsletterForm({ subject: '', content: '', previewMode: false })
        loadNewsletterHistory()
      } else {
        setMessage(result.error || 'Failed to send newsletter')
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      setMessage('Failed to send newsletter')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Newsletter Admin</h1>
          <p className="text-gray-600">Manage subscribers and send newsletters to the DLSO community</p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{subscribers.length}</div>
              <div className="text-sm text-blue-700">Total Subscribers</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {subscribers.filter(s => s.source === 'google_signin').length}
              </div>
              <div className="text-sm text-green-700">From Google Sign-ins</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{newsletters.length}</div>
              <div className="text-sm text-purple-700">Newsletters Sent</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b">
            <nav className="flex">
              {(['compose', 'subscribers', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'compose' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Compose Newsletter</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={newsletterForm.subject}
                    onChange={(e) => handleFormChange('subject', e.target.value)}
                    placeholder="Newsletter subject..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newsletterForm.content}
                    onChange={(e) => handleFormChange('content', e.target.value)}
                    placeholder="Write your newsletter content here..."
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Will be sent to {subscribers.filter(s => s.subscribed).length} active subscribers
                  </div>
                  
                  <button
                    onClick={sendNewsletter}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {isLoading ? 'Sending...' : 'Send Newsletter'}
                  </button>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscribers' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Subscriber Management</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Source</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{subscriber.email}</td>
                          <td className="py-3 px-4">{subscriber.name}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              subscriber.source === 'google_signin' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {subscriber.source === 'google_signin' ? '🔑 Google Sign-in' : 
                               subscriber.source === 'manual' ? '✍️ Manual' : 
                               subscriber.source || 'Unknown'}
                            </span>
                          </td>
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

            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Newsletter History</h2>
                
                <div className="space-y-4">
                  {newsletters.length > 0 ? (
                    newsletters.map((newsletter) => (
                      <div key={newsletter.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{newsletter.subject}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Sent to {newsletter.recipientCount} recipients
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{newsletter.sentAt}</div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              newsletter.status === 'sent' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {newsletter.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg mb-2">📧</div>
                      <p className="text-gray-600">No newsletters sent yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}