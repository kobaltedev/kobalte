/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/separator/src/useSeparator.ts
 */

import {
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
  Orientation,
} from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createTagName } from "../primitives";

export interface SeparatorOptions {
  /** The orientation of the separator. */
  orientation?: Orientation;
}

/**
 * A separator visually or semantically separates content.
 */
export const Separator = createPolymorphicComponent<"hr", SeparatorOptions>(props => {
  let ref: HTMLElement | undefined;

  props = mergeDefaultProps(
    {
      as: "hr",
      orientation: "horizontal",
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref", "orientation"]);

  const tagName = createTagName(
    () => ref,
    () => local.as || "hr"
  );

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => (ref = el), local.ref)}
      role={tagName() !== "hr" ? "separator" : undefined}
      aria-orientation={local.orientation === "vertical" ? "vertical" : undefined}
      data-orientation={local.orientation}
      {...others}
    />
  );
});
