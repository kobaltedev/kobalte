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
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createSignal, createUniqueId, splitProps } from "solid-js";

import { createListState, createSelectableList } from "../list";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { CollectionItemWithRef } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { AccordionContext, AccordionContextValue } from "./accordion-context";

export interface AccordionRootOptions extends AsChildProp {
  /** The controlled value of the accordion item(s) to expand. */
  value?: string[];

  /**
   * The value of the accordion item(s) to expand when initially rendered.
   * Useful when you do not need to control the state.
   */
  defaultValue?: string[];

  /** Event handler called when the value changes. */
  onChange?: (value: string[]) => void;

  /** Whether multiple items can be opened at the same time. */
  multiple?: boolean;

  /** When `multiple` is `false`, allows closing content when clicking trigger for an open item. */
  collapsible?: boolean;

  /** Whether focus should wrap around when the end/start is reached. */
  shouldFocusWrap?: boolean;
}

export interface AccordionRootProps extends OverrideComponentProps<"div", AccordionRootOptions> {}

/**
 * A vertically stacked set of interactive headings that each reveal an associated section of content.
 */
export function AccordionRoot(props: AccordionRootProps) {
  let ref: HTMLDivElement | undefined;

  const defaultId = `accordion-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      multiple: false,
      collapsible: false,
      shouldFocusWrap: true,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "value",
    "defaultValue",
    "onChange",
    "multiple",
    "collapsible",
    "shouldFocusWrap",
    "onKeyDown",
    "onMouseDown",
    "onFocusIn",
    "onFocusOut",
  ]);

  const [items, setItems] = createSignal<CollectionItemWithRef[]>([]);

  const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });

  const listState = createListState({
    selectedKeys: () => local.value,
    defaultSelectedKeys: () => local.defaultValue,
    onSelectionChange: value => local.onChange?.(Array.from(value)),
    disallowEmptySelection: () => !local.multiple && !local.collapsible,
    selectionMode: () => (local.multiple ? "multiple" : "single"),
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

  return (
    <DomCollectionProvider>
      <AccordionContext.Provider value={context}>
        <Polymorphic
          as="div"
          ref={mergeRefs(el => (ref = el), local.ref)}
          onKeyDown={composeEventHandlers([local.onKeyDown, selectableList.onKeyDown])}
          onMouseDown={composeEventHandlers([local.onMouseDown, selectableList.onMouseDown])}
          onFocusIn={composeEventHandlers([local.onFocusIn, selectableList.onFocusIn])}
          onFocusOut={composeEventHandlers([local.onFocusOut, selectableList.onFocusOut])}
          {...others}
        />
      </AccordionContext.Provider>
    </DomCollectionProvider>
  );
}
