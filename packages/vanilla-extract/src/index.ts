import type { StyleRule } from "@vanilla-extract/css";

type DataAttribute<TState extends string> = `[data-${TState}]`;

type CSSProps = Omit<StyleRule, "selectors" | "@media" | "@supports">;

function makeDataAttribute<TState extends string>(state: TState): DataAttribute<TState> {
  return `[data-${state}]` as const;
}

type DataAttributeStates =
  | "valid"
  | "invalid"
  | "required"
  | "disabled"
  | "readonly"
  | "checked"
  | "indeterminate"
  | "selected"
  | "pressed"
  | "expanded"
  | "hover"
  | "focus"
  | "focus-visible"
  | "active";

type DataAttributeStyles = {
  [key in DataAttributeStates]?: CSSProps & { not?: CSSProps };
};

export function componentStateStyles(styles: DataAttributeStyles): StyleRule {
  const styleRule = { selectors: {} } as { selectors: StyleRule["selectors"] };
  if (styleRule.selectors) {
    for (const property in styles) {
      const { not, ...styleValues } = styles[property as DataAttributeStates] ?? {};
      const selector = makeDataAttribute(property);
      if (not) {
        styleRule.selectors[`:not(${selector})&`] = not || {};
      }
      styleRule.selectors[`${selector}&`] = styleValues;
    }
  }
  return styleRule;
}
