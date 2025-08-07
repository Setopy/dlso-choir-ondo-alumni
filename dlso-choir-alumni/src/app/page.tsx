import Link from 'next/link'
import AuthButton from '@/components/AuthButton'
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎵</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">DLSO Youth Choir Alumni</h1>
                <p className="text-gray-600">Ondo Region & Beyond</p>
              </div>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Connecting Voices, 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-blue-600">
              {" "}Sharing Faith
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Welcome to the official alumni platform for DLSO Youth Choir members. 
            Share memories, connect with fellow choir members, and continue the fellowship 
            that began in Ondo Region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold">
              Share a Memory
            </button>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Browse Alumni
            </button>
            <Link href="/prayers" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-400 transition-colors font-semibold block text-center">
              Prayer Requests
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Memory Wall</h3>
            <p className="text-gray-600">
              Share photos, videos, and stories from your choir years. 
              Relive the beautiful moments and performances together.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🙏</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Prayer Community</h3>
            <p className="text-gray-600">
              Submit prayer requests, share testimonies, and support 
              each other in faith as we continue our spiritual journey.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎶</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Choir Archives</h3>
            <p className="text-gray-600">
              Listen to recordings of our performances, access sheet music, 
              and celebrate the musical legacy we created together.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">150+</div>
              <div className="text-gray-600">Alumni Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-gray-600">Years of Ministry</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Shared Memories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Churches Reached</div>
            </div>
          </div>
        </div>

        {/* Recent Activity Preview */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">SA</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800">Sister Adunni shared a new memory from 2018 Easter performance</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">BT</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800">Brother Tunde requested prayers for new ministry launch</p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">MO</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800">Minister Olumide uploaded audio from 2020 Christmas concert</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button className="text-blue-600 hover:text-blue-700 font-semibold">
              View All Activity →
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">DLSO Youth Choir Alumni</h4>
              <p className="text-gray-400">
                Connecting alumni from Deeper Life South-West Ondo Region Youth Choir, 
                preserving our musical and spiritual heritage.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Alumni Directory</a></li>
                <li><a href="#" className="hover:text-white">Prayer Requests</a></li>
                <li><a href="#" className="hover:text-white">Choir Archives</a></li>
                <li><a href="#" className="hover:text-white">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">WhatsApp Group</a></li>
                <li><a href="#" className="hover:text-white">Facebook Page</a></li>
                <li><a href="#" className="hover:text-white">YouTube Channel</a></li>
                <li><a href="#" className="hover:text-white">Contact Admin</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DLSO Youth Choir Alumni. Built with love for our choir family.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}