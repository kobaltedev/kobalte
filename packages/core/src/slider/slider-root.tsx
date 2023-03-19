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
    value: () => local.value,
    isDisabled: () => props.isDisabled!,
    maxValue: () => local.maxValue!,
    minValue: () => local.minValue!,
    onChange: local.onChange,
    onChangeEnd: local.onChangeEnd,
    orientation: () => local.orientation!,
    step: () => local.step!,
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
    onSlideStart: local.onSlideStart,
    onSlideMove: local.onSlideMove,
    onSlideEnd: local.onSlideEnd,
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
        {...dataset()}
        {...others}
      />
    </SliderContext.Provider>
  );
}
