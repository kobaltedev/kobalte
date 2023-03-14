import { OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";

export interface SliderFillOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface SliderFillProps extends OverrideComponentProps<"div", SliderFillOptions> {}

/**
 * The component that visually represents the progress value.
 * Used to visually show the fill of `Progress.Track`.
 */
export function SliderFill(props: SliderFillProps) {
  const context = useSliderContext();

  const [local, others] = splitProps(props, ["style"]);

  return (
    <Polymorphic
      fallback="div"
      style={{
        "--kb-slider-fill-width": context.sliderFillWidth(),
        ...local.style,
      }}
      {...context.dataset()}
      {...others}
    />
  );
}
