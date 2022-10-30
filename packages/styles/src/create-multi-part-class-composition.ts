/*!
 * Original code by SEEK
 * MIT Licensed, Copyright (c) 2021 SEEK.
 *
 * Credits to the SEEK team:
 * https://github.com/seek-oss/vanilla-extract/blob/master/packages/recipes/src/createRuntimeFn.ts
 */

import { filterUndefined, pack } from "@kobalte/utils";
import { clsx } from "clsx";
import { createMemo } from "solid-js";

import { useComponentConfig } from "./components-config-provider";
import { shouldApplyCompound } from "./create-class-composition";
import {
  MultiPartClassComposition,
  MultiPartVariantSelection,
  UseMultiPartClassCompositionFn,
} from "./types";

/**
 * Create a multi-part CSS class composition with multi-variant support.
 * @return A function to apply the CSS classes to each part for a given set of variants.
 */
export function createMultiPartClassComposition<
  Parts extends string,
  Variants extends Record<string, any>
>(
  composition: MultiPartClassComposition<Parts, Variants>,
  defaultVariants?: MultiPartVariantSelection<Variants>
): UseMultiPartClassCompositionFn<Parts, Variants> {
  const parts = Object.keys(composition) as Array<Parts>;

  return function useMultiPartClassComposition(
    name: string,
    variantProps: MultiPartVariantSelection<Variants>
  ) {
    const componentConfig = useComponentConfig(name);

    const selectedVariants = createMemo(() => {
      return {
        ...defaultVariants,
        ...filterUndefined(variantProps),
      } as MultiPartVariantSelection<Variants>;
    });

    const classes = createMemo(() => {
      const themeComposition = componentConfig()?.classComposition;

      return parts.reduce((acc, part) => {
        const baseClass = composition[part].base ?? "";
        const variantClasses = composition[part].variants ?? ({} as any);
        const compoundVariants = composition[part].compoundVariants ?? [];

        const themeBaseClass = themeComposition?.[part]?.base ?? "";
        const themeVariantClasses =
          themeComposition?.[part]?.variants ?? ({} as any);
        const themeCompoundVariants =
          themeComposition?.[part]?.compoundVariants ?? [];

        // 1. add "base" classes.
        const classes = [...pack(baseClass), ...pack(themeBaseClass)];

        // 2. add "variants" classes.
        for (const name in selectedVariants()) {
          const value = selectedVariants()[name];

          if (value == null) {
            continue;
          }

          classes.push(...pack(variantClasses[name]?.[String(value)]));
          classes.push(...pack(themeVariantClasses[name]?.[String(value)]));
        }

        // 3. add "compound variants" classes.
        for (const compoundVariant of [
          ...compoundVariants,
          ...themeCompoundVariants,
        ]) {
          if (
            shouldApplyCompound(compoundVariant.variants, selectedVariants())
          ) {
            classes.push(...pack(compoundVariant.classes));
          }
        }

        acc[part] = clsx(classes);

        return acc;
      }, {} as Record<Parts, string>);
    });

    return classes;
  };
}
