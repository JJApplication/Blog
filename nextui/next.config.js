/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/images/:path*',
        destination: 'http://localhost:5000/images/:path*',
      },
    ]
  },
}

module.exports = nextConfig
