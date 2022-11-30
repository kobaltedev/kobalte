/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/84e97943ad637a582c01c9b56d880cd95f595737/packages/ariakit/src/hovercard/hovercard-anchor.ts
 */

import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { Link } from "../link";

/**
 * The link that opens the hover card when hovered
 */
export const HoverCardTrigger = createPolymorphicComponent<"a">(props => {
  props = mergeDefaultProps({ as: "a" }, props);

  const [local, others] = splitProps(props, []);

  return <Link {...others} />;
});
