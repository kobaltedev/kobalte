import { type Accessor, createContext, useContext } from "solid-js";
import type { Color } from "../colors";
import type { ColorWheelState } from "./create-color-wheel-state";

export interface ColorWheelContextValue {
	state: ColorWheelState;
	outerRadius: Accessor<number | undefined>;
	thickness: Accessor<number>;
	onDragStart: ((value: number[]) => void) | undefined;
	onDrag: ((deltas: { deltaX: number; deltaY: number }) => void) | undefined;
	onDragEnd: (() => void) | undefined;
	getThumbValueLabel: () => string;
	getValueLabel: (param: Color) => string;
	onStepKeyDown: (event: KeyboardEvent) => void;
	thumbRef: Accessor<HTMLElement | undefined>;
	setThumbRef: (el: HTMLElement) => void;
	trackRef: Accessor<HTMLElement | undefined>;
	setTrackRef: (el: HTMLElement) => void;
	generateId: (part: string) => string;
}

export const ColorWheelContext = createContext<ColorWheelContextValue>();

export function useColorWheelContext() {
	const context = useContext(ColorWheelContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useColorWheelContext` must be used within a `ColorWheel` component",
		);
	}

	return context;
}
