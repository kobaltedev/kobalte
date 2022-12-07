/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/listbox/src/useListBoxSection.ts
 */

import { createPolymorphicComponent, Key, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { CollectionNode } from "../primitives";
import { useListboxGroupContext } from "./listbox-group-context";

export interface ListboxGroupOptionsProps {
  /**
   * A map function that receives a _collection node_ signal representing a listbox option,
   * and an index signal and returns a JSX-Element.
   */
  children: (node: Accessor<CollectionNode>, index: Accessor<number>) => JSX.Element;

  /** The fallback content to render when there is no option. */
  fallback?: JSX.Element;
}

/**
 * A component used to group multiple options in a listbox.
 * Use in conjunction with ListBox.GroupLabel to ensure good accessibility via automatic labelling.
 */
export const ListboxGroupOptions = createPolymorphicComponent<"ul", ListboxGroupOptionsProps>(
  props => {
    const context = useListboxGroupContext();

    props = mergeDefaultProps({ as: "ul" }, props);

    const [local, others] = splitProps(props, ["as", "children", "fallback"]);

    return (
      <Dynamic component={local.as} role="group" aria-labelledby={context.labelId()} {...others}>
        <Key each={[...context.childNodes()]} by="key" fallback={local.fallback}>
          {local.children}
        </Key>
      </Dynamic>
    );
  }
);
