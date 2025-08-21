
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
    ],
  },
  env: {
    // For SUI ZKLogin with Google
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: '509571123587-b52fl2mu6mlaq4haufrt233p1fjeov4o.apps.googleusercontent.com', // Replace with your actual Google Client ID from Google Cloud Console
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
