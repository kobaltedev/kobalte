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
import { SliderContext, SliderContextValue, SliderDataSet } from "./slider-context";

interface GetValueLabelParams {
  value: number[];
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
  disabled?: boolean;
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
      disabled: false,
      inverted: true,
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
  ]);

  const [labelId, setLabelId] = createSignal<string>();
  const defaultFormatter = createNumberFormatter(() => ({ style: "percent" }));
  const state = createSliderState({
    defaultValue: props.defaultValue!,
    numberFormatter: defaultFormatter(),
    value: props.value,
    isDisabled: props.disabled,
    maxValue: props.maxValue!,
    minValue: props.minValue!,
    onChange: props.onChange,
    onChangeEnd: props.onChangeEnd,
    orientation: props.orientation!,
    step: props.step!,
  });
  const thumbs = new Set<HTMLElement>([]);
  const sliderFillWidth = () => {
    return local.isIndeterminate ? undefined : `${Math.round(1 * 100)}%`;
  };

  const dataset: Accessor<SliderDataSet> = createMemo(() => {
    const dataProgress: SliderDataSet["data-progress"] = undefined;

    if (!local.isIndeterminate) {
      // dataProgress = true ? "complete" : "loading";
    }

    return {
      "data-progress": dataProgress,
      "data-indeterminate": local.isIndeterminate ? "" : undefined,
    };
  });

  const beforeStart = state.values();
  const onSlideStart = (value: number) => {
    const closestIndex = getClosestValueIndex(state.values(), value);
    updateValues(value, closestIndex);
  };
  const onSlideMove = (value: number) => {
    updateValues(value, state.focusedThumb()!);
  };
  const onSlideEnd = () => {
    const prevValue = beforeStart[state.focusedThumb()!];
    const nextValue = state.values()[state.focusedThumb()!];
    const hasChanged = prevValue !== nextValue;
    if (hasChanged) props.onChangeEnd?.(state.values());
  };

  function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
    const decimalCount = getDecimalCount(local.step!);
    const snapToStep = roundValue(
      Math.round((value - local.minValue!) / local.step!) * local.step! + local.minValue!,
      decimalCount
    );
    const nextValue = clamp(snapToStep, local.minValue!, local.maxValue!);

    context.state.setValues((prevValues = []) => {
      const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
      if (hasMinStepsBetweenValues(nextValues, local.minStepsBetweenThumbs! * local.step!)) {
        state.setFocusedThumb(nextValues.indexOf(nextValue));
        state.setThumbPercent(
          atIndex,
          convertValueToPercentage(nextValue, local.minValue!, local.maxValue!)
        );
        const hasChanged = String(nextValues) !== String(prevValues);
        if (hasChanged && commit) local.onChangeEnd?.(nextValues);
        return hasChanged ? nextValues : prevValues;
      } else {
        return prevValues;
      }
    });
  }
  let slider: HTMLDivElement | undefined;
  const [sRect, setRect] = createSignal<DOMRect>();
  function getValueFromPointer(pointerPosition: number) {
    const rect = sRect() || slider!.getBoundingClientRect();
    const input: [number, number] = [0, rect.width];
    const output: [number, number] = context.inverted
      ? [context.minValue, context.maxValue]
      : [context.maxValue, context.minValue];
    const value = linearScale(input, output);

    setRect(rect);
    return value(pointerPosition - rect.left);
  }

  const context: SliderContextValue = {
    dataset,
    state,
    labelId,
    sliderFillWidth,
    thumbs,
    onSlideStart,
    onSlideMove,
    onSlideEnd,
    minValue: props.minValue!,
    maxValue: props.maxValue!,
    inverted: props.inverted!,
    generateId: createGenerateId(() => others.id!),
    registerLabelId: createRegisterId(setLabelId),
    orientation: "horizontal",
  };

  return (
    <SliderContext.Provider value={context}>
      <Polymorphic
        ref={slider}
        fallback="div"
        role="group"
        aria-label={props["aria-label"]}
        aria-labelledby={labelId()}
        onPointerDown={composeEventHandlers<HTMLDivElement>([
          props.onPointerDown,
          e => {
            const target = e.target as HTMLElement;

            target.setPointerCapture(e.pointerId);

            e.preventDefault();
            if (context.thumbs.has(target)) {
              console.log("ON thumb");
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

function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  return percentPerStep * (value - min);
}

function getNextSortedValues(prevValues: number[] = [], nextValue: number, atIndex: number) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}

/**
 * Given a `values` array and a `nextValue`, determine which value in
 * the array is closest to `nextValue` and return its index.
 *
 * @example
 * // returns 1
 * getClosestValueIndex([10, 30], 25);
 */
function getClosestValueIndex(values: number[], nextValue: number) {
  if (values.length === 1) return 0;
  const distances = values.map(value => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}

/**
 * Gets an array of steps between each value.
 *
 * @example
 * // returns [1, 9]
 * getStepsBetweenValues([10, 11, 20]);
 */
function getStepsBetweenValues(values: number[]) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}

/**
 * Verifies the minimum steps between all values is greater than or equal
 * to the expected minimum steps.
 *
 * @example
 * // returns false
 * hasMinStepsBetweenValues([1,2,3], 2);
 *
 * @example
 * // returns true
 * hasMinStepsBetweenValues([1,2,3], 1);
 */
function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}

function getDecimalCount(value: number) {
  return (String(value).split(".")[1] || "").length;
}

function roundValue(value: number, decimalCount: number) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
function linearScale(input: readonly [number, number], output: readonly [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
