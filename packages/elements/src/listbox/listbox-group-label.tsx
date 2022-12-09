/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useListBoxSection.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useListboxGroupContext } from "./listbox-group-context";

/**
 * A component used to render the label of a ListBox.GroupOptions.
 * It won't be focusable using arrow keys.
 */
export const ListboxGroupLabel = createPolymorphicComponent<"span">(props => {
  const context = useListboxGroupContext();

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
