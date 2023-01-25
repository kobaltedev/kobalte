/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import * as Collapsible from "../collapsible";
import { useAccordionItemContext } from "./accordion-item-context";

export interface AccordionContentOptions extends Collapsible.CollapsibleContentOptions {}

export const AccordionContent = createPolymorphicComponent<"div", AccordionContentOptions>(
  props => {
    const itemContext = useAccordionItemContext();

    const defaultId = itemContext.generateId("content");

    props = mergeDefaultProps(
      {
        as: "div",
        id: defaultId,
      },
      props
    );

    const [local, others] = splitProps(props, ["style"]);

    createEffect(() => onCleanup(itemContext.registerContentId(others.id!)));

    return (
      <Collapsible.Content
        role="region"
        aria-labelledby={itemContext.triggerId()}
        style={{
          "--kb-accordion-content-height": "var(--kb-collapsible-content-height)",
          "--kb-accordion-content-width": "var(--kb-collapsible-content-width)",
          ...local.style,
        }}
        {...others}
      />
    );
  }
);
