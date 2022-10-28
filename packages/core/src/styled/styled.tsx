/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/system/src/factory.ts
 *
 * Original code by SEEK
 * MIT Licensed, Copyright (c) 2021 SEEK.
 *
 * Credits to the SEEK team:
 * https://github.com/seek-oss/vanilla-extract/blob/master/packages/recipes/src/types.ts
 */

import { ElementType, filterUndefined, pack } from "@kobalte/utils";
import { clsx } from "clsx";
import { Accessor, createMemo, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createPolymorphicComponent } from "./create-polymorphic-component";

/** String representation of `boolean` type. */
type BooleanStringUnion = "true" | "false";

/** Infer the type to `boolean` if it's a string union of `"true" | "false"`. */
export type BooleanMap<T> = T extends BooleanStringUnion ? boolean : T;

/** Infer the type to string union of `"true" | "false"` if it's a `boolean`. */
export type ReverseBooleanMap<T> = T extends boolean ? BooleanStringUnion : T;

type StringOrArray = string | Array<string>;

type VariantDefinitions = Record<string, StringOrArray>;

export type VariantGroups = Record<string, VariantDefinitions>;

export type VariantSelection<Variants extends VariantGroups> = {
  [VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};

interface CompoundVariant<Variants extends VariantGroups> {
  /** The combined variants that should apply the CSS classes. */
  variants: VariantSelection<Variants>;

  /** The CSS classes to be applied. */
  classes: StringOrArray;
}

export interface StyleOptions<Variants extends VariantGroups> {
  /** The base CSS classes to apply. */
  base?: StringOrArray;

  /**
   * The variants classes.
   * Each variant will become a `prop` of the component.
   */
  variants?: Variants;

  /** The combined variants classes. */
  compoundVariants?: Array<CompoundVariant<Variants>>;

  /** The default value for each variant. */
  defaultVariants?: VariantSelection<Variants>;
}

type UseStylesFn<Variants extends VariantGroups> = (
  variantProps?: VariantSelection<Variants>
) => Accessor<string>;

/** Extract the variant props type of `useStyles` primitive. */
export type VariantProps<T extends UseStylesFn<any>> = Parameters<T>[0];

/** Return whether a compound variant should be applied. */
export function shouldApplyCompoundVariant<T extends Record<string, any>>(
  compoundCheck: T,
  selections: T
) {
  for (const key of Object.keys(compoundCheck)) {
    if (compoundCheck[key] !== selections[key]) {
      return false;
    }
  }

  return true;
}

/** Get the variants classNames of selected variants. */
export function getSelectedVariantClassNames<Variants extends VariantGroups>(
  styleOptions: StyleOptions<Variants>,
  selectedVariants: VariantSelection<Variants>
): Array<string> {
  const { variants = {} as any, compoundVariants = [] } = styleOptions;

  const classNames: Array<string> = [];

  // 1. add "variants" classNames.
  for (const name in selectedVariants) {
    const value = selectedVariants[name];

    if (value == null) {
      continue;
    }

    classNames.push(...pack(variants[name]?.[String(value)]));
  }

  // 2. add "compound variants" classNames.
  for (const compoundVariant of compoundVariants) {
    if (
      shouldApplyCompoundVariant(compoundVariant.variants, selectedVariants)
    ) {
      classNames.push(...pack(compoundVariant.classes));
    }
  }

  return classNames;
}

/**
 * Create a `styled` component with multi-variant support.
 * @param component The component/html element to render.
 * @param styleOptions The CSS classes to apply.
 */
export function styled<
  T extends ElementType,
  Variants extends VariantGroups = {}
>(component: T, styleOptions: StyleOptions<Variants>) {
  const variantPropsKeys: Array<keyof Variants> = styleOptions.variants
    ? Object.keys(styleOptions.variants)
    : [];

  const polymorphicComponent = createPolymorphicComponent<
    T,
    VariantSelection<Variants>
  >(props => {
    const [local, variantProps, others] = splitProps(
      props,
      ["as", "class"],
      variantPropsKeys
    );

    const classes = createMemo(() => {
      const selectedVariants = {
        ...styleOptions.defaultVariants,
        ...filterUndefined(variantProps),
      } as VariantSelection<Variants>;

      const variants = getSelectedVariantClassNames(
        styleOptions,
        selectedVariants
      );

      return clsx(...pack(styleOptions.base), ...variants, local.class);
    });

    return (
      <Dynamic
        component={local.as ?? (component as ElementType)}
        class={classes()}
        {...others}
      />
    );
  });

  return polymorphicComponent;
}
