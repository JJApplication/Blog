/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: 'https://blog.renj.io/api/:path*',
      },
      {
        source: '/images/:path*',
        destination: 'https://blog.renj.io/images/:path*',
      },
    ]
  },
}

module.exports = nextConfig
