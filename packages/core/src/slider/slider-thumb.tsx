import {
  composeEventHandlers,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, onMount, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";

export interface SliderThumbProps extends OverrideComponentProps<"span", AsChildProp> {
  index: number;
  style?: JSX.CSSProperties;
}

export function SliderThumb(props: SliderThumbProps) {
  let ref: HTMLElement | undefined;
  const context = useSliderContext();

  props = mergeDefaultProps({ id: context.generateId("thumb") }, props);
  const [local, others] = splitProps(props, ["ref", "style", "index"]);

  const value = () => context.state.getThumbValue(local.index) as number | undefined;
  const position = () => context.state.getValuePercent(context.state.values()[local.index]);

  createEffect(() => {
    console.log(context.state.values());
  });

  onMount(() => {
    if (ref) context.thumbs.add(ref);
    onCleanup(() => {
      if (ref) context.thumbs.delete(ref);
    });
  });

  return (
    <Polymorphic
      ref={mergeRefs(el => (ref = el), local.ref)}
      fallback="span"
      children={props.children}
      aria-label={others["aria-label"]}
      aria-valuetext={context.state.getThumbValueLabel(local.index)}
      aria-valuemin={context.state.getThumbMinValue(local.index)}
      aria-valuenow={value()}
      aria-valuemax={context.state.getThumbMaxValue(local.index)}
      aria-orientation={context.orientation}
      data-orientation={context.orientation}
      data-disabled={context.state.isDisabled ? "" : undefined}
      tabIndex={context.state.isDisabled ? undefined : 0}
      onFocus={composeEventHandlers([
        props.onFocus,
        () => {
          context.state.setFocusedThumb(props.index);
        },
      ])}
      style={{
        display: value() === undefined ? "none" : undefined,
        position: "absolute",
        [context.state.orientation === "vertical" ? "top" : "left"]: `${position() * 100}%`,
        transform: "translate(-50%, -50%)",
        "touch-action": "none",
        ...local.style,
      }}
      {...others}
    />
  );
}
