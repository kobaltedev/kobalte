import { defineConfig, EntryOptions } from "tsup-preset-solid";

const submodules = [
  "i18n",
  "alert",
  "button",
  "calendar",
  "checkbox",
  "context-menu",
  "dialog",
  "dropdown-menu",
  "hover-card",
  "link",
  "listbox",
  "multi-select",
  "popover",
  "radio-group",
  "range-calendar",
  "select",
  "separator",
  "switch",
  "tabs",
  "text-field",
  "toggle-button",
] as const;

export default defineConfig(
  [
    {
      entry: `src/index.tsx`,
      devEntry: true,
    },
    ...submodules.map<EntryOptions>(name => ({
      name,
      entry: `src/${name}/index.tsx`,
      devEntry: true,
    })),
  ],
  {
    // writePackageJson: true,
    dropConsole: true,
    cjs: true,
  }
);
