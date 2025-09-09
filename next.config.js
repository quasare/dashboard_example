/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ui-avatars.com', 'via.placeholder.com'],
  },
  // Production optimizations for Render
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
}

module.exports = nextConfig
