/*!
 * Portions of this file are based on code from headlessui.
 * MIT Licensed, Copyright (c) 2020 Tailwind Labs.
 *
 * Credits to the Tailwind Labs team:
 * https://github.com/tailwindlabs/headlessui/blob/8e1e19f94c28af68c05becc80bf89575e1fa1d36/packages/@headlessui-tailwindcss/src/index.ts
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const plugin = require("tailwindcss/plugin");

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
  "hover",
  "focus",
  "focus-visible",
  "active",
];

module.exports = plugin.withOptions(({ prefix = "ui" } = {}) => {
  return ({ addVariant }) => {
    for (let state of STATES) {
      addVariant(`${prefix}-${state}`, [`&[data-${state}]`]);
      addVariant(`${prefix}-not-${state}`, [`&:not([data-${state}])`]);
    }
  };
});
