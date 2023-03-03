import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useProgressContext } from "./progress-context";

/**
 * The component that visually represents the progress track.
 * Act as a container for `Progress.Fill`.
 */
export function ProgressTrack(props: OverrideComponentProps<"div", AsChildProp>) {
  const context = useProgressContext();

  return <Polymorphic fallback="div" {...context.dataset()} {...props} />;
}
