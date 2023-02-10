import type { StyleRule } from "@vanilla-extract/css";

type DataAttribute<KobalteState extends string> = `[data-${KobalteState}]`;

type CSSProps = Omit<StyleRule, "selectors" | "@media" | "@supports">;

export type DataAttributeState =
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
  | "closed"
  | "highlighted"
  | "current";

export type DataAttributeStyles = {
  [key in DataAttributeState]?: CSSProps & { not?: CSSProps };
};

function makeDataAttribute<KobalteState extends string>(
  state: KobalteState
): DataAttribute<KobalteState> {
  return `[data-${state}]` as const;
}

type SelectorOptions = {
  parentSelector?: string;
  not?: boolean;
};

function makeSelectorByOptions(selector: string, options: SelectorOptions): string {
  if (options.not) {
    selector = `:not(${selector})`;
  }

  selector = `&${selector}`;

  if (options.parentSelector) {
    selector = `${options.parentSelector} ${selector}`;
  }

  return selector;
}

type ComponentStateStyleOptions = {
  /**
   * Apply the given parent selector to the `StyleRule` data-* attribute selector
   */
  parentSelector?: string;
};

export function componentStateStyles(
  styles: DataAttributeStyles,
  options?: ComponentStateStyleOptions
): StyleRule {
  const styleRule = { selectors: {} } as { selectors: StyleRule["selectors"] };

  const selectorOptions: SelectorOptions = {
    parentSelector: options?.parentSelector ?? undefined,
  };

  if (styleRule.selectors) {
    for (const property in styles) {
      const { not, ...styleValues } = styles[property as DataAttributeState] ?? {};
      const dataAttrSelector = makeDataAttribute(property);

      if (not) {
        const selector = makeSelectorByOptions(dataAttrSelector, {
          parentSelector: selectorOptions.parentSelector,
          not: true,
        });
        styleRule.selectors[selector] = not || {};
      }

      const selector = makeSelectorByOptions(dataAttrSelector, {
        parentSelector: selectorOptions.parentSelector,
        not: false,
      });

      styleRule.selectors[selector] = styleValues;
    }
  }

  return styleRule;
}
