import { BaseUseStyleConfigOptions } from "../types";

export const COLOR_MODE_CLASSNAMES = {
  light: "kobalte-theme-light",
  dark: "kobalte-theme-dark",
};

/** Names of base `UseStyleConfigOptions` props, used in SolidJS `splitProps`. */
export const STYLE_CONFIG_PROP_NAMES: Array<
  keyof BaseUseStyleConfigOptions<any, any>
> = ["styleConfigOverride", "unstyled"];
