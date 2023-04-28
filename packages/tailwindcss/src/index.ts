/*!
 * Portions of this file are based on code from headlessui.
 * MIT Licensed, Copyright (c) 2020 Tailwind Labs.
 *
 * Credits to the Tailwind Labs team:
 * https://github.com/tailwindlabs/headlessui/blob/8e1e19f94c28af68c05becc80bf89575e1fa1d36/packages/@headlessui-tailwindcss/src/index.ts
 */

import plugin from "tailwindcss/plugin";

import { DEFAULT_COLORS } from "./colors";

const STATES = [
  "valid",
  "invalid",
  "required",
  "disabled",
  "readonly",
  "checked",
  "indeterminate",
  "selected",
  "pressed",
  "expanded",
  "opened",
  "closed",
  "highlighted",
  "current",
];
const ORIENTATIONS = ["horizontal", "vertical"];
const SWIPE_STATES = ["start", "move", "cancel", "end"];
const SWIPE_DIRECTIONS = ["up", "down", "left", "right"];

export interface KobalteTailwindPluginOptions {
  /** The prefix of generated classes. */
  prefix?: string;

  /** Whether to include Kobalte UI color palettes in the Tailwind theme. */
  colors?: boolean;
}

export default plugin.withOptions<KobalteTailwindPluginOptions>(
  ({ prefix = "ui" } = {}) => {
    return ({ addVariant }) => {
      for (const state of STATES) {
        addVariant(`${prefix}-${state}`, [`&[data-${state}]`]);
        addVariant(`${prefix}-not-${state}`, [`&:not([data-${state}])`]);
        addVariant(`${prefix}-group-${state}`, `:merge(.group)[data-${state}] &`);
        addVariant(`${prefix}-peer-${state}`, `:merge(.peer)[data-${state}] ~ &`);
      }

      for (const orientation of ORIENTATIONS) {
        addVariant(`${prefix}-${orientation}`, [`&[data-orientation='${orientation}']`]);
        addVariant(`${prefix}-not-${orientation}`, [`&:not([data-orientation='${orientation}'])`]);
        addVariant(
          `${prefix}-group-${orientation}`,
          `:merge(.group)[data-orientation='${orientation}'] &`
        );
        addVariant(
          `${prefix}-peer-${orientation}`,
          `:merge(.peer)[data-orientation='${orientation}'] ~ &`
        );
      }

      for (const state of SWIPE_STATES) {
        addVariant(`${prefix}-swipe-${state}`, [`&[data-swipe='${state}']`]);
        addVariant(`${prefix}-not-swipe-${state}`, [`&:not([data-swipe='${state}'])`]);
        addVariant(`${prefix}-group-swipe-${state}`, `:merge(.group)[data-swipe='${state}'] &`);
        addVariant(`${prefix}-peer-swipe-${state}`, `:merge(.peer)[data-swipe='${state}'] ~ &`);
      }

      for (const direction of SWIPE_DIRECTIONS) {
        addVariant(`${prefix}-swipe-direction-${direction}`, [
          `&[data-swipe-direction='${direction}']`,
        ]);
        addVariant(`${prefix}-not-swipe-direction-${direction}`, [
          `&:not([data-swipe-direction='${direction}'])`,
        ]);
        addVariant(
          `${prefix}-group-swipe-direction-${direction}`,
          `:merge(.group)[data-swipe-direction='${direction}'] &`
        );
        addVariant(
          `${prefix}-peer-swipe-direction-${direction}`,
          `:merge(.peer)[data-swipe-direction='${direction}'] ~ &`
        );
      }
    };
  },
  function ({ colors = false } = {}) {
    if (!colors) {
      return {};
    }

    return {
      theme: {
        colors: {
          ...DEFAULT_COLORS,
        },
      },
    };
  }
);
