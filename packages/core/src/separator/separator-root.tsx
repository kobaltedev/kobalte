/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/separator/src/useSeparator.ts
 */

import { mergeDefaultProps, mergeRefs, Orientation, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { createTagName } from "../primitives";

export interface SeparatorRootOptions extends AsChildProp {
  /** The orientation of the separator. */
  orientation?: Orientation;
}

export interface SeparatorRootProps extends OverrideComponentProps<"hr", SeparatorRootOptions> {}

/**
 * A separator visually or semantically separates content.
 */
export function SeparatorRoot(props: SeparatorRootProps) {
  let ref: HTMLElement | undefined;

  props = mergeDefaultProps(
    {
      orientation: "horizontal",
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "orientation"]);

  const tagName = createTagName(
    () => ref,
    () => "hr"
  );

  return (
    <Polymorphic
      as="hr"
      ref={mergeRefs(el => (ref = el), local.ref)}
      role={tagName() !== "hr" ? "separator" : undefined}
      aria-orientation={local.orientation === "vertical" ? "vertical" : undefined}
      data-orientation={local.orientation}
      {...others}
    />
  );
}
