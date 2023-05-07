import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";

export interface SliderLabelProps extends OverrideComponentProps<"span", AsChildProp> {}

/**
 * An accessible label that gives the user information on the slider.
 */
export function SliderLabel(props: SliderLabelProps) {
  const context = useSliderContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );

  createEffect(() => onCleanup(context.registerLabelId(props.id!)));

  return <Polymorphic as="span" {...context.dataset()} {...props} />;
}
