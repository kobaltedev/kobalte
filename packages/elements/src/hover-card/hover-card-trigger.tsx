/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard-anchor.ts
 */

import { combineProps, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";

import { Link, LinkProps } from "../link";
import { createHoverCardTrigger } from "./create-hover-card-trigger";
import { useHoverCardContext } from "./hover-card-context";

/**
 * The link that opens the hover card when hovered.
 */
export const HoverCardTrigger = createPolymorphicComponent<"a", LinkProps>(props => {
  const context = useHoverCardContext();

  props = mergeDefaultProps({ as: "a" }, props);

  const { triggerHandlers } = createHoverCardTrigger({
    isDisabled: () => props.isDisabled,
  });

  return (
    <Link
      data-expanded={context.isOpen() ? "" : undefined}
      {...combineProps({ ref: context.setTriggerRef }, props, triggerHandlers)}
    />
  );
});
