import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Add path aliases to webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/components/ui": path.resolve(__dirname, "./src/components/ui"),
      "@/components/layout": path.resolve(__dirname, "./src/components/layout"),
      "@/components/features": path.resolve(
        __dirname,
        "./src/components/features",
      ),
    };
    return config;
  },
  // Turbopack config (empty to use webpack for now)
  turbopack: {},
  // Enable React Strict Mode
  reactStrictMode: true,
  // Configure images
  images: {
    domains: [],
  },
};

export default nextConfig;
