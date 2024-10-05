import { mergeDefaultProps } from "@kobalte/utils";

import {
	COLOR_PICKER_INTL_TRANSLATIONS,
	type ColorPickerIntlTranslations,
} from "./color-picker.intl";
import { ParentProps, splitProps } from "solid-js";

import { createControllableSignal } from "../primitives/create-controllable-signal";
import { ColorPickerContextValue, ColorPickerContext } from "./color-picker-context";

export interface ColorPickerRootOptions {
	/** The value of the menu that should be open when initially rendered. Use when you do not need to control the value state. */
	defaultValue?: string;

	/** The controlled value of the menu to open. Should be used in conjunction with onValueChange. */
	value?: string | null;

	/** Event handler called when the value changes. */
	onValueChange?: (value: string | undefined | null) => void;

	/**
	 * If `true`, the color picker will return the color with an alpha channel.
	 *
	 * You're responsible for showing and hiding the alpha channel in your application.
	 */
	withAlpha?: boolean;

	/** The localized strings of the component. */
	translations?: ColorPickerIntlTranslations;
}

export interface ColorPickerRootProps extends ParentProps<ColorPickerRootOptions> {}

export function ColorPickerRoot (props: ColorPickerRootProps) {
	const mergedProps = mergeDefaultProps({
		translations: COLOR_PICKER_INTL_TRANSLATIONS,
	}, props);

	const [local, others] = splitProps(mergedProps, ["value", "onValueChange", "defaultValue", "translations"]);

	const [value, setValue] = createControllableSignal({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: local.onValueChange,
	});

	const context: ColorPickerContextValue = {
		translations: () => local.translations,
		value,
	}

	return (<ColorPickerContext.Provider value={context}>
		{others.children}
	</ColorPickerContext.Provider>);
}
