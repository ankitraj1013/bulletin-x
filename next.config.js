/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow localhost + LAN access in dev
  allowedDevOrigins: ["localhost", "10.15.118.6"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all HTTPS image sources (news aggregator safe)
      },
    ],
  },
};

module.exports = nextConfig;