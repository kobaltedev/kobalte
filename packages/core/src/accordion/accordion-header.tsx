import { OverrideComponentProps } from "@kobalte/utils";

import { useCollapsibleContext } from "../collapsible/collapsible-context.jsx";
import { AsChildProp, Polymorphic } from "../polymorphic/index.jsx";

export interface AccordionHeaderProps extends OverrideComponentProps<"h3", AsChildProp> {}

/**
 * Wraps an `Accordion.Trigger`.
 * Use the `as` prop to update it to the appropriate heading level for your page.
 */
export function AccordionHeader(props: AccordionHeaderProps) {
  // `Accordion.Item` is a `Collapsible.Root`.
  const context = useCollapsibleContext();

  return <Polymorphic as="h3" {...context.dataset()} {...props} />;
}
