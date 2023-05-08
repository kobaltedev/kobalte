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
 * The component that visually represents the slider value.
 * Used to visually show the fill of `Slider.Track`.
 */
export function SliderFill(props: SliderFillProps) {
  const context = useSliderContext();

  const [local, others] = splitProps(props, ["style"]);

  const percentages = () => {
    return context.state.values().map(value => context.state.getValuePercent(value) * 100);
  };
  const offsetStart = () => {
    return context.state.values().length > 1 ? Math.min(...percentages()) : 0;
  };

  const offsetEnd = () => {
    return 100 - Math.max(...percentages());
  };

  return (
    <Polymorphic
      as="div"
      style={{
        [context.startEdge()]: `${offsetStart()}%`,
        [context.endEdge()]: `${offsetEnd()}%`,
        ...local.style,
      }}
      {...context.dataset()}
      {...others}
    />
  );
}
