import { Accessor, createContext, useContext } from "solid-js";
import { SliderState } from "../primitives/create-slider-state/create-slider-state";

export interface SliderDataSet {
  "data-progress": "loading" | "complete" | undefined;
  "data-indeterminate": string | undefined;
}

export interface SliderContextValue {
  dataset: Accessor<SliderDataSet>;
  state: SliderState;
  orientation: "horizontal" | "vertical";
  sliderFillWidth: Accessor<string | undefined>;
  labelId: Accessor<string | undefined>;
  thumbs: Set<HTMLElement>;
  onSlideStart: (value: number) => void;
  onSlideMove: (value: number) => void;
  onSlideEnd: () => void;
  minValue: number;
  maxValue: number;
  inverted: boolean;
  generateId: (part: string) => string;
  registerLabelId: (id: string) => () => void;
}

export const SliderContext = createContext<SliderContextValue>();

export function useSliderContext() {
  const context = useContext(SliderContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useSliderContext` must be used within a `Slider.Root` component");
  }

  return context;
}
