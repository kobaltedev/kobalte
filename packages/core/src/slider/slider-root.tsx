/* eslint-disable solid/reactivity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/slider/src/Slider.tsx
 */

import {
  access,
  clamp,
  createGenerateId,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
  ValidationState,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";

import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { createNumberFormatter, useLocale } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { CollectionItemWithRef, createFormResetListener } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { createSliderState } from "./create-slider-state";
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

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /**
   * The name of the slider, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string;

  /** Whether the slider should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must fill the slider before the owning form can be submitted. */
  required?: boolean;

  /** Whether the slider is disabled. */
  disabled?: boolean;

  /** Whether the slider is read only. */
  readOnly?: boolean;
}

export interface SliderRootProps extends OverrideComponentProps<"div", SliderRootOptions> {}

export function SliderRoot(props: SliderRootProps) {
  let ref: HTMLDivElement | undefined;

  const defaultId = `slider-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      minValue: 0,
      maxValue: 100,
      step: 1,
      minStepsBetweenThumbs: 0,
      orientation: "horizontal",
      disabled: false,
      inverted: false,
      getValueLabel: params => params.values.join(", "),
    },
    props,
  );

  const [local, formControlProps, others] = splitProps(
    props,
    [
      "ref",
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
    ],
    FORM_CONTROL_PROP_NAMES,
  );

  const { formControlContext } = createFormControl(formControlProps);

  const defaultFormatter = createNumberFormatter(() => ({ style: "decimal" }));
  const { direction } = useLocale();

  const state = createSliderState({
    value: () => local.value,
    defaultValue: () => local.defaultValue ?? [local.minValue!],
    maxValue: () => local.maxValue!,
    minValue: () => local.minValue!,
    minStepsBetweenThumbs: () => local.minStepsBetweenThumbs!,
    isDisabled: () => formControlContext.isDisabled() ?? false,
    orientation: () => local.orientation!,
    step: () => local.step!,
    numberFormatter: defaultFormatter(),
    onChange: local.onChange,
    onChangeEnd: local.onChangeEnd,
  });

  const [thumbs, setThumbs] = createSignal<CollectionItemWithRef[]>([]);
  const { DomCollectionProvider } = createDomCollection({
    items: thumbs,
    onItemsChange: setThumbs,
  });

  createFormResetListener(
    () => ref,
    () => state.resetValues(),
  );

  const isLTR = () => direction() === "ltr";

  const isSlidingFromLeft = () => {
    return (isLTR() && !local.inverted!) || (!isLTR() && local.inverted!);
  };
  const isSlidingFromBottom = () => !local.inverted!;

  const isVertical = () => state.orientation() === "vertical";

  const dataset: Accessor<SliderDataSet> = createMemo(() => {
    return {
      ...formControlContext.dataset(),
      "data-orientation": local.orientation,
    };
  });

  const [trackRef, setTrackRef] = createSignal<HTMLElement>();

  let currentPosition: number | null = null;
  const onSlideStart = (index: number, value: number) => {
    state.setFocusedThumb(index);
    state.setThumbDragging(index, true);
    state.setThumbValue(index, value);
    currentPosition = null;
  };

  const onSlideMove = ({ deltaX, deltaY }: { deltaX: number; deltaY: number }) => {
    const active = state.focusedThumb();

    if (active === undefined) {
      return;
    }

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
    !formControlContext.isDisabled() &&
      state.focusedThumb() !== undefined &&
      state.setThumbValue(0, state.getThumbMinValue(0));
  };

  const onEndKeyDown = () => {
    !formControlContext.isDisabled() &&
      state.focusedThumb() !== undefined &&
      state.setThumbValue(
        state.values().length - 1,
        state.getThumbMaxValue(state.values().length - 1),
      );
  };

  const onStepKeyDown = (event: KeyboardEvent, index: number) => {
    if (!formControlContext.isDisabled()) {
      switch (event.key) {
        case "Left":
        case "ArrowLeft":
          event.preventDefault();
          event.stopPropagation();
          if (!isLTR()) {
            state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          } else {
            state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          }
          break;
        case "Right":
        case "ArrowRight":
          event.preventDefault();
          event.stopPropagation();
          if (!isLTR()) {
            state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          } else {
            state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          }
          break;
        case "Up":
        case "ArrowUp":
          event.preventDefault();
          event.stopPropagation();
          if (!isLTR()) {
            state.decrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          } else {
            state.incrementThumb(index, event.shiftKey ? state.pageSize() : state.step());
          }
          break;
        case "Down":
        case "ArrowDown":
          event.preventDefault();
          event.stopPropagation();
          if (!isLTR()) {
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
    generateId: createGenerateId(() => access(formControlProps.id)!),
    getValueLabel: local.getValueLabel,
  };

  return (
    <DomCollectionProvider>
      <FormControlContext.Provider value={formControlContext}>
        <SliderContext.Provider value={context}>
          <Polymorphic
            as="div"
            ref={mergeRefs(el => (ref = el), local.ref)}
            role="group"
            id={access(formControlProps.id)}
            {...dataset()}
            {...others}
          />
        </SliderContext.Provider>
      </FormControlContext.Provider>
    </DomCollectionProvider>
  );
}
