/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com'],
  },
  transpilePackages: ['framer-motion'],
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
