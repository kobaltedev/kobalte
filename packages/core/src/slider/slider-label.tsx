import { mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

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

  const [local, others] = splitProps(props, ["id"]);

  createEffect(() => onCleanup(context.registerLabelId(local.id!)));

  return <Polymorphic fallback="span" id={local.id} {...context.dataset()} {...others} />;
}
