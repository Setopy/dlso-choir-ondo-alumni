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
  const [uploadProgress, setUploadProgress] = useState<number>(0)
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
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }))
      
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'choir_memories')
    

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      let imageUrl = ''
      
      if (formData.image) {
        setUploadProgress(25)
        imageUrl = await uploadImageToCloudinary(formData.image)
        setUploadProgress(75)
      }

      setUploadProgress(90)
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
          imageUrl: imageUrl,
        }),
      })

      if (response.ok) {
        setUploadProgress(100)
        setTimeout(() => {
          router.push('/memories')
        }, 500)
      } else {
        throw new Error('Failed to save memory')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error sharing memory. Please try again.')
      setUploadProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50">
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

      {isSubmitting && uploadProgress > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {uploadProgress < 75 ? 'Uploading image...' : 
                 uploadProgress < 100 ? 'Saving memory...' : 'Complete!'}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Photo (Recommended)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-amber-400 transition-colors">
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
                      <p className="text-xs text-gray-500">
                        {formData.image && `${(formData.image.size / 1024 / 1024).toFixed(1)}MB`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl text-gray-400">📸</div>
                      <div className="text-gray-600">
                        <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                      </div>
                      <div className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</div>
                      <div className="text-xs text-amber-600 font-medium">
                        Photos make memories come alive! ✨
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {formData.image ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  'Share Memory'
                )}
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

        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📸 Photo Upload Tips</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• High-quality photos work best (good lighting, clear subjects)</li>
            <li>• Group photos are perfect for choir memories</li>
            <li>• Photos are automatically optimized for fast loading</li>
            <li>• Maximum file size: 10MB (most photos are much smaller)</li>
            <li>• Supported formats: JPG, PNG, WEBP</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
