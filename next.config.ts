import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',

      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com', // Este es el que permite las imágenes de Vercel Blob
      },
    ],
  },
};

export default nextConfig;
