import { type Accessor, createContext, useContext } from "solid-js";
import type { ColorIntlTranslations } from "../colors";
import type { Color, ColorChannel } from "../colors";

export interface ColorSliderContextValue {
	readonly value: Accessor<Color>;
	channel: Accessor<ColorChannel>;
	getDisplayColor: () => Color;
	translations: Accessor<ColorIntlTranslations>;
}

export const ColorSliderContext = createContext<ColorSliderContextValue>();

export function useColorSliderContext() {
	const context = useContext(ColorSliderContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useColorSliderContext` must be used within a `ColorSlider.Root` component",
		);
	}

	return context;
}
