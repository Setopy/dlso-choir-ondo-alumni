import Link from 'next/link'
import AuthButton from '@/components/AuthButton'
import RecentMemories from '@/components/RecentMemories'
import DynamicStats from '@/components/DynamicStats'
import RecentActivity from '@/components/RecentActivity'
import ExcoLeadershipSection from '@/components/ExcoLeadershipSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 via-purple-50/20 to-slate-50">
      {/* Premium Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-200/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-800 via-amber-700 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">✨</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Ondo DLSO Alumni
                </h1>
                <p className="text-slate-600 font-medium">Ondo Region & Beyond</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/newsletter" 
                className="hidden sm:flex items-center space-x-2 text-slate-600 hover:text-amber-600 transition-colors font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-200/50 hover:border-amber-200 hover:bg-amber-50/50"
              >
                <span className="text-lg">📧</span>
                <span>Newsletter</span>
              </Link>
              <AuthButton />
            </div>
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
              Welcome to the official alumni platform for Ondo DLSO members. 
              Share memories, connect with fellow alumni, and continue the fellowship 
              that began in Ondo Region.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center max-w-5xl mx-auto">
              <Link href="/memories/new" className="group relative bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>📸</span>
                  <span>Share a Memory</span>
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link href="/alumni" className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <span className="flex items-center justify-center space-x-2">
                  <span>👥</span>
                  <span>Browse Alumni</span>
                </span>
              </Link>
              
              <Link href="/prayers" className="group bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <span className="flex items-center justify-center space-x-2">
                  <span>🙏</span>
                  <span>Prayer Requests</span>
                </span>
              </Link>
              
              <Link href="/exco" className="group bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-yellow-300">
                <span className="flex items-center justify-center space-x-2">
                  <span>👑</span>
                  <span>EXCO Leadership</span>
                </span>
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
              Share photos, videos, and stories from your DLSO years. 
              Relive the beautiful moments and ministry experiences together.
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
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Ministry Archives</h3>
            <p className="text-slate-600 leading-relaxed">
              Listen to recordings of our performances, access sheet music, 
              and celebrate the ministry legacy we created together.
            </p>
          </div>
        </div>

        {/* Dynamic Components with Premium Styling */}
        <DynamicStats />
        <RecentActivity />
      </main>

      {/* EXCO Leadership Section */}
      <ExcoLeadershipSection />

      {/* Recent Memories Section */}
      <RecentMemories />

      {/* Premium Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-amber-900/20"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Ondo DLSO Alumni
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Connecting alumni from Deeper Life Student Outreach Ondo Region, 
                preserving our ministry and spiritual heritage for generations.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link href="/alumni" className="hover:text-amber-400 transition-colors">Alumni Directory</Link></li>
                <li><Link href="/prayers" className="hover:text-amber-400 transition-colors">Prayer Requests</Link></li>
                <li><Link href="/exco" className="hover:text-amber-400 transition-colors">EXCO Leadership</Link></li>
                <li><Link href="/admin/newsletter" className="hover:text-amber-400 transition-colors">Newsletter Admin</Link></li>
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
              &copy; 2025 Ondo DLSO Alumni. Built with love for our DLSO family.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}