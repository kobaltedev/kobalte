/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import {
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import * as Button from "../button";
import * as Collapsible from "../collapsible";
import { CollectionItem } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useAccordionContext } from "./accordion-context";
import { useAccordionItemContext } from "./accordion-item-context";

/**
 * Toggles the collapsed state of its associated item. It should be nested inside an `Accordion.Header`.
 */
export const AccordionTrigger = createPolymorphicComponent<
  "button",
  Omit<Button.ButtonRootOptions, "isDisabled">
>(props => {
  let ref: HTMLElement | undefined;

  const accordionContext = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const defaultId = itemContext.generateId("trigger");

  props = mergeDefaultProps(
    {
      as: "button",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "onPressStart",
    "onPressUp",
    "onPress",
    "onLongPress",
    "onFocus",
    "onMouseDown",
    "onDragStart",
  ]);

  createDomCollectionItem<CollectionItem>({
    getItem: () => ({
      ref: () => ref,
      key: itemContext.value(),
      isDisabled: itemContext.isDisabled(),
      label: "", // not applicable
      textValue: "", // not applicable
    }),
  });

  const selectableItem = createSelectableItem(
    {
      key: () => itemContext.value(),
      selectionManager: () => accordionContext.listState().selectionManager(),
      isDisabled: () => itemContext.isDisabled(),
      shouldSelectOnPressUp: true,
    },
    () => ref
  );

  createEffect(() => onCleanup(itemContext.registerTriggerId(others.id!)));

  return (
    <Collapsible.Trigger
      ref={mergeRefs(el => (ref = el), local.ref)}
      isDisabled={selectableItem.isDisabled()}
      preventFocusOnPress={selectableItem.preventFocusOnPress()}
      data-key={selectableItem.dataKey()}
      onFocus={composeEventHandlers([local.onFocus, selectableItem.onFocus])}
      onPressStart={composeEventHandlers([local.onPressStart, selectableItem.onPressStart])}
      onPressUp={composeEventHandlers([local.onPressUp, selectableItem.onPressUp])}
      onPress={composeEventHandlers([local.onPress, selectableItem.onPress])}
      onLongPress={composeEventHandlers([local.onLongPress, selectableItem.onLongPress])}
      onMouseDown={composeEventHandlers([local.onMouseDown, selectableItem.onMouseDown])}
      onDragStart={composeEventHandlers([local.onDragStart, selectableItem.onDragStart])}
      {...others}
    />
  );
});
