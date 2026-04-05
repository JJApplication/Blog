/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://blog.renj.io/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
