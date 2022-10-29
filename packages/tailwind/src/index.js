/* eslint-disable @typescript-eslint/no-var-requires */

const plugin = require("tailwindcss/plugin");

const shades = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

function computeColorPalette(colorName) {
  return shades.reduce((acc, key) => {
    acc[key] = `rgb(var(--kobalte-colors-${colorName}-${key}) / <alpha-value>)`;
    return acc;
  }, {});
}

module.exports = plugin(
  function () {
    return;
  },
  {
    darkMode: ["class", ".kobalte-theme-dark"],
    theme: {
      extend: {
        colors: {
          primary: computeColorPalette("primary"),
          secondary: computeColorPalette("secondary"),
          success: computeColorPalette("success"),
          info: computeColorPalette("info"),
          warning: computeColorPalette("warning"),
          danger: computeColorPalette("danger"),
        },
      },
    },
  }
);
