/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import {
  callHandler,
  composeEventHandlers,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import * as Collapsible from "../collapsible";
import { useCollapsibleContext } from "../collapsible/collapsible-context";
import { AsChildProp } from "../polymorphic";
import { CollectionItemWithRef } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useAccordionContext } from "./accordion-context";
import { useAccordionItemContext } from "./accordion-item-context";

export interface AccordionTriggerProps extends OverrideComponentProps<"button", AsChildProp> {}

/**
 * Toggles the collapsed state of its associated item. It should be nested inside an `Accordion.Header`.
 */
export function AccordionTrigger(props: AccordionTriggerProps) {
  let ref: HTMLElement | undefined;

  const accordionContext = useAccordionContext();
  const itemContext = useAccordionItemContext();
  const collapsibleContext = useCollapsibleContext();

  const defaultId = itemContext.generateId("trigger");

  props = mergeDefaultProps({ id: defaultId }, props);

  const [local, others] = splitProps(props, [
    "ref",
    "onPointerDown",
    "onPointerUp",
    "onClick",
    "onKeyDown",
    "onMouseDown",
    "onFocus",
  ]);

  createDomCollectionItem<CollectionItemWithRef>({
    getItem: () => ({
      ref: () => ref,
      type: "item",
      key: itemContext.value(),
      textValue: "", // not applicable here
      disabled: collapsibleContext.disabled(),
    }),
  });

  const selectableItem = createSelectableItem(
    {
      key: () => itemContext.value(),
      selectionManager: () => accordionContext.listState().selectionManager(),
      disabled: () => collapsibleContext.disabled(),
      shouldSelectOnPressUp: true,
    },
    () => ref
  );

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    // Prevent `Enter` and `Space` default behavior which fires a click event when using a <button>.
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
    }

    callHandler(e, local.onKeyDown);
    callHandler(e, selectableItem.onKeyDown);
  };

  createEffect(() => onCleanup(itemContext.registerTriggerId(others.id!)));

  return (
    <Collapsible.Trigger
      ref={mergeRefs(el => (ref = el), local.ref)}
      data-key={selectableItem.dataKey()}
      onPointerDown={composeEventHandlers([local.onPointerDown, selectableItem.onPointerDown])}
      onPointerUp={composeEventHandlers([local.onPointerUp, selectableItem.onPointerUp])}
      onClick={composeEventHandlers([local.onClick, selectableItem.onClick])}
      onKeyDown={onKeyDown}
      onMouseDown={composeEventHandlers([local.onMouseDown, selectableItem.onMouseDown])}
      onFocus={composeEventHandlers([local.onFocus, selectableItem.onFocus])}
      {...others}
    />
  );
}
