import {
  focusWithoutScrolling,
  mergeDefaultProps,
  OverrideComponentProps,
  ValidationState,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { createEffect, JSX, splitProps } from "solid-js";

import { AsChildProp } from "../polymorphic";
import { useSliderContext } from "./slider-context";
import { useThumbContext } from "./slider-thumb";

export interface SliderInputProps extends OverrideComponentProps<"input", AsChildProp> {
  style?: JSX.CSSProperties;
  isRequired?: boolean;
  validationState?: ValidationState;
}

/**
 * An accessible label that gives the user information on the progress.
 */
export function SliderInput(props: SliderInputProps) {
  let inputRef!: HTMLInputElement;
  const context = useSliderContext();
  const thumb = useThumbContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("input"),
    },
    props
  );

  const [local, others] = splitProps(props, ["id", "style", "isRequired", "validationState"]);
  const isFocused = () =>
    context.state.focusedThumb() !== undefined && context.state.focusedThumb() === thumb.index();
  createEffect(() => {
    if (isFocused()) {
      focusWithoutScrolling(inputRef);
    }
  });

  return (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <input
      ref={inputRef}
      type="range"
      tabIndex={!context.state.isDisabled() ? 0 : undefined}
      min={context.state.getThumbMinValue(thumb.index())}
      max={context.state.getThumbMaxValue(thumb.index())}
      step={context.state.step()}
      value={context.state.values()[thumb.index()]}
      disabled={context.state.isDisabled()}
      aria-orientation={context.state.orientation()}
      aria-valuetext={context.state.getThumbValueLabel(thumb.index())}
      aria-required={local.isRequired || undefined}
      aria-invalid={local.validationState === "invalid" || undefined}
      aria-errormessage={others["aria-errormessage"]}
      onChange={e => {
        context.state.setThumbValue(thumb.index(), parseFloat(e.currentTarget.value));
      }}
      style={{ ...visuallyHiddenStyles, ...local.style }}
      {...others}
    />
  );
}