import {
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
  ValidationState,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { createEffect, createSignal, JSX, splitProps } from "solid-js";

import { AsChildProp } from "../polymorphic";
import { useSliderContext } from "./slider-context";
import { useThumbContext } from "./slider-thumb";

export interface SliderInputProps extends OverrideComponentProps<"input", AsChildProp> {
  style?: JSX.CSSProperties;
  isRequired?: boolean;
  validationState?: ValidationState;
}

/**
 * The native html input that is visually hidden in the slider thumb.
 */
export function SliderInput(props: SliderInputProps) {
  let ref: HTMLInputElement | undefined;
  const context = useSliderContext();
  const thumb = useThumbContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("input"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "style",
    "isRequired",
    "validationState",
  ]);

  const [valueText, setValueText] = createSignal("");

  createEffect(() => {
    setValueText(thumb.index() === -1 ? "" : context.state.getThumbValueLabel(thumb.index()));
  });

  return (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <input
      ref={mergeRefs(el => (ref = el), local.ref)}
      type="range"
      tabIndex={!context.state.isDisabled() ? 0 : undefined}
      min={context.state.getThumbMinValue(thumb.index())}
      max={context.state.getThumbMaxValue(thumb.index())}
      step={context.state.step()}
      value={context.state.values()[thumb.index()]}
      disabled={context.state.isDisabled()}
      style={{ ...visuallyHiddenStyles, ...local.style }}
      aria-orientation={context.state.orientation()}
      aria-valuetext={valueText()}
      aria-required={local.isRequired || undefined}
      aria-invalid={local.validationState === "invalid" || undefined}
      aria-errormessage={others["aria-errormessage"]}
      onChange={e => {
        context.state.setThumbValue(thumb.index(), parseFloat(e.currentTarget.value));
      }}
      {...others}
    />
  );
}
