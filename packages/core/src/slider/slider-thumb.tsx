import {
  composeEventHandlers,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import {
  createEffect,
  createMemo,
  createSignal,
  JSX,
  onCleanup,
  onMount,
  splitProps,
} from "solid-js";

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

  const [startPosition, setStartPosition] = createSignal(0);

  const isVertical = () => context.orientation === "vertical";
  const value = () => context.state.values()[local.index];
  const position = () => {
    return context.state.getThumbPercent(local.index);
  };
  const isFocused = () =>
    context.state.focusedThumb() && context.state.focusedThumb() === local.index;

  const onPointerDown = (e: PointerEvent) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    context.state.setThumbDragging(local.index, true);
    target.setPointerCapture(e.pointerId);
    const clickPosition = isVertical() ? e.clientY : e.clientX;
    setStartPosition(clickPosition);
  };

  let currentPosition: number | null = null;
  const onPointerMove = (e: PointerEvent) => {
    // if (!isFocused()) return;

    const target = e.currentTarget as HTMLElement;

    if (target.hasPointerCapture(e.pointerId)) {
      if (currentPosition === null) {
        currentPosition = value();
      }
      const clickPosition = isVertical() ? e.clientY : e.clientX;
      const delta = clickPosition - startPosition();
      console.log(currentPosition + delta);
      context.state.setThumbValue(local.index, (currentPosition += delta));
    }
  };
  const onPointerUp = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
      context.state.setThumbDragging(local.index, false);
      currentPosition = null;
    }
  };
  onMount(() => {
    context.state.setThumbEditable(local.index, !context.isDisabled());
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
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
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
