import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";

/**
 * Alert displays a brief, important message
 * in a way that attracts the user's attention without interrupting the user's task.
 */
export function AlertRoot(props: ComponentProps<"div">) {
  return <Polymorphic fallbackComponent="div" role="alert" {...props} />;
}
