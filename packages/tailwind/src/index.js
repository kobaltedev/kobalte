/* eslint-disable @typescript-eslint/no-var-requires */

const plugin = require("tailwindcss/plugin");
const defaultColors = require("tailwindcss/colors");

const fourLevelShades = ["50", "100", "200", "300"];
const fiveLevelShades = [...fourLevelShades, "400"];
const tenLevelShades = [...fiveLevelShades, "500", "600", "700", "800", "900"];
const backgroundShades = [...fiveLevelShades, "white"];

function computeColorPalette(colorName, shades, withAlpha = true) {
  return shades.reduce((acc, key) => {
    acc[key] = `rgb(var(--kobalte-colors-${colorName}-${key})${
      withAlpha ? " / <alpha-value>" : ""
    })`;
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
      colors: {
        ...defaultColors,
        primary: computeColorPalette("primary", tenLevelShades),
        neutral: computeColorPalette("neutral", tenLevelShades),
        success: computeColorPalette("success", tenLevelShades),
        info: computeColorPalette("info", tenLevelShades),
        warning: computeColorPalette("warning", tenLevelShades),
        danger: computeColorPalette("danger", tenLevelShades),

        border: computeColorPalette("border", fourLevelShades),
        fill: computeColorPalette("fill", fourLevelShades, false),
        text: computeColorPalette("text", fourLevelShades, false),
        background: computeColorPalette("background", backgroundShades),
      },
    },
  }
);
