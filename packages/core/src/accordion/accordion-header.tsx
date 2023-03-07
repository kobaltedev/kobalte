import { OverrideComponentProps } from "@kobalte/utils";

import { useCollapsibleContext } from "../collapsible/collapsible-context";
import { AsChildProp, Polymorphic } from "../polymorphic";

/**
 * Wraps an `Accordion.Trigger`.
 * Use the `as` prop to update it to the appropriate heading level for your page.
 */
export function AccordionHeader(props: OverrideComponentProps<"h3", AsChildProp>) {
  // `Accordion.Item` is a `Collapsible.Root`.
  const context = useCollapsibleContext();

  return <Polymorphic fallback="h3" {...context.dataset()} {...props} />;
}
