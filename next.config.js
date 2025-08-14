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
      // ✅ COMPREHENSIVE: All Vercel Blob patterns
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
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
        port: '',
        pathname: '**',
      },
      // ✅ ADD: Your specific blob store with all patterns
      {
        protocol: 'https',
        hostname: 'mzf1o6wyyat4t2gj.public.blob.vercel-storage.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'mzf1o6wyyat4t2gj.blob.vercel-storage.com',
        port: '',
        pathname: '**',
      }
    ],
    // ✅ ADD: Additional configuration for better compatibility
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // ✅ ENHANCED: CSP with explicit Vercel Blob support
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-eval' 'unsafe-inline' https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: data:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: *.blob.vercel-storage.com *.public.blob.vercel-storage.com mzf1o6wyyat4t2gj.public.blob.vercel-storage.com mzf1o6wyyat4t2gj.blob.vercel-storage.com blob.vercel-storage.com; frame-src https:; connect-src 'self' https: *.blob.vercel-storage.com *.public.blob.vercel-storage.com blob.vercel-storage.com;"
          }
        ],
      },
    ]
  },

  // ✅ ADD: Serverless optimization for Netlify
  serverExternalPackages: ['@vercel/blob'],
}

module.exports = nextConfig