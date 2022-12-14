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

import { CollectionNode, createRegisterId } from "../primitives";
import { useListboxContext } from "./listbox-context";
import { ListboxGroupContext, ListboxGroupContextValue } from "./listbox-group-context";

export interface ListboxGroupProps {
  /** The collection node to render. */
  node: CollectionNode;
}

/**
 * A container for a group of options in a listbox.
 * It provides context for all ListBox.Group* related components.
 */
export const ListboxGroup = createPolymorphicComponent<"li", ListboxGroupProps>(props => {
  const listBoxContext = useListboxContext();

  const defaultId = `${listBoxContext.generateId("group")}-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "li",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "node"]);

  const [labelId, setLabelId] = createSignal<string>();

  const context: ListboxGroupContextValue = {
    labelId,
    childNodes: () => local.node.childNodes,
    generateId: createGenerateId(() => others.id!),
    registerLabel: createRegisterId(setLabelId),
  };

  return (
    <ListboxGroupContext.Provider value={context}>
      <Dynamic component={local.as} role="presentation" {...others} />
    </ListboxGroupContext.Provider>
  );
});
