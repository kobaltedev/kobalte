import { type Accessor, createContext, useContext } from "solid-js";
import type { Color } from "../colors/types";
import type { ColorAreaIntlTranslations } from "./color-area.intl";
import type { ColorAreaState } from "./create-color-area-state";

export interface ColorAreaContextValue {
	state: ColorAreaState;
	xName: Accessor<string | undefined>;
	yName: Accessor<string | undefined>;
	onDragStart: ((value: number[]) => void) | undefined;
	onDrag: ((deltas: { deltaX: number; deltaY: number }) => void) | undefined;
	onDragEnd: (() => void) | undefined;
	translations: Accessor<ColorAreaIntlTranslations>;
	getDisplayColor: () => Color;
	onStepKeyDown: (event: KeyboardEvent) => void;
	thumbRef: Accessor<HTMLElement | undefined>;
	setThumbRef: (el: HTMLElement) => void;
	backgroundRef: Accessor<HTMLElement | undefined>;
	setBackgroundRef: (el: HTMLElement) => void;
	generateId: (part: string) => string;
}

export const ColorAreaContext = createContext<ColorAreaContextValue>();

export function useColorAreaContext() {
	const context = useContext(ColorAreaContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useColorAreaContext` must be used within a `ColorArea` component",
		);
	}

	return context;
}
