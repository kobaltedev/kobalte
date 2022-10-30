/*!
 * Original code by SEEK
 * MIT Licensed, Copyright (c) 2021 SEEK.
 *
 * Credits to the SEEK team:
 * https://github.com/seek-oss/vanilla-extract/blob/master/packages/recipes/src/createRuntimeFn.ts
 * https://github.com/seek-oss/vanilla-extract/blob/master/packages/recipes/src/types.ts
 */

import { filterUndefined } from "@kobalte/utils";
import { clsx } from "clsx";
import { Accessor, createMemo } from "solid-js";

/** String representation of `boolean` type. */
type BooleanStringUnion = "true" | "false";

/** Infer the type to `boolean` if it's a string union of `"true" | "false"`. */
export type BooleanMap<T> = T extends BooleanStringUnion ? boolean : T;

/** Infer the type to string union of `"true" | "false"` if it's a `boolean`. */
export type ReverseBooleanMap<T> = T extends boolean ? BooleanStringUnion : T;

export type VariantSelection<Variants extends Record<string, any>> = {
  [VariantGroup in keyof Variants]?: BooleanMap<Variants[VariantGroup]>;
};

export interface CompoundVariant<Variants extends Record<string, any>> {
  /** The combined variants that should apply the classes. */
  variants: VariantSelection<Variants>;

  /** The classes to be applied. */
  classes: string[];
}

/** A CSS class composition. */
export interface ClassComposition<Variants extends Record<string, any>> {
  /** The base classes. */
  base?: string[];

  /** The variants class. */
  variants?: {
    [K in keyof Variants]?: {
      [V in ReverseBooleanMap<Variants[K]>]?: string[];
    };
  };

  /** The combined variants classes. */
  compoundVariants?: Array<CompoundVariant<Variants>>;
}

/** A multi-part CSS class composition. */
export type MultiPartClassComposition<
  Parts extends string,
  Variants extends Record<string, any>
> = Record<Parts, ClassComposition<Variants>>;

export type UseClassesFn<
  Parts extends string,
  Variants extends Record<string, any>
> = (
  variantProps: VariantSelection<Variants>
) => Accessor<Record<Parts, string>>;

/** Extract the variant props type of `useClasses` primitive. */
export type VariantProps<T extends UseClassesFn<any, any>> = Parameters<T>[1];

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

/**
 * Create a multipart CSS class composition with multi-variant support.
 * @return A function to apply the CSS classes to each part for a given set of variants.
 */
export function createClassComposition<
  Parts extends string,
  Variants extends Record<string, any>
>(
  composition: MultiPartClassComposition<Parts, Variants>,
  defaultVariants?: VariantSelection<Variants>
): UseClassesFn<Parts, Variants> {
  const parts = Object.keys(composition) as Array<Parts>;

  return function useMultiPartClassComposition(
    variantProps: VariantSelection<Variants>
  ) {
    const selectedVariants = createMemo(() => {
      return {
        ...defaultVariants,
        ...filterUndefined(variantProps),
      } as VariantSelection<Variants>;
    });

    const classes = createMemo(() => {
      return parts.reduce((acc, part) => {
        const baseClasses = composition[part].base ?? [];
        const variantClasses = composition[part].variants ?? ({} as any);
        const compoundVariants = composition[part].compoundVariants ?? [];

        // 1. add "base" classes.
        const classes = [...baseClasses];

        // 2. add "variants" classes.
        for (const name in selectedVariants()) {
          const value = selectedVariants()[name];

          if (value == null) {
            continue;
          }

          classes.push(...(variantClasses[name]?.[String(value)] ?? []));
        }

        // 3. add "compound variants" classes.
        for (const compoundVariant of compoundVariants) {
          if (
            shouldApplyCompoundVariant(
              compoundVariant.variants,
              selectedVariants()
            )
          ) {
            classes.push(...compoundVariant.classes);
          }
        }

        acc[part] = clsx(classes);

        return acc;
      }, {} as Record<Parts, string>);
    });

    return classes;
  };
}
