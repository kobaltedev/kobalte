/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [{ raw: "" }],
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@kobalte/tailwind"),
  ],
};
