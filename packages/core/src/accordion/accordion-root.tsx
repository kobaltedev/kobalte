/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import {
  composeEventHandlers,
  createGenerateId,
  createPolymorphicComponent,
  isArray,
  isString,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, createSignal, createUniqueId, onMount, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createListState, createSelectableList } from "../list";
import { CollectionItem } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { SelectionMode } from "../selection";
import { AccordionContext, AccordionContextValue } from "./accordion-context";

export interface AccordionRootOptions {
  /** The controlled value of the accordion item to expand. */
  value?: Iterable<string>;

  /**
   * The value of the accordion item to expand when initially rendered.
   * Useful when you do not need to control the state.
   */
  defaultValue?: Iterable<string>;

  /** Event handler called when the value changes. */
  onValueChange?: (value: Set<string>) => void;

  /** Determines whether one or multiple items can be opened at the same time. */
  type?: Exclude<SelectionMode, "none">;

  /** When `allowMultiple` is `false`, allows closing content when clicking trigger for an open item. */
  isCollapsible?: boolean;

  /** Whether focus should wrap around when the end/start is reached. */
  shouldFocusWrap?: boolean;
}

export const AccordionRoot = createPolymorphicComponent<"div", AccordionRootOptions>(props => {
  let ref: HTMLDivElement | undefined;

  const defaultId = `accordion-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
      type: "single",
      isCollapsible: false,
      shouldFocusWrap: true,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "value",
    "defaultValue",
    "onValueChange",
    "type",
    "isCollapsible",
    "shouldFocusWrap",
    "onKeyDown",
    "onMouseDown",
    "onFocusIn",
    "onFocusOut",
  ]);

  const [items, setItems] = createSignal<CollectionItem[]>([]);

  const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });

  const listState = createListState({
    selectedKeys: () => local.value,
    defaultSelectedKeys: () => local.defaultValue,
    onSelectionChange: local.onValueChange,
    disallowEmptySelection: () => local.type === "single" && !local.isCollapsible,
    selectionMode: () => local.type,
    dataSource: items,
  });

  const selectableList = createSelectableList(
    {
      selectionManager: () => listState.selectionManager(),
      collection: () => listState.collection(),
      disallowEmptySelection: () => listState.selectionManager().disallowEmptySelection(),
      shouldFocusWrap: () => local.shouldFocusWrap,
      disallowTypeAhead: true,
      allowsTabNavigation: true,
    },
    () => ref
  );

  const context: AccordionContextValue = {
    listState: () => listState,
    generateId: createGenerateId(() => others.id!),
  };

  onMount(() => {
    const value = local.value || local.defaultValue;

    if (local.type === "multiple" && isString(value)) {
      throw new Error(
        "Invalid prop `type` supplied to `Accordion.Root`. Expected `single` when `defaultValue` or `value` is type `string`."
      );
    }

    if (local.type === "single" && isArray(value)) {
      throw new Error(
        "Invalid prop `type` supplied to `Accordion.Root`. Expected `multiple` when `defaultValue` or `value` is type `string[]`."
      );
    }
  });

  return (
    <DomCollectionProvider>
      <AccordionContext.Provider value={context}>
        <Dynamic
          component={local.as}
          ref={mergeRefs(el => (ref = el), local.ref)}
          onKeyDown={composeEventHandlers([local.onKeyDown, selectableList.handlers.onKeyDown])}
          onMouseDown={composeEventHandlers([
            local.onMouseDown,
            selectableList.handlers.onMouseDown,
          ])}
          onFocusIn={composeEventHandlers([local.onFocusIn, selectableList.handlers.onFocusIn])}
          onFocusOut={composeEventHandlers([local.onFocusOut, selectableList.handlers.onFocusOut])}
          {...others}
        />
      </AccordionContext.Provider>
    </DomCollectionProvider>
  );
});
