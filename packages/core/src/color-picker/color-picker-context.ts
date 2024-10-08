import { type Accessor, createContext, useContext } from "solid-js";
import type { ColorPickerIntlTranslations } from "./color-picker.intl";
import { CoreColor } from "./utils/convert";

export interface ColorPickerContextValue {
	translations: Accessor<ColorPickerIntlTranslations>;
	value: Accessor<string | null | undefined>;
	alpha: Accessor<number>;
	setAlpha: (value: number) => void;
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
