/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/listbox/src/useOption.ts
 */

import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useListBoxContext, useListBoxOptionContext } from "./list-box-context";

/**
 * An accessible label to be announced for the option.
 * Useful for options that have more complex content (e.g. icons, multiple lines of text, etc.)
 */
export const ListBoxOptionLabel = createPolymorphicComponent<"div">(props => {
  const listBoxContext = useListBoxContext();
  const optionContext = useListBoxOptionContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: optionContext.generateId("label"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id", "ref"]);

  createEffect(() => onCleanup(optionContext.registerLabel(local.id!)));

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(optionContext.setLabelRef, local.ref)}
      id={local.id}
      {...listBoxContext.dataset()}
      {...others}
    />
  );
});
