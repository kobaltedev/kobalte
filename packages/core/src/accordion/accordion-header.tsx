import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCollapsibleContext } from "../collapsible/collapsible-context";

/**
 * Wraps an `Accordion.Trigger`.
 * Use the `as` prop to update it to the appropriate heading level for your page.
 */
export const AccordionHeader = createPolymorphicComponent<"h3">(props => {
  // `Accordion.Item` is a `Collapsible.Root`.
  const context = useCollapsibleContext();

  props = mergeDefaultProps({ as: "h3" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...context.dataset()} {...others} />;
});
