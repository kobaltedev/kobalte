import { Accessor, createContext, Setter, useContext } from "solid-js";

import { CollectionItemWithRef } from "../primitives";
import { SliderState } from "../primitives/create-slider-state/create-slider-state";
import { GetValueLabelParams } from "./slider-root";

export interface SliderDataSet {
  "data-disabled": "" | undefined;
  "data-orientation": "vertical" | "horizontal" | undefined;
}

export type Side = "left" | "top" | "bottom" | "right";

export interface SliderContextValue {
  dataset: Accessor<SliderDataSet>;
  state: SliderState;
  labelId: Accessor<string | undefined>;
  thumbs: Accessor<CollectionItemWithRef[]>;
  setThumbs: Setter<CollectionItemWithRef[]>;
  onSlideStart: ((value: number) => void) | undefined;
  onSlideMove: ((deltas: { deltaX: number; deltaY: number }) => void) | undefined;
  onSlideEnd: (() => void) | undefined;
  onStepKeyDown: (event: KeyboardEvent, index: number) => void;
  isSlidingFromLeft: () => boolean;
  isSlidingFromBottom: () => boolean;
  trackRef: Accessor<HTMLElement | undefined>;
  startEdge: Side;
  endEdge: Side;
  minValue: Accessor<number>;
  maxValue: Accessor<number>;
  inverted: boolean;
  registerTrack: (ref: HTMLElement) => void;
  generateId: (part: string) => string;
  registerLabelId: (id: string) => () => void;
  getValueLabel: ((params: GetValueLabelParams) => string) | undefined;
}

export const SliderContext = createContext<SliderContextValue>();

export function useSliderContext() {
  const context = useContext(SliderContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useSliderContext` must be used within a `Slider.Root` component");
  }

  return context;
}
