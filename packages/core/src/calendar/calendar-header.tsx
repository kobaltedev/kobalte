import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

/**
 * Contains the title and navigation buttons of a `Calendar.Month`.
 */
export const CalendarHeader = createPolymorphicComponent<"div">(props => {
  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...others} />;
});
