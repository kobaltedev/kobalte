import { Accessor, Setter, createContext, useContext } from "solid-js";

import { FormControlDataSet } from "../form-control";
import { CollectionItemWithRef } from "../primitives";
import { SliderState } from "./create-slider-state";
import { GetValueLabelParams } from "./slider-root";

export interface SliderDataSet extends FormControlDataSet {
	"data-orientation": "vertical" | "horizontal" | undefined;
}

export type Side = "left" | "top" | "bottom" | "right";

export interface SliderContextValue {
	dataset: Accessor<SliderDataSet>;
	state: SliderState;
	thumbs: Accessor<CollectionItemWithRef[]>;
	setThumbs: Setter<CollectionItemWithRef[]>;
	onSlideStart: ((index: number, value: number) => void) | undefined;
	onSlideMove:
		| ((deltas: { deltaX: number; deltaY: number }) => void)
		| undefined;
	onSlideEnd: (() => void) | undefined;
	onStepKeyDown: (event: KeyboardEvent, index: number) => void;
	isSlidingFromLeft: () => boolean;
	isSlidingFromBottom: () => boolean;
	trackRef: Accessor<HTMLElement | undefined>;
	startEdge: Accessor<Side>;
	endEdge: Accessor<Side>;
	minValue: Accessor<number>;
	maxValue: Accessor<number>;
	inverted: Accessor<boolean>;
	registerTrack: (ref: HTMLElement) => void;
	generateId: (part: string) => string;
	getValueLabel: ((params: GetValueLabelParams) => string) | undefined;
}

export const SliderContext = createContext<SliderContextValue>();

export function useSliderContext() {
	const context = useContext(SliderContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useSliderContext` must be used within a `Slider.Root` component",
		);
	}

	return context;
}
