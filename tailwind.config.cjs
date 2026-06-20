/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./.storybook/**/*.{ts,tsx}",
		"./packages/core/src/**/*.{ts,tsx}",
	],
	theme: { extend: {} },
	plugins: [],
};
