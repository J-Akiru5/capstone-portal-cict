import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@capstone/auth",
    "@capstone/database",
    "@capstone/storage",
    "@capstone/ui"
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@capstone/auth": path.resolve(__dirname, "../../packages/auth/src"),
      "@capstone/database": path.resolve(__dirname, "../../packages/database/src"),
      "@capstone/storage": path.resolve(__dirname, "../../packages/storage/src"),
      "@capstone/ui": path.resolve(__dirname, "../../packages/ui/src"),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
