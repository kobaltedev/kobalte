import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";

export interface ToastProgressTrackProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The component that visually represents the toast lifetime.
 * Act as a container for `Toast.ProgressFill`.
 */
export function ToastProgressTrack(props: ToastProgressTrackProps) {
  return <Polymorphic as="div" aria-hidden="true" role="presentation" {...props} />;
}
