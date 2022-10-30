/* eslint-disable @typescript-eslint/no-var-requires */

const plugin = require("tailwindcss/plugin");

const TEN_SHADES_COLORS = [
  /* TailwindCSS colors */
  "slate",
  "cloud",
  "zinc",
  "gray",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",

  /* Semantic colors */
  "primary",
  "neutral",
  "success",
  "info",
  "warning",
  "danger",
];

const FOUR_SHADES = ["50", "100", "200", "300"];
const FIVE_SHADES = [...FOUR_SHADES, "400"];
const TEN_SHADES = [...FIVE_SHADES, "500", "600", "700", "800", "900"];
const BG_SHADES = [...FIVE_SHADES, "white"];

function createColorObject(shades, withAlpha) {
  return { shades, withAlpha };
}

function getColors() {
  const colorDefinitions = {
    ...TEN_SHADES_COLORS.reduce((acc, name) => {
      acc[name] = createColorObject(TEN_SHADES, true);
      return acc;
    }, {}),
    border: createColorObject(FOUR_SHADES, false),
    fill: createColorObject(FOUR_SHADES, false),
    text: createColorObject(FOUR_SHADES, false),
    background: createColorObject(BG_SHADES, false),
  };

  return Object.keys(colorDefinitions).reduce((acc, name) => {
    const color = colorDefinitions[name];

    acc[name] = color.shades.reduce((acc, shade) => {
      acc[shade] = `rgb(var(--kobalte-colors-${name}-${shade})${
        color.withAlpha ? " / <alpha-value>" : ""
      })`;
      return acc;
    }, {});

    return acc;
  }, {});
}

module.exports = plugin(function () {}, {
  darkMode: ["class", ".kobalte-theme-dark"],
  theme: {
    colors: getColors(),
  },
});
