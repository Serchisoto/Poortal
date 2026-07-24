import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ['resend'],
  allowedDevOrigins: ['192.168.1.75', '*.v0.dev', '*.vercel.app'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/destinations/cancun',
        permanent: false,
      },
      {
        source: '/cancun',
        destination: '/destinations/cancun',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/provider',
        destination: '/provider/dashboard',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
{
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
