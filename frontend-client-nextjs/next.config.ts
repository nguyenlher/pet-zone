import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placeholder.com",
      },
    ],
  },
  async rewrites() {
    const rawGateway = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8090";
    const apiGateway = rawGateway.replace(/\/+$/, "").replace(/\/api$/, "");
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiGateway}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
