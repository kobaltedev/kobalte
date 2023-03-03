import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";

/**
 * Alert displays a brief, important message
 * in a way that attracts the user's attention without interrupting the user's task.
 */
export function AlertRoot(props: OverrideComponentProps<"div", AsChildProp>) {
  return <Polymorphic fallback="div" role="alert" {...props} />;
}
