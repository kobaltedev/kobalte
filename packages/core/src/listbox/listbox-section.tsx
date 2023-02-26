import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

/**
 * A component used to render the label of a listbox option group.
 * It won't be focusable using arrow keys.
 */
export const ListboxSection = createPolymorphicComponent<"li">(props => {
  props = mergeDefaultProps({ as: "li" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} role="presentation" {...others} />;
});
