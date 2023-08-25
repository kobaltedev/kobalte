/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/link/src/useLink.ts
 */

import { mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { createTagName } from "../primitives";

export interface LinkRootOptions extends AsChildProp {
  /** Whether the link is disabled. */
  disabled?: boolean;
}

export interface LinkRootProps extends OverrideComponentProps<"a", LinkRootOptions> {}

/**
 * Link allows a user to navigate to another page or resource within a web page or application.
 */
export function LinkRoot(props: LinkRootProps) {
  let ref: HTMLAnchorElement | undefined;

  const [local, others] = splitProps(props, ["ref", "type", "href", "disabled"]);

  const tagName = createTagName(
    () => ref,
    () => "a",
  );

  return (
    <Polymorphic
      as="a"
      ref={mergeRefs(el => (ref = el), local.ref)}
      role={tagName() !== "a" || local.disabled ? "link" : undefined}
      tabIndex={tagName() !== "a" && !local.disabled ? 0 : undefined}
      href={!local.disabled ? local.href : undefined}
      aria-disabled={local.disabled ? true : undefined}
      data-disabled={local.disabled ? "" : undefined}
      {...others}
    />
  );
}
