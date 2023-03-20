import { clamp, createGlobalListeners, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createSignal } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useSliderContext } from "./slider-context";

export interface SliderTrackProps extends OverrideComponentProps<"div", AsChildProp> {}

/**

 * The component that visually represents the progress track.

 * Act as a container for `Progress.Fill`.

 */

export function SliderTrack(props: SliderTrackProps) {
  let trackRef!: HTMLDivElement;
  const context = useSliderContext();

  const [startPosition, setStartPosition] = createSignal(0);
  const [currentId, setCurrentId] = createSignal<number>();
  const { addGlobalListener, removeGlobalListener } = createGlobalListeners();
  const isVertical = () => context.orientation === "vertical";

  let currentPosition: number | null = null;
  const onDownTrack = (e: Event, id: number | undefined, clientX: number, clientY: number) => {
    const track = trackRef;
    if (
      track &&
      !context.isDisabled() &&
      context.state.values().every((_, i) => !context.state.isThumbDragging(i))
    ) {
      const { height, width, top, left } = track.getBoundingClientRect();
      const size = isVertical() ? height : width;
      const trackPosition = isVertical() ? top : left;
      const clickPosition = isVertical() ? clientY : clientX;
      const offset = clickPosition - trackPosition;
      let percent = offset / size;
      if (isVertical()) {
        percent = 1 - percent;
      }
      const value = context.state.getPercentValue(percent);
      let closestThumb;
      const split = context.state.values().findIndex(v => value - v < 0);
      if (split === 0) {
        closestThumb = split;
      } else if (split === -1) {
        closestThumb = context.state.values().length - 1;
      } else {
        const lastLeft = context.state.values()[split - 1];
        const firstRight = context.state.values()[split];

        if (Math.abs(lastLeft - value) < Math.abs(firstRight - value)) {
          closestThumb = split - 1;
        } else {
          closestThumb = split;
        }
      }

      if (closestThumb >= 0 && context.state.isThumbEditable(closestThumb)) {
        e.preventDefault();

        context.state.setFocusedThumb(closestThumb);
        context.state.setThumbDragging(closestThumb, true);
        context.state.setThumbValue(closestThumb, value);
        setCurrentId(id);
        setStartPosition(clickPosition);
        currentPosition = null;
        addGlobalListener(window, "mouseup", onUpTrack, false);
        addGlobalListener(window, "pointerup", onUpTrack, false);
        addGlobalListener(window, "touchend", onUpTrack, false);
        addGlobalListener(window, "pointermove", onMove, false);
      }
    }
  };

  const onMove = (e: PointerEvent) => {
    const track = trackRef;
    const active = context.state.focusedThumb();
    if (track && active !== undefined) {
      const { height, width } = track.getBoundingClientRect();
      const size = isVertical() ? height : width;

      if (currentPosition === null) {
        currentPosition = context.state.getThumbPercent(active) * size;
      }
      let delta = isVertical() ? e.clientY - startPosition() : e.clientX - startPosition();

      if (isVertical()) {
        delta = -delta;
      }
      currentPosition += delta;
      const percent = clamp(currentPosition / size, 0, 1);
      context.state.setThumbPercent(active, percent);
      setStartPosition(isVertical() ? e.clientY : e.clientX);
    }
  };

  const onUpTrack = (e: PointerEvent | MouseEvent | TouchEvent) => {
    let id;
    if ("pointerId" in e) {
      id = e.pointerId;
    } else if ("changedTouches" in e) {
      id = e.changedTouches[0].identifier;
    }
    if (id === currentId()) {
      const active = context.state.focusedThumb();
      if (active !== undefined) {
        context.state.setThumbDragging(active, false);
        setCurrentId(undefined);
      }
      removeGlobalListener(window, "mouseup", onUpTrack, false);
      removeGlobalListener(window, "pointerup", onUpTrack, false);
      removeGlobalListener(window, "touchend", onUpTrack, false);
      removeGlobalListener(window, "pointermove", onMove, false);
    }
  };
  return (
    <Polymorphic
      ref={mergeRefs(el => (trackRef = el), props.ref)}
      fallback="div"
      onMouseDown={(e: MouseEvent) => {
        if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey) {
          return;
        }
        onDownTrack(e, undefined, e.clientX, e.clientY);
      }}
      onPointerDown={(e: PointerEvent) => {
        if (e.pointerType === "mouse" && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
          return;
        }
        onDownTrack(e, e.pointerId, e.clientX, e.clientY);
      }}
      onTouchStart={(e: TouchEvent) => {
        onDownTrack(
          e,
          e.changedTouches[0].identifier,
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY
        );
      }}
      {...context.dataset()}
      {...props}
    />
  );
}
