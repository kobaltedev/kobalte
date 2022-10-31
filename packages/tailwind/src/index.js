/* eslint-disable @typescript-eslint/no-var-requires */

const plugin = require("tailwindcss/plugin");

const TEN_SHADES_COLORS = [
  /* TailwindCSS colors */
  "slate",
  "smoke",
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

const TEN_SHADES = [
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

const FOUR_SHADES = ["1", "2", "3", "4"];
const BG_SHADES = [...FOUR_SHADES, "5", "white"];

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
    bg: createColorObject(BG_SHADES, false),
  };

  return Object.keys(colorDefinitions).reduce(
    (acc, name) => {
      const color = colorDefinitions[name];

      acc[name] = color.shades.reduce((acc, shade) => {
        acc[shade] = `rgb(var(--kb-color-${name}-${shade})${
          color.withAlpha ? " / <alpha-value>" : ""
        })`;
        return acc;
      }, {});

      return acc;
    },
    {
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",
      black: "#000",
      white: "#fff",
    }
  );
}

module.exports = plugin(function () {}, {
  darkMode: ["class", "[data-kb-theme='dark']"],
  theme: {
    colors: getColors(),
  },
});
