// STEP 1: Copy this ENTIRE code and replace your src/app/page.tsx

import Link from 'next/link'
import AuthButton from '@/components/AuthButton'
import RecentMemories from '@/components/RecentMemories'
import DynamicStats from '@/components/DynamicStats'
import RecentActivity from '@/components/RecentActivity'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 via-purple-50/20 to-slate-50">
      {/* Premium Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-200/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-800 via-amber-700 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🎵</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
                  DLSO Youth Choir Alumni
                </h1>
                <p className="text-slate-600 font-medium">Ondo Region & Beyond</p>
              </div>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section - Premium Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 via-amber-800 to-orange-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-24">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
              Connecting Voices,
              <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Sharing Faith
              </span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed">
              Welcome to the official alumni platform for DLSO Youth Choir members. 
              Share memories, connect with fellow choir members, and continue the fellowship 
              that began in Ondo Region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/memories/new" className="group relative bg-gradient-to-r from-amber-600 to-orange-600 text-white px-10 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <span className="relative z-10">Share a Memory</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link href="/alumni" className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white px-10 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Browse Alumni
              </Link>
              <Link href="/prayers" className="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg">
                Prayer Requests
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Premium Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📸</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Memory Wall</h3>
            <p className="text-slate-600 leading-relaxed">
              Share photos, videos, and stories from your choir years. 
              Relive the beautiful moments and performances together.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🙏</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Prayer Community</h3>
            <p className="text-slate-600 leading-relaxed">
              Submit prayer requests, share testimonies, and support 
              each other in faith as we continue our spiritual journey.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🎶</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Choir Archives</h3>
            <p className="text-slate-600 leading-relaxed">
              Listen to recordings of our performances, access sheet music, 
              and celebrate the musical legacy we created together.
            </p>
          </div>
        </div>

        {/* Dynamic Components with Premium Styling */}
        <DynamicStats />
        <RecentActivity />
      </main>

      {/* Recent Memories Section */}
      <RecentMemories />

      {/* Premium Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-amber-900/20"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                DLSO Youth Choir Alumni
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Connecting alumni from Deeper Life South-West Ondo Region Youth Choir, 
                preserving our musical and spiritual heritage for generations.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Alumni Directory</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Prayer Requests</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Choir Archives</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Connect</h4>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#" className="hover:text-amber-400 transition-colors">WhatsApp Group</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Facebook Page</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">YouTube Channel</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact Admin</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              &copy; 2025 DLSO Youth Choir Alumni. Built with love for our choir family.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}