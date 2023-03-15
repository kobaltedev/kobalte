import { Accessor, createContext, Setter, useContext } from "solid-js";

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
  isDisabled: Accessor<boolean>;
  orientation: "horizontal" | "vertical";
  labelId: Accessor<string | undefined>;
  thumbs: Set<HTMLElement>;
  onSlideStart: (value: number) => void;
  onSlideMove: (value: number) => void;
  onSlideEnd: () => void;
  startEdge: Side;
  endEdge: Side;
  minValue: number;
  maxValue: number;
  step: number;
  inverted: boolean;
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
