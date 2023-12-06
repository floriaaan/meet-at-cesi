/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
	dest: "public",
	disable: process.env.NEXT_PUBLIC_APP_ENV === "local",
});

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "rjolwivgzqplhtktnznl.supabase.co",
				port: "",
			},
		],
	},
};

module.exports = withPWA(nextConfig);
