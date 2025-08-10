import Link from 'next/link'

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50">
      <header className="bg-white shadow-sm border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="w-12 h-12 bg-gradient-to-br from-amber-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">✨</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Alumni Directory</h1>
                <p className="text-gray-600">Connect with fellow Ondo DLSO Alumni</p>
              </div>
            </div>
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">👥</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Alumni Directory Coming Soon</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We are building a comprehensive directory to help you connect with fellow Ondo DLSO Alumni. 
            This feature will include alumni from all ministry sections - choir members, ushers, 
            prayer warriors, and more.
          </p>
          
          <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-xl p-8 mb-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What to expect:</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔍</span>
                <div>
                  <h4 className="font-medium text-gray-800">Search & Filter</h4>
                  <p className="text-gray-600 text-sm">Find alumni by year, ministry section, or location</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📞</span>
                <div>
                  <h4 className="font-medium text-gray-800">Contact Info</h4>
                  <p className="text-gray-600 text-sm">Connect directly with fellow alumni</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-medium text-gray-800">Ministry Sections</h4>
                  <p className="text-gray-600 text-sm">Browse by choir, ushers, prayer warriors, and more</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🌍</span>
                <div>
                  <h4 className="font-medium text-gray-800">Location Updates</h4>
                  <p className="text-gray-600 text-sm">See where alumni are now located</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/memories"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
            >
              Browse Memories Instead
            </Link>
            <Link 
              href="/memories/new"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Share Your Memory
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}