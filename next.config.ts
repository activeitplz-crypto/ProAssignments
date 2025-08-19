
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
    NEXT_PUBLIC_SUPABASE_URL: 'https://esagbaqaxzcsnlecwzre.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYWdiYXFheHpjc25sZWN3enJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE0ODQ2NzAsImV4cCI6MjAzNzA2MDY3MH0.46qMGaNsb4v2y5s2v1h5dtAnp6e-_3Z3314g-aO0-2A',
    ADMIN_EMAIL: 'jaanzaib1212@gmail.com'
  }
};

export default nextConfig;
