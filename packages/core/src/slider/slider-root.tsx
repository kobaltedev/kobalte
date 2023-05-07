/* eslint-disable solid/reactivity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/slider/src/Slider.tsx
 */

import { clamp, createGenerateId, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";

import { createNumberFormatter, useLocale } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { CollectionItemWithRef, createRegisterId } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { createSliderState } from "../primitives/create-slider-state/create-slider-state";
import { SliderContext, SliderContextValue, SliderDataSet } from "./slider-context";
import { getClosestValueIndex, getNextSortedValues, hasMinStepsBetweenValues } from "./utils";

export interface GetValueLabelParams {
  values: number[];
  min: number;
  max: number;
}

export interface SliderRootOptions extends AsChildProp {
  /** The slider values. */
  value?: number[];

  /** The value of the slider when initially rendered. */
  defaultValue?: number[];

  /** Called when the value changes. */
  onChange?: (value: number[]) => void;

  /** Called when the value changes at the end of an interaction. */
  onChangeEnd?: (value: number[]) => void;

  /**
   * Whether the slider is visually inverted.
   * @default false
   */
  inverted?: boolean;

  /**
   * The minimum slider value.
   * @default 0
   */
  minValue?: number;

  /**
   * The maximum slider value.
   * @default 100
   */
  maxValue?: number;

  /**
   * The step amount.
   * @default 1
   */
  step?: number;

  /**
   * The minimum permitted steps between multiple thumbs.
   * @default 0
   */
  minStepsBetweenThumbs?: number;

  /**
   * A function to get the accessible label text representing the current value in a human-readable format.
   * If not provided, the value label will be read as a percentage of the max value.
   */
  getValueLabel?: (params: GetValueLabelParams) => string;

  /**
   * The orientation of the slider.
   * @default horizontal
   */
  orientation?: "horizontal" | "vertical";

  name?: string;

  /** Whether the slider is disabled. */
  disabled?: boolean;
}

export interface SliderRootProps extends OverrideComponentProps<"div", SliderRootOptions> {}

export function SliderRoot(props: SliderRootProps) {
  const defaultId = `slider-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      minValue: 0,
      maxValue: 100,
      step: 1,
      orientation: "horizontal",
      disabled: false,
      inverted: false,
      minStepsBetweenThumbs: 0,
      defaultValue: [props.minValue ?? 0],
    },
    props
  );

  const [local, others] = splitProps(props, [
    "value",
    "defaultValue",
    "onChange",
    "onChangeEnd",
    "inverted",
    "minValue",
    "maxValue",
    "step",
    "minStepsBetweenThumbs",
    "getValueLabel",
    "orientation",
    "name",
    "disabled",
  ]);

  const [labelId, setLabelId] = createSignal<string>();
  const defaultFormatter = createNumberFormatter(() => ({ style: "decimal" }));
  const { direction } = useLocale();

  const state = createSliderState({
    defaultValue: local.defaultValue!,
    numberFormatter: defaultFormatter(),
    value: () => local.value,
    isDisabled: () => props.disabled!,
    maxValue: () => local.maxValue!,
    minValue: () => local.minValue!,
    minStepsBetweenThumbs: () => local.minStepsBetweenThumbs!,
    onChange: local.onChange,
    onChangeEnd: local.onChangeEnd,
    orientation: () => local.orientation!,
    step: () => local.step!,
  });

  const [thumbs, setThumbs] = createSignal<CollectionItemWithRef[]>([]);
  const { DomCollectionProvider } = createDomCollection({
    items: thumbs,
    onItemsChange: setThumbs,
  });

  const isDirectionLTR = () => direction() === "ltr";

  const isSlidingFromLeft = () => {
    return (isDirectionLTR() && !local.inverted!) || (!isDirectionLTR() && local.inverted!);
  };
  const isSlidingFromBottom = () => !local.inverted!;

  const isVertical = () => state.orientation() === "vertical";

  const dataset: Accessor<SliderDataSet> = createMemo(() => {
    return {
      "data-disabled": (local.disabled ? "" : undefined) as SliderDataSet["data-disabled"],
      "data-orientation": local.orientation,
    };
  });

  const [trackRef, setTrackRef] = createSignal<HTMLElement>();

  let currentPosition: number | null = null;
  const onSlideStart = (value: number) => {
    const closestIndex = getClosestValueIndex(state.values(), value);
    if (closestIndex >= 0) {
      state.setFocusedThumb(closestIndex);
      state.setThumbDragging(closestIndex, true);
      state.setThumbValue(closestIndex, value);
      currentPosition = null;
    }
  };

  const onSlideMove = ({ deltaX, deltaY }: { deltaX: number; deltaY: number }) => {
    const active = state.focusedThumb();
    if (active === undefined) return;
    const { width, height } = trackRef()!.getBoundingClientRect();
    const size = isVertical() ? height : width;

    if (currentPosition === null) {
      currentPosition = state.getThumbPercent(state.focusedThumb()!) * size;
    }
    let delta = isVertical() ? deltaY : deltaX;
    if ((!isVertical() && local.inverted!) || (isVertical() && isSlidingFromBottom())) {
      delta = -delta;
    }
    currentPosition += delta;
    const percent = clamp(currentPosition / size, 0, 1);
    const nextValues = getNextSortedValues(state.values(), currentPosition, active);
    if (hasMinStepsBetweenValues(nextValues, local.minStepsBetweenThumbs! * state.step())) {
      state.setThumbPercent(state.focusedThumb()!, percent);
      local.onChange?.(state.values());
    }
  };

  const onSlideEnd = () => {
    const activeThumb = state.focusedThumb();
    if (activeThumb !== undefined) {
      state.setThumbDragging(activeThumb, false);
      local.onChangeEnd?.(state.values());
    }
  };

  const onHomeKeyDown = () => {
    !local.disabled &&
      state.focusedThumb() !== undefined &&
      state.setThumbValue(0, state.getThumbMinValue(0));
  };

  const onEndKeyDown = () => {
    !local.disabled &&
      state.focusedThumb() !== undefined &&
      state.setThumbValue(
        state.values().length - 1,
        state.getThumbMaxValue(state.values().length - 1)
      );
  };

  const onStepKeyDown = (event: KeyboardEvent, index: number) => {
    if (!local.disabled) {
      switch (event.key) {
        case "Left":
        case "ArrowLeft":
          event.preventDefault();
          event.stopPropagation();
          if (!isDirectionLTR()) {
            state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          } else {
            state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          }
          break;
        case "Right":
        case "ArrowRight":
          event.preventDefault();
          event.stopPropagation();
          if (!isDirectionLTR()) {
            state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          } else {
            state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          }
          break;
        case "Up":
        case "ArrowUp":
          event.preventDefault();
          event.stopPropagation();
          if (!isDirectionLTR()) {
            state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          } else {
            state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          }
          break;
        case "Down":
        case "ArrowDown":
          event.preventDefault();
          event.stopPropagation();
          if (!isDirectionLTR()) {
            state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          } else {
            state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          }
          break;
        case "Home":
          onHomeKeyDown();
          break;
        case "End":
          onEndKeyDown();
          break;
        case "PageUp":
          state.incrementThumb(index, state.pageSize());
          break;
        case "PageDown":
          state.decrementThumb(index, state.pageSize());
          break;
      }
    }
  };

  const startEdge = createMemo(() => {
    if (isVertical()) {
      return isSlidingFromBottom() ? "bottom" : "top";
    }

    return isSlidingFromLeft() ? "left" : "right";
  });

  const endEdge = createMemo(() => {
    if (isVertical()) {
      return isSlidingFromBottom() ? "top" : "bottom";
    }

    return isSlidingFromLeft() ? "right" : "left";
  });

  const context: SliderContextValue = {
    dataset,
    state,
    labelId,
    thumbs,
    setThumbs,
    onSlideStart,
    onSlideMove,
    onSlideEnd,
    onStepKeyDown,
    isSlidingFromLeft,
    isSlidingFromBottom,
    trackRef,
    minValue: () => local.minValue!,
    maxValue: () => local.maxValue!,
    inverted: () => local.inverted!,
    startEdge,
    endEdge,
    registerTrack: (ref: HTMLElement) => setTrackRef(ref),
    generateId: createGenerateId(() => others.id!),
    registerLabelId: createRegisterId(setLabelId),
    getValueLabel: local.getValueLabel,
  };

  return (
    <DomCollectionProvider>
      <SliderContext.Provider value={context}>
        <Polymorphic
          as="div"
          role="group"
          aria-label={props["aria-label"]}
          aria-labelledby={labelId()}
          {...dataset()}
          {...others}
        />
      </SliderContext.Provider>
    </DomCollectionProvider>
  );
}
