/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useListBoxSection.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useListBoxContext } from "./list-box-context";
import { ListBoxGroupContext, ListBoxGroupContextValue } from "./list-box-group-context";

/**
 * A container for a group of options in a listbox.
 * It provides context for all ListBox.Group* related components.
 */
export const ListBoxGroup = createPolymorphicComponent<"li">(props => {
  const listBoxContext = useListBoxContext();

  const defaultId = `${listBoxContext.generateId("group")}-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "li",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, ["as"]);

  const [labelId, setLabelId] = createSignal<string>();

  const context: ListBoxGroupContextValue = {
    labelId,
    generateId: part => `${others.id!}-${part}`,
    registerLabel: id => {
      setLabelId(id);
      return () => setLabelId(undefined);
    },
  };

  return (
    <ListBoxGroupContext.Provider value={context}>
      <Dynamic component={local.as} role="presentation" {...others} />
    </ListBoxGroupContext.Provider>
  );
});
