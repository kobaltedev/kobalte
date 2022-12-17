/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useListBoxSection.ts
 */

import { createGenerateId, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createRegisterId } from "../primitives";
import { useListboxContext } from "./listbox-context";
import { ListboxGroupContext, ListboxGroupContextValue } from "./listbox-group-context";

/**
 * A container used to group multiple `Listbox.Option`s.
 */
export const ListboxGroup = createPolymorphicComponent<"div">(props => {
  const listBoxContext = useListboxContext();

  const defaultId = `${listBoxContext.generateId("group")}-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, ["as"]);

  const [labelId, setLabelId] = createSignal<string>();

  const context: ListboxGroupContextValue = {
    generateId: createGenerateId(() => others.id!),
    registerLabel: createRegisterId(setLabelId),
  };

  return (
    <ListboxGroupContext.Provider value={context}>
      <Dynamic component={local.as} role="group" aria-labelledby={labelId()} {...others} />
    </ListboxGroupContext.Provider>
  );
});
