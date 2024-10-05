import { ColorChannel } from "./utils/convert";
import { createContext, useContext } from "solid-js";
import type { ColorPickerIntlTranslations } from "./color-picker.intl";
import { CoreColor } from "./utils/convert";
import { colorScopeHasChannels } from "./utils/validators";

export interface ColorPickerAreaProps {
	xChannel: ColorChannel;
	yChannel: ColorChannel;
}

export const ColorPickerArea = createContext<ColorPickerAreaProps>();

export function useColorPickerAreaContext() {
	const context = useContext(ColorPickerArea);
	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useColorPickerContext` must be used within a `ColorPicker` component",
		);
	}
	colorScopeHasChannels([context.xChannel, context.yChannel]);
	return context;
}
