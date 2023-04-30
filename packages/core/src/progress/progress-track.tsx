import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic/index.js";
import { useProgressContext } from "./progress-context.js";

export interface ProgressTrackProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The component that visually represents the progress track.
 * Act as a container for `Progress.Fill`.
 */
export function ProgressTrack(props: ProgressTrackProps) {
  const context = useProgressContext();

  return <Polymorphic as="div" {...context.dataset()} {...props} />;
}
