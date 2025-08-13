/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '**',
      },
      // ✅ ADD: Vercel Blob domains
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  
  // ✅ ENHANCED: Your original CSP with Vercel Blob support
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-eval' 'unsafe-inline' https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: data:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: *.blob.vercel-storage.com *.public.blob.vercel-storage.com; frame-src https:; connect-src 'self' https: *.blob.vercel-storage.com *.public.blob.vercel-storage.com;"
          }
        ],
      },
    ]
  },

  // ✅ FIXED: Updated for Next.js 15 - removed experimental prefix
  serverExternalPackages: ['@vercel/blob'],
}

module.exports = nextConfig