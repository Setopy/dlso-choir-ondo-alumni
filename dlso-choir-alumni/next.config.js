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
    ],
  },
  // Permissive CSP for OAuth authentication
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-eval' 'unsafe-inline' https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: data:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; frame-src https:; connect-src 'self' https:;"
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
