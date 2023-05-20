import kobalte from "@kobalte/tailwindcss";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [kobalte({})],
} satisfies Config;
