import Link from 'next/link'
import AuthButton from '@/components/AuthButton'
import ExcoLeadershipSection from '@/components/ExcoLeadershipSection'

export default function ExcoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 via-purple-50/20 to-slate-50">
      {/* Header - Same style as your homepage */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-200/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-800 via-amber-700 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">✨</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Ondo DLSO Alumni
                </h1>
                <p className="text-slate-600 font-medium">Ondo Region & Beyond</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="hidden sm:flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-200/50 hover:border-blue-200 hover:bg-blue-50/50"
              >
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 via-amber-800 to-orange-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Meet Our
              <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                EXCO Leadership
              </span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              Our dedicated Executive Committee members serve our global alumni community with passion, 
              commitment, and unwavering dedication to our shared DLSO values.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Your Existing EXCO Section Component */}
      <ExcoLeadershipSection />

      {/* Simple Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 mt-16">
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6">
            <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Ondo DLSO Alumni
            </h4>
            <p className="text-slate-300">
              United in faith, connected in fellowship
            </p>
          </div>
          <div className="border-t border-slate-700 pt-6">
            <p className="text-slate-400">
              &copy; 2025 Ondo DLSO Alumni. Built with love for our DLSO family.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}