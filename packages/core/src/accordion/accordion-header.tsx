import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export const AccordionHeader = createPolymorphicComponent<"h3">(props => {
  props = mergeDefaultProps({ as: "h3" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...others} />;
});
