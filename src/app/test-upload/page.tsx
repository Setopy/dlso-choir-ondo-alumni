// src/app/test-upload/page.tsx - TYPESCRIPT FIXED
'use client'

import { useState } from 'react'
import Image from 'next/image'

// ✅ FIXED: Proper TypeScript interface instead of 'any'
interface UploadResult {
  success: boolean
  url: string
  filename: string
  size: number
  type: string
  uploadedAt?: string
  note?: string
}

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null) // ✅ FIXED: Proper type
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      console.log('🔄 Starting upload test...')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      console.log('📥 Upload response:', data)

      if (response.ok) {
        setResult(data as UploadResult) // ✅ FIXED: Proper type casting
        console.log('✅ Upload successful:', data.url)
      } else {
        setError(data.error || 'Upload failed')
        console.error('❌ Upload failed:', data)
      }
    } catch (err) {
      console.error('💥 Upload error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🧪 Upload Test Page
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {file && (
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>File:</strong> {file.name}<br/>
                <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB<br/>
                <strong>Type:</strong> {file.type}
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium transition-colors"
          >
            {uploading ? '⏳ Uploading...' : '📤 Test Upload to Vercel Blob'}
          </button>

          {result && (
            <div className="p-4 bg-green-50 rounded-md border border-green-200">
              <h3 className="font-bold text-green-800 mb-2">✅ Upload Successful!</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{result.url}</a></p>
                <p><strong>Filename:</strong> {result.filename}</p>
                <p><strong>Size:</strong> {result.size} bytes</p>
                {result.uploadedAt && <p><strong>Uploaded:</strong> {result.uploadedAt}</p>}
                {result.note && <p><strong>Note:</strong> <span className="text-orange-600">{result.note}</span></p>}
              </div>
              
              {/* ✅ FIXED: Using Next.js Image component instead of <img> */}
              {result.url && (
                <div className="mt-4 relative">
                  <Image 
                    src={result.url} 
                    alt="Uploaded test image" 
                    width={400}
                    height={300}
                    className="max-w-full h-auto rounded-md shadow-sm border object-contain"
                    unoptimized // ✅ Since it's from external Vercel Blob storage
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 rounded-md border border-red-200">
              <h3 className="font-bold text-red-800 mb-2">❌ Upload Failed</h3>
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-600 mt-2">Check browser console for more details</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Environment Test: <a href="/api/test-env" className="text-blue-600 underline">Check /api/test-env</a>
          </p>
        </div>
      </div>
    </div>
  )
}