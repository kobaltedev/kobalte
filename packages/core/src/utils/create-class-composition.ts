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
type BooleanMap<T> = T extends BooleanStringUnion ? boolean : T;

/** Infer the type to string union of `"true" | "false"` if it's a `boolean`. */
type ReverseBooleanMap<T> = T extends boolean ? BooleanStringUnion : T;

type VariantSelection<Variants extends Record<string, any>> = {
  [VariantGroup in keyof Variants]?: BooleanMap<Variants[VariantGroup]>;
};

type CompoundVariant<Variants extends Record<string, any>> =
  VariantSelection<Variants> & {
    /** The CSS classes to be applied. */
    classes: string;
  };

/** A class composition part. */
interface ClassCompositionPart<Variants extends Record<string, any>> {
  /** The base classes. */
  base?: string;

  /** The variants class. */
  variants?: {
    [K in keyof Variants]?: {
      [V in ReverseBooleanMap<Variants[K]>]?: string;
    };
  };

  /** The combined variants classes. */
  compoundVariants?: Array<CompoundVariant<Variants>>;
}

/** A multi-part class composition. */
type ClassComposition<
  Parts extends string,
  Variants extends Record<string, any>
> = Record<Parts, ClassCompositionPart<Variants>>;

type UseClassCompositionFn<
  Parts extends string,
  Variants extends Record<string, any>
> = (
  variantProps: VariantSelection<Variants>
) => Accessor<Record<Parts, string>>;

/** Return whether a compound variant should be applied. */
function shouldApplyCompoundVariant<T extends Record<string, any>>(
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
 * @return A function to apply the CSS classes to each part of the component for a given set of variants.
 */
export function createClassComposition<
  Parts extends string,
  Variants extends Record<string, any>
>(
  config: ClassComposition<Parts, Variants>,
  defaultVariants?: VariantSelection<Variants>
): UseClassCompositionFn<Parts, Variants> {
  const parts = Object.keys(config) as Array<Parts>;

  return function useClassComposition(
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
        const baseClasses = config[part].base ?? "";
        const variantClasses = config[part].variants ?? ({} as any);
        const compoundVariants = config[part].compoundVariants ?? [];

        // 1. add "base" classes.
        const result = [baseClasses];

        // 2. add "variants" classes.
        for (const name in selectedVariants()) {
          const value = selectedVariants()[name];

          if (value == null) {
            continue;
          }

          result.push(variantClasses[name]?.[String(value)]);
        }

        // 3. add "compound variants" classes.
        for (const { classes, ...variants } of compoundVariants) {
          if (
            shouldApplyCompoundVariant(
              variants as VariantSelection<Variants>,
              selectedVariants()
            )
          ) {
            result.push(classes);
          }
        }

        acc[part] = clsx(result);

        return acc;
      }, {} as Record<Parts, string>);
    });

    return classes;
  };
}
