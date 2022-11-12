import { ComponentProps } from "solid-js";

export interface AlertProps extends ComponentProps<"div"> {}

/**
 * Alert displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.
 * This component is based on the [WAI-ARIA Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
 */
export function Alert(props: AlertProps) {
  return <div role="alert" {...props} />;
}
