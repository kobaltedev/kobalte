/* eslint-disable solid/reactivity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-aria/progress/src/useProgressBar.ts
 */

import {
  clamp,
  composeEventHandlers,
  createGenerateId,
  mergeDefaultProps,
  OverrideComponentProps,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";

import { createNumberFormatter } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { createRegisterId } from "../primitives";
import { createSliderState } from "../primitives/create-slider-state/create-slider-state";
import { Side, SliderContext, SliderContextValue, SliderDataSet } from "./slider-context";
import {
  getClosestValueIndex,
  getDecimalCount,
  getNextSortedValues,
  hasMinStepsBetweenValues,
  linearScale,
  roundValue,
} from "./utils";

type Direction = "ltr" | "rtl";

const PAGE_KEYS = ["PageUp", "PageDown"];
const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

type SlideDirection = "from-left" | "from-right" | "from-bottom" | "from-top";
const BACK_KEYS: Record<SlideDirection, string[]> = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"],
};
export interface GetValueLabelParams {
  values: number[];
  min: number;
  max: number;
}

export interface SliderRootOptions extends AsChildProp {
  name?: string;
  minStepsBetweenThumbs?: number;
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  onChangeEnd?: (value: number[]) => void;
  onSlideStart?: (value: number) => void;
  onSlideMove?: (value: number) => void;
  onSlideEnd?: () => void;
  inverted?: boolean;
  /**
   * The slider value.
   * @default 0
   */
  value?: number[];

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

  /** Whether the slider is in an indeterminate state. */
  isIndeterminate?: boolean;

  /**
   * A function to get the accessible label text representing the current value in a human-readable format.
   * If not provided, the value label will be read as a percentage of the max value.
   */
  getValueLabel?: (params: GetValueLabelParams) => string;
  orientation?: "horizontal" | "vertical";
  isDisabled?: boolean;
}

export interface SliderRootProps extends OverrideComponentProps<"div", SliderRootOptions> {}

/**
 * Progress show either determinate or indeterminate progress of an operation over time.
 */
export function SliderRoot(props: SliderRootProps) {
  const defaultId = `slider-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      minValue: 0,
      maxValue: 100,
      step: 1,
      orientation: "horizontal",
      isDisabled: false,
      inverted: false,
      minStepsBetweenThumbs: 0,
      defaultValue: [props.minValue ?? 0],
    },
    props
  );

  const [local, others] = splitProps(props, [
    "value",
    "minValue",
    "maxValue",
    "isIndeterminate",
    "getValueLabel",
    "onChangeEnd",
    "onChange",
    "onSlideStart",
    "onSlideMove",
    "onSlideEnd",
    "defaultValue",
    "name",
    "inverted",
    "minStepsBetweenThumbs",
    "step",
    "orientation",
    "isDisabled",
  ]);

  let slider: HTMLDivElement | undefined;
  const [sRect, setRect] = createSignal<DOMRect>();

  const [labelId, setLabelId] = createSignal<string>();
  const defaultFormatter = createNumberFormatter(() => ({ style: "percent" }));

  const state = createSliderState({
    defaultValue: local.defaultValue!,
    numberFormatter: defaultFormatter(),
    value: local.value,
    isDisabled: props.isDisabled,
    maxValue: local.maxValue!,
    minValue: local.minValue!,
    onChange: local.onChange,
    onChangeEnd: local.onChangeEnd,
    orientation: local.orientation!,
    step: local.step!,
  });

  const thumbs = new Set<HTMLElement>([]);

  const isSlidingFromLeft = () => !local.inverted;
  const isSlidingFromBottom = () => !local.inverted;

  const dataset: Accessor<SliderDataSet> = createMemo(() => {
    return {
      "data-disabled": (local.isDisabled ? "" : undefined) as SliderDataSet["data-disabled"],
      "data-orientation": local.orientation,
    };
  });

  const beforeStart = state.values();

  const onSlideStart = (value: number) => {
    const closestIndex = getClosestValueIndex(state.values(), value);
    updateValues(value, closestIndex);
    local.onSlideStart?.(value);
  };

  const onSlideMove = (value: number) => {
    updateValues(value, state.focusedThumb()!);
    local.onSlideMove?.(value);
  };

  const onSlideEnd = () => {
    const prevValue = beforeStart[state.focusedThumb()!];
    const nextValue = state.values()[state.focusedThumb()!];
    const hasChanged = prevValue !== nextValue;
    if (hasChanged) local.onChangeEnd?.(state.values());
    local.onSlideEnd?.();
  };

  const onHomeKeyDown = () => {
    !local.isDisabled && updateValues(local.minValue!, 0, { commit: true });
  };

  const onEndKeyDown = () => {
    !local.isDisabled && updateValues(local.maxValue!, state.values().length - 1, { commit: true });
  };

  const onStepKeyDown = ({
    event,
    direction: stepDirection,
  }: {
    event: KeyboardEvent;
    direction: number;
  }) => {
    if (!local.isDisabled) {
      const isPageKey = PAGE_KEYS.includes(event.key);
      const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key));
      const multiplier = isSkipKey ? 10 : 1;
      const atIndex = state.focusedThumb() ?? 0;
      const value = state.values()[atIndex];
      const stepInDirection = local.step! * multiplier * stepDirection;
      updateValues(value + stepInDirection, atIndex, { commit: true });
    }
  };

  function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
    const decimalCount = getDecimalCount(local.step!);
    const snapToStep = roundValue(
      Math.round((value - local.minValue!) / local.step!) * local.step! + local.minValue!,
      decimalCount
    );
    const nextValue = clamp(snapToStep, local.minValue!, local.maxValue!);

    state.setValues((prevValues = []) => {
      const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
      if (hasMinStepsBetweenValues(nextValues, local.minStepsBetweenThumbs! * local.step!)) {
        state.setFocusedThumb(nextValues.indexOf(nextValue));
        const hasChanged = String(nextValues) !== String(prevValues);
        if (hasChanged && commit) local.onChangeEnd?.(nextValues);
        return hasChanged ? nextValues : prevValues;
      } else {
        return prevValues;
      }
    });
  }

  function getValueFromPointer(pointerPosition: number) {
    const rect = sRect() || slider!.getBoundingClientRect();
    const input: [number, number] = [0, rect.width];
    const output: [number, number] =
      isSlidingFromBottom() || isSlidingFromLeft()
        ? [context.minValue, context.maxValue]
        : [context.maxValue, context.minValue];
    const value = linearScale(input, output);

    setRect(rect);
    return value(pointerPosition - rect.left);
  }

  const startEdge = () => {
    const isVertical = local.orientation === "vertical";
    const direction: [Side, Side] = isVertical ? ["top", "bottom"] : ["right", "left"];

    return isVertical ? direction[+isSlidingFromBottom()] : direction[+isSlidingFromLeft()];
  };

  const endEdge = () => {
    const isVertical = local.orientation === "vertical";
    const direction: [Side, Side] = isVertical ? ["bottom", "top"] : ["left", "right"];

    return isVertical ? direction[+isSlidingFromBottom()] : direction[+isSlidingFromLeft()];
  };

  const context: SliderContextValue = {
    dataset,
    state,
    isDisabled: () => local.isDisabled!,
    labelId,
    thumbs,
    onSlideStart,
    onSlideMove,
    onSlideEnd,
    minValue: local.minValue!,
    maxValue: local.maxValue!,
    step: local.step!,
    inverted: local.inverted!,
    startEdge: startEdge(),
    endEdge: endEdge(),
    generateId: createGenerateId(() => others.id!),
    registerLabelId: createRegisterId(setLabelId),
    orientation: "horizontal",
    getValueLabel: local.getValueLabel,
  };

  return (
    <SliderContext.Provider value={context}>
      <Polymorphic
        ref={slider}
        fallback="div"
        role="group"
        aria-label={props["aria-label"]}
        aria-labelledby={labelId()}
        onKeyDown={composeEventHandlers<HTMLDivElement>([
          props.onKeyDown,
          event => {
            if (event.key === "Home") {
              onHomeKeyDown();
              // Prevent scrolling to page start
              event.preventDefault();
            } else if (event.key === "End") {
              onEndKeyDown();
              // Prevent scrolling to page end
              event.preventDefault();
            } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
              const slideDirection =
                local.orientation === "horizontal"
                  ? isSlidingFromLeft()
                    ? "from-left"
                    : "from-right"
                  : isSlidingFromBottom()
                  ? "from-bottom"
                  : "from-top";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
              // Prevent scrolling for directional key presses
              event.preventDefault();
            }
          },
        ])}
        onPointerDown={composeEventHandlers<HTMLDivElement>([
          props.onPointerDown,
          e => {
            const target = e.target as HTMLElement;

            target.setPointerCapture(e.pointerId);

            e.preventDefault();
            if (context.thumbs.has(target)) {
              target.focus();
            } else {
              const value = getValueFromPointer(
                context.orientation === "horizontal" ? e.clientX : e.clientY
              );
              onSlideStart(value);
            }
          },
        ])}
        onPointerMove={composeEventHandlers<HTMLDivElement>([
          props.onPointerMove,
          e => {
            const target = e.target as HTMLElement;
            const value = getValueFromPointer(
              context.orientation === "horizontal" ? e.clientX : e.clientY
            );
            if (target.hasPointerCapture(e.pointerId)) onSlideMove(value);
          },
        ])}
        onPointerUp={composeEventHandlers<HTMLDivElement>([
          props.onPointerUp,
          e => {
            const target = e.target as HTMLElement;
            if (target.hasPointerCapture(e.pointerId)) {
              target.releasePointerCapture(e.pointerId);
              setRect(undefined);
              onSlideEnd();
            }
          },
        ])}
        {...dataset()}
        {...others}
      />
    </SliderContext.Provider>
  );
}
