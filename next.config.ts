import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Override Vercel's default wildcard CORS for static assets
          {
            key: "Access-Control-Allow-Origin",
            value: "https://reporeconnoiter.com",
          },
          // Prevent clickjacking attacks
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
          // Control which browser features and APIs can be used
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Force HTTPS connections (31536000 seconds = 1 year)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Content Security Policy - Maximum XSS protection
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self'", // No unsafe directives - fortress mode
              "style-src 'self'", // No inline styles - Tailwind v4 compiles to CSS file
              "img-src 'self' data: https:", // Allow images from HTTPS (GitHub avatars, etc)
              "font-src 'self' data:",
              "connect-src 'self' https://api.reporeconnoiter.com", // Your API domain only
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests", // Force HTTPS
              "object-src 'none'", // Block plugins
              "media-src 'self'", // Only self-hosted media
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
