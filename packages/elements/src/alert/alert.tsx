import { createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js/types/server/rendering";
import { Dynamic } from "solid-js/web";

/**
 * Alert displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.
 * This component is based on the [WAI-ARIA Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
 */
export const Alert = createPolymorphicComponent<"div">(props => {
  const [local, others] = splitProps(props, ["as"]);

  return <Dynamic component={local.as ?? "div"} role="alert" {...others} />;
});
