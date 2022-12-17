/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e6808d1b5e80cef7af7e63974f658043593b2e1e/packages/@react-aria/menu/src/useMenuSection.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useMenuGroupContext } from "./menu-group-context";

/**
 * A component used to render the label of a `Menu.Group`.
 * It won't be focusable using arrow keys.
 */
export const MenuGroupLabel = createPolymorphicComponent<"span">(props => {
  const context = useMenuGroupContext();

  props = mergeDefaultProps(
    {
      as: "span",
      id: context.generateId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id"]);

  createEffect(() => onCleanup(context.registerLabel(local.id!)));

  return <Dynamic component={local.as} id={local.id} aria-hidden="true" {...others} />;
});
