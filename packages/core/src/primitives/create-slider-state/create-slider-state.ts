/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/1ddcde7b4fef9af7f08e11bb78d71fe60bbcc64b/packages/@react-aria/progress/src/useProgressBar.ts
 */

import { clamp, mergeDefaultProps, snapValueToStep } from "@kobalte/utils";
import { Accessor, createEffect, createMemo, createSignal } from "solid-js";

import { createControllableArraySignal } from "../create-controllable-signal";

export interface SliderState {
  readonly values: Accessor<number[]>;

  getThumbValue(index: number): number;

  setThumbValue(index: number, value: number): void;

  getThumbPercent(index: number): number;

  setThumbPercent(index: number, percent: number): void;

  isThumbDragging(index: number): boolean;

  setThumbDragging(index: number, dragging: boolean): void;

  readonly focusedThumb: Accessor<number | undefined>;

  setFocusedThumb(index: number | undefined): void;

  getValuePercent(value: number): number;

  getThumbValueLabel(index: number): string;

  getFormattedValue(value: number): string;

  getThumbMinValue(index: number): number;

  getThumbMaxValue(index: number): number;

  getPercentValue(percent: number): number;

  isThumbEditable(index: number): boolean;

  setThumbEditable(index: number, editable: boolean): void;

  incrementThumb(index: number, stepSize?: number): void;

  decrementThumb(index: number, stepSize?: number): void;

  readonly step: number;

  readonly pageSize: Accessor<number>;

  readonly orientation: "horizontal" | "vertical";

  readonly isDisabled: boolean;

  setValues: (next: number[] | ((prev: number[]) => number[])) => void;
}

interface StateOpts {
  defaultValue: number[];
  value: number[] | undefined;
  orientation?: "horizontal" | "vertical";
  isDisabled?: boolean;
  onChangeEnd?: (value: number[]) => void;
  onChange?: (value: number[]) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  numberFormatter: Intl.NumberFormat;
}

export function createSliderState(props: StateOpts): SliderState {
  props = mergeDefaultProps(
    {
      isDisabled: false,
      maxValue: 100,
      minValue: 0,
      step: 1,
      orientation: "horizontal",
    },
    props
  );

  const pageSize = createMemo(() => {
    let calcPageSize = (props.maxValue! - props.minValue!) / 10;
    calcPageSize = snapValueToStep(calcPageSize, 0, calcPageSize + props.step!, props.step!);
    return Math.max(calcPageSize, props.step!);
  });

  const value = createMemo(() => (props.value ? convertValue(props.value) : undefined));
  const defaultValue = createMemo(() => convertValue(props.defaultValue) ?? [props.minValue!]);
  const onChange = createOnChange(value() ?? [], props.defaultValue, props.onChange);
  const onChangeEnd = createOnChange(value() ?? [], props.defaultValue, props.onChangeEnd);

  const [values, setValues] = createControllableArraySignal<number>({
    value,
    defaultValue,
    onChange: value => {
      props.onChange?.(value);
    },
  });

  createEffect(() => {
    console.log(values());
  });

  const [isDragging, setIsDragging] = createSignal(new Array(values().length).fill(false));
  const [isEditables, setEditables] = createSignal(new Array(values().length).fill(false));
  const [focusedIndex, setFocusedIndex] = createSignal<number | undefined>(undefined);

  const getValuePercent = (value: number) => {
    return (value - props.minValue!) / (props.maxValue! - props.minValue!);
  };

  const getThumbMinValue = (index: number) => {
    return index === 0 ? props.minValue! : values()[index - 1];
  };

  const getThumbMaxValue = (index: number) => {
    return index === values().length - 1 ? props.maxValue! : values()[index + 1];
  };

  const isThumbEditable = (index: number) => {
    return isEditables()[index];
  };

  const setThumbEditable = (index: number) => {
    setEditables(p => {
      p[index] = true;
      return p;
    });
  };

  const updateValue = (index: number, value: number) => {
    if (props.isDisabled || !isThumbEditable(index)) return;

    const thumbMin = getThumbMinValue(index);
    const thumbMax = getThumbMaxValue(index);

    value = snapValueToStep(value, thumbMin, thumbMax, props.step!);

    setValues(p => replaceIndex(p, index, value));
  };

  const updateDragging = (index: number, dragging: boolean) => {
    if (props.isDisabled || !isThumbEditable(index)) return;

    const wasDragging = isDragging()[index];
    setIsDragging(p => replaceIndex(p, index, dragging));

    if (wasDragging && !isDragging().some(Boolean)) {
      onChangeEnd(values());
    }
  };

  const getFormattedValue = (value: number) => {
    return props.numberFormatter.format(value);
  };

  const setThumbPercent = (index: number, percent: number) => {
    updateValue(index, getPercentValue(percent));
  };

  const getRoundedValue = (value: number) => {
    return Math.round((value - props.minValue!) / props.step!) * props.step! + props.minValue!;
  };

  const getPercentValue = (percent: number) => {
    const val = percent * (props.maxValue! - props.minValue!) + props.minValue!;
    return clamp(getRoundedValue(val), props.minValue!, props.maxValue!);
  };

  const incrementThumb = (index: number, stepSize = 1) => {
    const s = Math.max(stepSize, props.step!);
    updateValue(
      index,
      snapValueToStep(values()[index] + s, props.minValue!, props.maxValue!, props.step!)
    );
  };

  const decrementThumb = (index: number, stepSize = 1) => {
    const s = Math.max(stepSize, props.step!);
    updateValue(
      index,
      snapValueToStep(values()[index] - s, props.minValue!, props.maxValue!, props.step!)
    );
  };

  return {
    values,
    getThumbValue: index => values()[index],
    setThumbValue: updateValue,
    setThumbPercent,
    isThumbDragging: index => isDragging()[index],
    setThumbDragging: updateDragging,
    focusedThumb: focusedIndex,
    setFocusedThumb: setFocusedIndex,
    getThumbPercent: index => getValuePercent(values()[index]),
    getValuePercent,
    getThumbValueLabel: index => getFormattedValue(values()[index]),
    getFormattedValue,
    getThumbMinValue,
    getThumbMaxValue,
    getPercentValue,
    isThumbEditable,
    setThumbEditable,
    incrementThumb,
    decrementThumb,
    step: props.step!,
    pageSize,
    orientation: props.orientation!,
    isDisabled: props.isDisabled!,
    setValues,
  };
}

function replaceIndex<T>(array: T[], index: number, value: T) {
  if (array[index] === value) {
    return array;
  }

  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

function convertValue(value: number | number[]) {
  if (value == null) {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
}

function createOnChange(
  value: number[],
  defaultValue: number[],
  onChange: ((value: number[]) => void) | undefined
) {
  return (newValue: number[]) => {
    if (typeof value === "number" || typeof defaultValue === "number") {
      onChange?.(newValue);
    } else {
      onChange?.(newValue);
    }
  };
}
