import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'", // Required for Next.js internal scripts
              "style-src 'self' 'unsafe-inline'", // Required for Tailwind/Next.js styles
              "img-src 'self' data: https:", // GitHub avatars from HTTPS sources
              "font-src 'self' data:",
              "connect-src 'self' https://api.reporeconnoiter.com", // Your API domain only
              "frame-ancestors 'self'", // Prevents clickjacking
              "base-uri 'self'", // Prevents base tag injection
              "form-action 'self'", // Prevents form hijacking
              "upgrade-insecure-requests", // Forces HTTPS
              "object-src 'none'", // Blocks Flash/plugins
              "media-src 'self'",
            ].join("; "),
          },
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Control referrer information
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Control browser features/APIs
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Force HTTPS (1 year)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
