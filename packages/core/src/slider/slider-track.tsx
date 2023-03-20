import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";

export interface SliderTrackProps extends OverrideComponentProps<"div", AsChildProp> {}

/**

 * The component that visually represents the progress track.

 * Act as a container for `Progress.Fill`.

 */

export function SliderTrack(props: SliderTrackProps) {
  const context = useSliderContext();

  return <Polymorphic fallback="div" {...context.dataset()} {...props} />;
}
