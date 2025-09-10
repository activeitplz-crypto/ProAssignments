
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'htuzewdqrdzjuoubadqf.supabase.co',
      }
    ],
  },
   env: {
    NEXT_PUBLIC_ADMIN_EMAIL: 'itxprince440@gmail.com',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    // When you deploy your app, set NEXT_PUBLIC_BASE_URL in your hosting environment
    // to your app's public URL.
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002',
  },
};

export default nextConfig;
