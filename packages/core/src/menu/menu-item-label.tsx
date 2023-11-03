/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/listbox/src/useOption.ts
 */

import { mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useMenuItemContext } from "./menu-item.context";

export interface MenuItemLabelProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * An accessible label to be announced for the menu item.
 * Useful for menu items that have more complex content (e.g. icons, multiple lines of text, etc.)
 */
export function MenuItemLabel(props: MenuItemLabelProps) {
  const context = useMenuItemContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["ref", "id"]);

  createEffect(() => onCleanup(context.registerLabel(local.id!)));

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(context.setLabelRef, local.ref)}
      id={local.id}
      {...context.dataset()}
      {...others}
    />
  );
}
