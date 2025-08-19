
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
      }
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://jprskuodyqaduqcsuyxa.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcnNrdW9keXFhZHVxY3N1eXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNjY3MTYsImV4cCI6MjAzODY0MjcxNn0.oB8t3x3NBrn7kRnhzMprxL2frA-KFxz30-22cCGiT28',
  }
};

export default nextConfig;
