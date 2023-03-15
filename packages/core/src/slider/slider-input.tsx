import { mergeDefaultProps, OverrideComponentProps, visuallyHiddenStyles } from "@kobalte/utils";
import { createEffect, createMemo, JSX, on, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";

export interface SliderInputProps extends OverrideComponentProps<"input", AsChildProp> {
  style?: JSX.CSSProperties;
  index: number;
}

/**
 * An accessible label that gives the user information on the progress.
 */
export function SliderInput(props: SliderInputProps) {
  const context = useSliderContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("input"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "style", "index"]);

  return (
    <input
      type="range"
      tabIndex={!context.isDisabled() ? 0 : undefined}
      min={context.state.getThumbMinValue(local.index)}
      max={context.state.getThumbMaxValue(local.index)}
      step={context.step}
      value={context.state.values()[local.index]}
      disabled={context.isDisabled()}
      aria-orientation={context.orientation}
      aria-valuetext={context.state.getThumbValueLabel(local.index)}
      // aria-required= {isRequired || undefined}
      // aria-invalid= {validationState === 'invalid' || undefined}
      // 'aria-errormessage'= opts['aria-errormessage'],
      onChange={e => {
        context.state.setThumbValue(local.index, parseFloat(e.currentTarget.value));
      }}
      style={{ ...visuallyHiddenStyles, ...local.style }}
      {...others}
    />
  );
}
