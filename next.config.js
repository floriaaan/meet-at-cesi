const { withAxiom } = require("next-axiom");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["rjolwivgzqplhtktnznl.supabase.co"],
  },
};

module.exports = withAxiom(nextConfig);
