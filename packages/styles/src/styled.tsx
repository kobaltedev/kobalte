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

import { ElementType } from "@kobalte/utils";
import { clsx } from "clsx";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  ClassComposition,
  createClassComposition,
  VariantGroups,
  VariantSelection,
} from "./create-class-composition";
import { createPolymorphicComponent } from "./create-polymorphic-component";

/**
 * Create a `styled` component.
 * @param component The component/html element to render.
 * @param composition The CSS classes to apply.
 */
export function styled<
  T extends ElementType,
  Variants extends VariantGroups = {}
>(component: T, composition: ClassComposition<Variants>) {
  const variantPropsKeys: Array<keyof Variants> = composition.variants
    ? Object.keys(composition.variants)
    : [];

  const useClasses = createClassComposition(composition);

  return createPolymorphicComponent<T, VariantSelection<Variants>>(props => {
    const [local, variantProps, others] = splitProps(
      props,
      ["as", "class"],
      variantPropsKeys
    );

    const baseClasses = useClasses(variantProps);

    return (
      <Dynamic
        component={local.as ?? (component as ElementType)}
        class={clsx(baseClasses(), local.class) ?? undefined}
        {...others}
      />
    );
  });
}
