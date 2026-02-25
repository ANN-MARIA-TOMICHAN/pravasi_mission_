import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: true,
   
  },
  /* config options here */
};

export default nextConfig;
