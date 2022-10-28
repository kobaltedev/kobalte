/*!
 * Original code by SEEK
 * MIT Licensed, Copyright (c) 2021 SEEK.
 *
 * Credits to the SEEK team:
 * https://github.com/seek-oss/vanilla-extract/blob/master/packages/recipes/src/types.ts
 */

import { Accessor } from "solid-js";

export type StringOrStringArray = string | string[];

/** String representation of `boolean` type. */
type BooleanStringUnion = "true" | "false";

/** Infer the type to `boolean` if it's a string union of `"true" | "false"`. */
export type BooleanMap<T> = T extends BooleanStringUnion ? boolean : T;

/** Infer the type to string union of `"true" | "false"` if it's a `boolean`. */
export type ReverseBooleanMap<T> = T extends boolean ? BooleanStringUnion : T;

export type MultiPartVariantSelection<Variants extends Record<string, any>> = {
  [VariantGroup in keyof Variants]?: BooleanMap<Variants[VariantGroup]>;
};

export interface MultiPartCompoundVariant<
  Variants extends Record<string, any>
> {
  /** The combined variants that should apply the classes. */
  variants: MultiPartVariantSelection<Variants>;

  /** The classes to be applied. */
  classes: StringOrStringArray;
}

/** A single CSS class composition. */
export interface SinglePartClassComposition<
  Variants extends Record<string, any>
> {
  /** The base classes. */
  base?: StringOrStringArray;

  /** The variants classes. */
  variants?: {
    [K in keyof Variants]?: {
      [V in ReverseBooleanMap<Variants[K]>]?: StringOrStringArray;
    };
  };

  /** The combined variants classes. */
  compoundVariants?: Array<MultiPartCompoundVariant<Variants>>;
}

/** A multi-part CSS class composition. */
export type MultiPartClassComposition<
  Parts extends string,
  Variants extends Record<string, any>
> = Record<Parts, SinglePartClassComposition<Variants>>;

export type UseMultiPartClassCompositionFn<
  Parts extends string,
  Variants extends Record<string, any>
> = (
  name: string,
  variantProps: MultiPartVariantSelection<Variants>
) => Accessor<Record<Parts, string>>;

/** Extract the variant props type of a `useMultiPartClassComposition` primitive. */
export type MultiPartClassCompositionVariantProps<
  T extends UseMultiPartClassCompositionFn<any, any>
> = Parameters<T>[1];
