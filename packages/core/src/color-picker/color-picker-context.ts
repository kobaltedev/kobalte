import { type Accessor, createContext, useContext } from "solid-js";
import type { ColorPickerIntlTranslations } from "./color-picker.intl";

export interface ColorPickerContextValue {
	translations: Accessor<ColorPickerIntlTranslations>;
	value: Accessor<string | null | undefined>;
}

export interface ColorPickerColor {
	rgb: [number, number, number];
	hsv: [number, number, number];
	alpha?: number;
}

export const ColorPickerContext = createContext<ColorPickerContextValue>();

export function useColorPickerContext() {
	const context = useContext(ColorPickerContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useColorPickerContext` must be used within a `ColorPicker` component",
		);
	}

	return context;
}
