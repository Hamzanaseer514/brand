import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  // Ensure proper routing for direct URL access
  trailingSlash: false,
};

export default nextConfig;
