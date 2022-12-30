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
		domains: ["rjolwivgzqplhtktnznl.supabase.co"],
	},

	// ---------- remove junk dev logs ----------
	webpack: (config, { webpack }) => {
		config.plugins = [
			...config.plugins,
			new webpack.DefinePlugin({
				__REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
			}),
		];
		return config;
	},

	// ---------- remove junk dev logs  ----------

	experimental: {
		swcPlugins: [
			[
				"next-superjson-plugin",
				{
					excluded: [],
				},
			],
		],
	},
};

module.exports = withPWA(nextConfig);
