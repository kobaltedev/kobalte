/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/e6808d1b5e80cef7af7e63974f658043593b2e1e/packages/@react-aria/menu/src/useMenuSection.ts
 */

import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useMenuGroupContext } from "./menu-group-context";

export interface MenuGroupLabelProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * A component used to render the label of a `Menu.Group`.
 * It won't be focusable using arrow keys.
 */
export function MenuGroupLabel(props: MenuGroupLabelProps) {
  const context = useMenuGroupContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerLabelId(local.id!)));

  return <Polymorphic as="span" id={local.id} aria-hidden="true" {...others} />;
}
