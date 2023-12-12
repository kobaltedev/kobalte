import { callHandler, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createSignal, JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";
import { getClosestValueIndex, linearScale } from "./utils";

export interface SliderTrackProps extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The component that visually represents the slider track.
 * Act as a container for `Slider.Fill`.
 */
export function SliderTrack(props: SliderTrackProps) {
  const context = useSliderContext();

  const [local, others] = splitProps(props, ["onPointerDown", "onPointerMove", "onPointerUp"]);

  const [sRect, setRect] = createSignal<DOMRect>();

  function getValueFromPointer(pointerPosition: number) {
    const rect = sRect() || context.trackRef()!.getBoundingClientRect();

    const input: [number, number] = [
      0,
      context.state.orientation() === "vertical" ? rect.height : rect.width,
    ];

    let output: [number, number] = context.isSlidingFromLeft()
      ? [context.minValue()!, context.maxValue()!]
      : [context.maxValue!(), context.minValue()!];

    if (context.state.orientation() === "vertical") {
      output = context.isSlidingFromBottom()
        ? [context.maxValue!(), context.minValue()!]
        : [context.minValue()!, context.maxValue()!];
    }

    const value = linearScale(input, output);

    setRect(rect);

    return value(
      pointerPosition - (context.state.orientation() === "vertical" ? rect.top : rect.left),
    );
  }

  let startPosition = 0;

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);

    e.preventDefault();
    const value = getValueFromPointer(
      context.state.orientation() === "horizontal" ? e.clientX : e.clientY,
    );
    startPosition = context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    const closestIndex = getClosestValueIndex(context.state.values(), value);
    context.onSlideStart?.(closestIndex, value);
  };

  const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerMove);

    const target = e.target as HTMLElement;

    if (target.hasPointerCapture(e.pointerId)) {
      context.onSlideMove?.({
        deltaX: e.clientX - startPosition,
        deltaY: e.clientY - startPosition,
      });
      startPosition = context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    }
  };

  const onPointerUp: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerUp);

    const target = e.target as HTMLElement;

    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
      setRect(undefined);
      context.onSlideEnd?.();
    }
  };

  return (
    <Polymorphic
      as="div"
      ref={mergeRefs(context.registerTrack, props.ref)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      {...context.dataset()}
      {...others}
    />
  );
}
