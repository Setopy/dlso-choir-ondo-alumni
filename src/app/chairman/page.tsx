// src/app/chairman/page.tsx
import Link from 'next/link'
import AuthButton from '@/components/AuthButton'

export default function ChairmanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-200/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">🎖️</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Group Chairman
                </h1>
                <p className="text-slate-600 font-medium">DLSO Alumni Leadership</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-200/50 hover:border-blue-200 hover:bg-blue-50/50"
              >
                ← Back Home
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-md rounded-full px-6 py-2 mb-6 border border-blue-300/30">
              <span className="text-2xl">🎖️</span>
              <span className="text-blue-200 font-bold">Leadership Profile</span>
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Our Group
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Chairman
              </span>
            </h2>
            
            <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Meet the visionary leader guiding our DLSO Alumni community with wisdom, 
              dedication, and unwavering commitment to our spiritual growth and fellowship.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Chairman Profile Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-12 border border-slate-200/50">
          
          {/* Profile Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-2xl">
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
                  {/* Placeholder for chairman photo */}
                  <span className="text-6xl text-slate-400">👨‍💼</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎖️</span>
              </div>
            </div>
            
            <h3 className="text-4xl font-bold text-slate-800 mt-6 mb-2">
              [Chairman Name]
            </h3>
            
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold text-lg mb-4">
              Group Chairman
            </div>
            
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              [Chairman&aposs inspiring bio and background in DLSO ministry]
            </p>
          </div>

          {/* Content Sections */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            
            {/* Vision & Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="text-2xl font-bold text-slate-800">Vision & Mission</h4>
              </div>
              <p className="text-slate-700 leading-relaxed">
                [Chairman&aposs vision for the DLSO Alumni community, goals for spiritual growth, 
                and mission to strengthen the bonds of fellowship among members.]
              </p>
            </div>

            {/* Ministry Background */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
                <h4 className="text-2xl font-bold text-slate-800">Ministry Background</h4>
              </div>
              <p className="text-slate-700 leading-relaxed">
                [Details about the chairman&aposs journey in DLSO, leadership roles, 
                ministry experience, and contributions to the spiritual community.]
              </p>
            </div>

          </div>

          {/* Key Initiatives */}
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-8 mb-12">
            <h4 className="text-2xl font-bold text-slate-800 mb-6 text-center flex items-center justify-center space-x-3">
              <span className="text-3xl">🚀</span>
              <span>Key Initiatives & Projects</span>
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                <span className="text-3xl mb-3 block">🤝</span>
                <h5 className="font-bold text-slate-800 mb-2">Fellowship Programs</h5>
                <p className="text-slate-600 text-sm">Strengthening bonds through regular fellowship activities</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                <span className="text-3xl mb-3 block">📚</span>
                <h5 className="font-bold text-slate-800 mb-2">Spiritual Growth</h5>
                <p className="text-slate-600 text-sm">Organized teaching and mentorship programs</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                <span className="text-3xl mb-3 block">🌍</span>
                <h5 className="font-bold text-slate-800 mb-2">Community Outreach</h5>
                <p className="text-slate-600 text-sm">Extending our ministry impact to the wider community</p>
              </div>

            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h4 className="text-2xl font-bold text-slate-800 mb-6">Connect with Our Chairman</h4>
            <div className="flex flex-wrap justify-center gap-4">
              
              <a href="#" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
              
              <a href="mailto:" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span>📧</span>
                <span>Email</span>
              </a>
              
              <a href="tel:" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span>📞</span>
                <span>Call</span>
              </a>

            </div>
          </div>

        </div>
      </main>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Join Our Growing Alumni Community
          </h3>
          <p className="text-blue-100 text-lg mb-8">
            Under our chairman&aposs leadership, let&aposs continue building a strong, 
            spiritually-minded community that honors our DLSO heritage.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/alumni" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">
              View Alumni Directory
            </Link>
            <Link href="/prayers" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg">
              Submit Prayer Request
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}