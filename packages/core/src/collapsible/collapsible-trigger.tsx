/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.tsx
 */

import { callHandler } from "@kobalte/utils";
import { ComponentProps, JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { useCollapsibleContext } from "./collapsible-context";

/**
 * The button that expands/collapses the collapsible content.
 */
export function CollapsibleTrigger(props: ComponentProps<"button">) {
  const context = useCollapsibleContext();

  const [local, others] = splitProps(props, ["onClick"]);

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);
    context.toggle();
  };

  return (
    <Button.Root
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.contentId() : undefined}
      isDisabled={context.isDisabled()}
      onClick={onClick}
      {...context.dataset()}
      {...others}
    />
  );
}
