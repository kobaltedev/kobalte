/*!
 * Original code by SEEK
 * MIT Licensed, Copyright (c) 2021 SEEK.
 *
 * Credits to the SEEK team:
 * https://github.com/seek-oss/vanilla-extract/blob/master/packages/recipes/src/createRuntimeFn.ts
 */

import { filterUndefined, pack } from "@kobalte/utils";
import { clsx } from "clsx";
import { Accessor, createMemo } from "solid-js";

import { BooleanMap, StringOrStringArray } from "./types";

type VariantDefinitions = Record<string, StringOrStringArray>;

export type VariantGroups = Record<string, VariantDefinitions>;

export type VariantSelection<Variants extends VariantGroups> = {
  [VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};

interface CompoundVariant<Variants extends VariantGroups> {
  /** The combined variants that should apply the classes. */
  variants: VariantSelection<Variants>;

  /** The classes to be applied. */
  classes: StringOrStringArray;
}

export interface ClassComposition<Variants extends VariantGroups> {
  /** The base classes. */
  base?: StringOrStringArray;

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

type UseClassesFn<Variants extends VariantGroups> = (
  variantProps?: VariantSelection<Variants>
) => Accessor<string>;

/** Extract the variant props type of `useClasses` primitive. */
export type VariantProps<T extends UseClassesFn<any>> = Parameters<T>[0];

/** Return whether a compound variant should be applied. */
export function shouldApplyCompound<T extends Record<string, any>>(
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
export function getSelectedVariantClasses<Variants extends VariantGroups>(
  styleOptions: ClassComposition<Variants>,
  selectedVariants: VariantSelection<Variants>
): Array<string> {
  const { variants = {} as any, compoundVariants = [] } = styleOptions;

  const classes: Array<string> = [];

  // 1. add "variants" classes.
  for (const name in selectedVariants) {
    const value = selectedVariants[name];

    if (value == null) {
      continue;
    }

    classes.push(...pack(variants[name]?.[String(value)]));
  }

  // 2. add "compound variants" classes.
  for (const compoundVariant of compoundVariants) {
    if (shouldApplyCompound(compoundVariant.variants, selectedVariants)) {
      classes.push(...pack(compoundVariant.classes));
    }
  }

  return classes;
}

/**
 * Create a CSS class composition with multi-variant support.
 * @return A function to apply the CSS classes for a given set of variants.
 */
export function createClassComposition<Variants extends VariantGroups = {}>(
  composition: ClassComposition<Variants>
): UseClassesFn<Variants> {
  return function useClasses(variantProps: VariantSelection<Variants> = {}) {
    const classes: Accessor<string> = createMemo(() => {
      const selectedVariants = {
        ...composition.defaultVariants,
        ...filterUndefined(variantProps),
      } as VariantSelection<Variants>;

      const variantClasses = getSelectedVariantClasses(
        composition,
        selectedVariants
      );

      return clsx(composition.base, variantClasses);
    });

    return classes;
  };
}
