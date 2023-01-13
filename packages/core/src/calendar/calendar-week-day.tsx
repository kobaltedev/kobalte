import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

/**
 * A weekday cell of a `Calendar.Grid`.
 */
export const CalendarWeekDay = createPolymorphicComponent<"th">(props => {
  props = mergeDefaultProps({ as: "th" }, props);

  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as} {...others} />;
});
