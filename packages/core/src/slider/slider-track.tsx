import { composeEventHandlers, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createSignal } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";
import { linearScale } from "./utils";

export interface SliderTrackProps extends OverrideComponentProps<"div", AsChildProp> {}

/**

 * The component that visually represents the slider track.

 * Act as a container for `Slider.Fill`.

 */

export function SliderTrack(props: SliderTrackProps) {
  const context = useSliderContext();

  const [sRect, setRect] = createSignal<DOMRect>();
  function getValueFromPointer(pointerPosition: number) {
    const rect = sRect() || context.trackRef()!.getBoundingClientRect();
    const input: [number, number] = [0, rect.width];
    const output: [number, number] =
      context.isSlidingFromBottom() || context.isSlidingFromLeft()
        ? [context.minValue()!, context.maxValue()!]
        : [context.maxValue!(), context.minValue()!];
    const value = linearScale(input, output);

    setRect(rect);
    return value(pointerPosition - rect.left);
  }

  let startPosition = 0;
  const onDownTrack = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);

    e.preventDefault();
    const value = getValueFromPointer(
      context.state.orientation() === "horizontal" ? e.clientX : e.clientY
    );
    startPosition = context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    context.onSlideStart?.(value);
  };

  const onPointerMove = (e: PointerEvent) => {
    const target = e.target as HTMLElement;

    if (target.hasPointerCapture(e.pointerId)) {
      context.onSlideMove?.({
        deltaX: e.clientX - startPosition,
        deltaY: e.clientY - startPosition,
      });
      startPosition = context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    }
  };
  const onPointerUp = (e: PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
      setRect(undefined);
      context.onSlideEnd?.();
    }
  };
  return (
    <Polymorphic
      ref={mergeRefs(context.registerTrack, props.ref)}
      fallback="div"
      onPointerDown={composeEventHandlers([props.onPointerDown, onDownTrack])}
      onPointerMove={composeEventHandlers([props.onPointerMove, onPointerMove])}
      onPointerUp={composeEventHandlers([props.onPointerUp, onPointerUp])}
      {...context.dataset()}
      {...props}
    />
  );
}
