import { ComponentProps } from "solid-js";

import { useProgressContext } from "./progress-context";
import { Polymorphic } from "../polymorphic";

/**
 * The component that visually represents the progress track.
 * Act as a container for `Progress.Fill`.
 */
export function ProgressTrack(props: ComponentProps<"div">) {
  const context = useProgressContext();

  return <Polymorphic fallback="div" {...context.dataset()} {...props} />;
}
