/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useListBoxSection.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useListBoxGroupContext } from "./list-box-group-context";

/**
 * A component used to group multiple options in a listbox.
 * Use in conjunction with ListBox.GroupLabel to ensure good accessibility via automatic labelling.
 */
export const ListBoxGroupOptions = createPolymorphicComponent<"ul">(props => {
  const context = useListBoxGroupContext();

  props = mergeDefaultProps({ as: "ul" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Dynamic
      component={local.as}
      role="group"
      aria-labelledby={context.labelId()}
      {...context.dataset()}
      {...others}
    />
  );
});
