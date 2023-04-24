import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";

export interface AlertRootProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * Alert displays a brief, important message
 * in a way that attracts the user's attention without interrupting the user's task.
 */
export function AlertRoot(props: AlertRootProps) {
  return <Polymorphic as="div" role="alert" {...props} />;
}
