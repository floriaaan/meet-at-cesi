/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				heading: ["fkscreamer", "Impact,Arial,Helvetica,sans-serif"],
				body: ["faktum", "Arial, Helvetica, sans-serif"],
			},

			colors: {
				primary: "#fbe216",
				pink: "#f0869d",
				purple: "#afa5d1",
				green: { DEFAULT: "#6fbc85" },
				red: { DEFAULT: "#cf2e2e" },
				blue: { DEFAULT: "#6dc6da" },
				neutral: { 950: "#101010" },
			},
			screens: {
				xs: "500px",
			},
			aria: {
				asc: 'sort="ascending"',
				desc: 'sort="descending"',
			},
			width: {
				inherit: "inherit",
			},

			keyframes: {
				wiggle: {
					"0%, 100%": { transform: "rotate(-6deg) scale(1)" },
					"50%": { transform: "rotate(6deg) scale(1.1)" },
				}
			},
			animation: {
        wiggle: 'wiggle 1.5s ease-in-out infinite',
      }
		},
	},
	plugins: [
		require("@tailwindcss/line-clamp"),
		require("@tailwindcss/typography"),
	],
};
