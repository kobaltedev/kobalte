import { dset } from "dset/merge";

import { Theme, ThemeOverride } from "../types";
import { DEFAULT_THEME } from "./default-theme";

export function extendTheme(themeOverride: ThemeOverride): Theme {
  const mergedTheme = {
    value: DEFAULT_THEME,
  };

  dset(mergedTheme, "value", themeOverride);

  return mergedTheme.value;
}
