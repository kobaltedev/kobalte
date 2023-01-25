import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useAccordionItemContext } from "./accordion-item-context";

export const AccordionHeader = createPolymorphicComponent<"h3">(props => {
  const context = useAccordionItemContext();

  props = mergeDefaultProps({ as: "h3" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return (
    <Dynamic
      component={local.as}
      data-expanded={context.isExpanded() ? "" : undefined}
      {...others}
    />
  );
});
