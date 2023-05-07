import { OverrideComponentProps } from "@kobalte/utils";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";

export interface SliderValueLabelProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The accessible label text representing the current value in a human-readable format.
 */
export function SliderValueLabel(props: SliderValueLabelProps) {
  const context = useSliderContext();

  return (
    <Polymorphic as="div" {...context.dataset()} {...props}>
      {context.getValueLabel?.({
        values: context.state.values(),
        max: context.maxValue(),
        min: context.minValue(),
      })}
    </Polymorphic>
  );
}
