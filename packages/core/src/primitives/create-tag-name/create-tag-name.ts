/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/main/packages/ariakit-utils/src/hooks.ts
 */

import { stringOrUndefined } from "@kobalte/utils";
import { Accessor, Component, createEffect, createSignal } from "solid-js";

/**
 * Returns the tag name by parsing an element ref and the `as` prop.
 * @example
 * function Component(props) {
 *   let ref: HTMLDivElement | undefined;
 *   const tagName = createTagName(() => ref, () => "button"); // div
 *   return <div ref={ref} {...props} />;
 * }
 */
export function createTagName(
  ref: Accessor<HTMLElement | undefined>,
  type?: Accessor<string | Component | undefined>
) {
  const [tagName, setTagName] = createSignal(stringOrUndefined(type?.()));

  createEffect(() => {
    setTagName(ref()?.tagName.toLowerCase() || stringOrUndefined(type?.()));
  });

  return tagName;
}
