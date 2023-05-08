/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import { createGenerateId, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createSignal, createUniqueId, splitProps } from "solid-js";

import * as Collapsible from "../collapsible";
import { AsChildProp } from "../polymorphic";
import { createRegisterId } from "../primitives";
import { useAccordionContext } from "./accordion-context";
import { AccordionItemContext, AccordionItemContextValue } from "./accordion-item-context";

export interface AccordionItemOptions extends AsChildProp {
  /** A unique value for the item. */
  value: string;

  /** Whether the item is disabled. */
  disabled?: boolean;

  /**
   * Used to force mounting the item content when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;
}

export interface AccordionItemProps extends OverrideComponentProps<"div", AccordionItemOptions> {}

/**
 * An item of the accordion, contains all the parts of a collapsible section.
 */
export function AccordionItem(props: AccordionItemProps) {
  const accordionContext = useAccordionContext();

  const defaultId = `${accordionContext.generateId("item")}-${createUniqueId()}`;

  props = mergeDefaultProps({ id: defaultId }, props);

  const [local, others] = splitProps(props, ["value", "disabled"]);

  const [triggerId, setTriggerId] = createSignal<string>();
  const [contentId, setContentId] = createSignal<string>();

  const selectionManager = () => accordionContext.listState().selectionManager();

  const isExpanded = () => {
    return selectionManager().isSelected(local.value);
  };

  const context: AccordionItemContextValue = {
    value: () => local.value,
    triggerId,
    contentId,
    generateId: createGenerateId(() => others.id!),
    registerTriggerId: createRegisterId(setTriggerId),
    registerContentId: createRegisterId(setContentId),
  };

  return (
    <AccordionItemContext.Provider value={context}>
      <Collapsible.Root open={isExpanded()} disabled={local.disabled} {...others} />
    </AccordionItemContext.Provider>
  );
}
