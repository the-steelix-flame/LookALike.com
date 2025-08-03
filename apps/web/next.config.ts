/** @type {import('next').NextConfig} */
const nextConfig = {
  // This rewrites rule is crucial for making the Python API work.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/:path*' // The port Vercel CLI runs Python on
            : '/api/:path*',
      },
    ]
  },
  
  // FIX: This block tells Next.js to allow images from these specific domains.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // For placeholder images
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // For your Firebase Storage images
      },
    ],
  },
};

module.exports = nextConfig;
