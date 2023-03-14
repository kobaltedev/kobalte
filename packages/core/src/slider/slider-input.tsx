import { mergeDefaultProps, OverrideComponentProps, visuallyHiddenStyles } from "@kobalte/utils";
import { createEffect, createMemo, JSX, on, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";

export interface SliderInputProps extends OverrideComponentProps<"input", AsChildProp> {
  value?: number;
  style?: JSX.CSSProperties;
  index: number;
}

/**
 * An accessible label that gives the user information on the progress.
 */
export function SliderInput(props: SliderInputProps) {
  // let ref!: HTMLInputElement;
  const context = useSliderContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("input"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "style", "value", "index"]);

  // const previousValue = createMemo(previous => {
  //   if (local.value !== previous) {
  //     return local.value;
  //   }
  // }, local.value);

  // createEffect(
  //   on(
  //     () => local.value,
  //     () => {
  //       const input = ref;
  //       const inputProto = window.HTMLInputElement.prototype;
  //       const descriptor = Object.getOwnPropertyDescriptor(
  //         inputProto,
  //         "value"
  //       ) as PropertyDescriptor;
  //       const setValue = descriptor.set;
  //       if (previousValue() !== local.value && setValue) {
  //         const event = new Event("input", { bubbles: true });
  //         setValue.call(input, local.value);
  //         input.dispatchEvent(event);
  //       }
  //     }
  //   )
  // );

  return (
    <input
      type="range"
      tabIndex={!context.state.isDisabled ? 0 : undefined}
      min={context.state.getThumbMinValue(local.index)}
      max={context.state.getThumbMaxValue(local.index)}
      step={context.state.step}
      value={context.state.values()[local.index]}
      disabled={context.state.isDisabled}
      aria-orientation={context.state.orientation}
      aria-valuetext={context.state.getThumbValueLabel(local.index)}
      // aria-required= {isRequired || undefined}
      // aria-invalid= {validationState === 'invalid' || undefined}
      // 'aria-errormessage'= opts['aria-errormessage'],
      onChange={e => {
        context.state.setThumbValue(local.index, parseFloat(e.currentTarget.value));
      }}
      style={{ ...visuallyHiddenStyles, ...local.style }}
      {...props}
    />
  );
}
