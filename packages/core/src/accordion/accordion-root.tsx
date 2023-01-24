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
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createListState, createSelectableList } from "../list";
import { CollectionItem } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
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

  /** Whether multiple items can be opened at the same time. */
  allowMultiple?: boolean;

  /** When `allowMultiple` is `false`, allows closing content when clicking trigger for an open item. */
  isCollapsible?: boolean;
}

export const AccordionRoot = createPolymorphicComponent<"div", AccordionRootOptions>(props => {
  let ref: HTMLDivElement | undefined;

  const defaultId = `accordion-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
      allowMultiple: false,
      isCollapsible: false,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "value",
    "defaultValue",
    "onValueChange",
    "allowMultiple",
    "isCollapsible",
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
    disallowEmptySelection: () => !local.allowMultiple && !local.isCollapsible,
    selectionMode: () => (local.allowMultiple ? "multiple" : "single"),
    dataSource: items,
  });

  const selectableList = createSelectableList(
    {
      selectionManager: () => listState.selectionManager(),
      collection: () => listState.collection(),
      disallowEmptySelection: () => listState.selectionManager().disallowEmptySelection(),
      disallowTypeAhead: true,
      shouldFocusWrap: true,
      allowsTabNavigation: true,
    },
    () => ref
  );

  const context: AccordionContextValue = {
    listState: () => listState,
    generateId: createGenerateId(() => others.id!),
  };

  // TODO: warn about value, defaultValue, onValueChange depending on allowMultiple

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
