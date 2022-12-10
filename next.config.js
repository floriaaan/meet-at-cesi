/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NEXT_PUBLIC_APP_ENV === "local",
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["rjolwivgzqplhtktnznl.supabase.co"],
  },
};

module.exports = withPWA(nextConfig);
