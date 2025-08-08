'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface FormData {
  title: string
  description: string
  year: string
  occasion: string
  image: File | null
}

export default function ShareMemoryPage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    year: '',
    occasion: '',
    image: null
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // We'll build the API endpoint next
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          year: formData.year,
          occasion: formData.occasion,
          // We'll handle image upload separately
        }),
      })

      if (response.ok) {
        // Success! Redirect to memories wall
        router.push('/memories')
      } else {
        alert('Error sharing memory. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error sharing memory. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-amber-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="w-12 h-12 bg-gradient-to-br from-amber-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎵</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Share a Memory</h1>
                <p className="text-gray-600">Add to our choir family memory wall</p>
              </div>
            </div>
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Memory Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Example: Easter Sunday Performance 2019"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Share the story behind this memory. What made it special? Who was involved? What songs did we sing?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Year and Occasion */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 25 }, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-2">
                  Occasion/Event
                </label>
                <select
                  id="occasion"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Select Occasion</option>
                  <option value="Sunday Service">Sunday Service</option>
                  <option value="Easter">Easter</option>
                  <option value="Christmas">Christmas</option>
                  <option value="Camp Meeting">Camp Meeting</option>
                  <option value="Convention">Convention</option>
                  <option value="Special Program">Special Program</option>
                  <option value="Rehearsal">Rehearsal</option>
                  <option value="Outreach">Outreach</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer block text-center">
                  {previewImage ? (
                    <div className="space-y-4">
                      <div className="relative w-64 h-48 mx-auto">
                        <Image 
                          src={previewImage} 
                          alt="Memory preview" 
                          fill
                          className="object-cover rounded-lg shadow-md"
                        />
                      </div>
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl text-gray-400">📸</div>
                      <div className="text-gray-600">
                        <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                      </div>
                      <div className="text-sm text-gray-500">PNG, JPG up to 10MB</div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sharing Memory...' : 'Share Memory'}
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📝 Memory Sharing Guidelines</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Share memories that celebrate our choir family and ministry</li>
            <li>• Include context - help others remember the moment</li>
            <li>• Tag other choir members if they are in the photo</li>
            <li>• Keep content appropriate and uplifting</li>
            <li>• High-quality photos are preferred but not required</li>
          </ul>
        </div>
      </main>
    </div>
  )
}