/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/listbox/src/useOption.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useListboxItemContext } from "./listbox-item-context";

/**
 * An optional accessible description to be announced for the item.
 * Useful for items that have more complex content (e.g. icons, multiple lines of text, etc.)
 */
export const ListboxItemDescription = /*#__PURE__*/ createPolymorphicComponent<"div">(props => {
  const context = useListboxItemContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("description"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerDescriptionId(local.id!)));

  return <Dynamic component={local.as} id={local.id} {...context.dataset()} {...others} />;
});
