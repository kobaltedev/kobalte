import {
  composeEventHandlers,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, createMemo, JSX, onCleanup, onMount, splitProps } from "solid-js";

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

  const value = () => context.state.values()[local.index];
  const position = () => {
    return context.state.getThumbPercent(local.index);
  };

  onMount(() => {
    if (ref) context.thumbs.add(ref);
    context.state.setThumbEditable(local.index, !context.isDisabled());
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
      // aria-valuetext={context.state.getThumbValueLabel(local.index)}
      aria-valuemin={context.minValue}
      aria-valuenow={value()}
      aria-valuemax={context.maxValue}
      aria-orientation={context.orientation}
      {...context.dataset()}
      tabIndex={context.isDisabled() ? undefined : 0}
      onFocus={composeEventHandlers([
        props.onFocus,
        () => {
          context.state.setFocusedThumb(props.index);
        },
      ])}
      style={{
        display: value() === undefined ? "none" : undefined,
        position: "absolute",
        [context.startEdge]: `${position() * 100}%`,
        transform: "translate(-50%, -50%)",
        "touch-action": "none",
        ...local.style,
      }}
      {...others}
    />
  );
}
