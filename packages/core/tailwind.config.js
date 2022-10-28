const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

function computeColorPalette(colorName) {
  return shades.reduce((acc, key) => {
    acc[key] = `rgb(var(--kobalte-colors-${colorName}-${key}) / <alpha-value>)`;
    return acc;
  }, {});
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [{ raw: "" }],
  darkMode: ["class", ".kobalte-theme-dark"],
  theme: {
    colors: {
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",
      black: "#000",
      white: "#fff",
      primary: computeColorPalette("primary"),
      neutral: computeColorPalette("neutral"),
      success: computeColorPalette("success"),
      info: computeColorPalette("info"),
      warning: computeColorPalette("warning"),
      danger: computeColorPalette("danger"),
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
