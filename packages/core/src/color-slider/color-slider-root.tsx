import { type ValidationState, mergeDefaultProps } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createMemo,
	createUniqueId,
	splitProps,
} from "solid-js";

import { COLOR_INTL_TRANSLATIONS, type ColorIntlTranslations } from "../colors";
import type { Color, ColorChannel, ColorSpace } from "../colors";
import { parseColor } from "../colors";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { createControllableSignal } from "../primitives/create-controllable-signal";
import * as Slider from "../slider";
import {
	ColorSliderContext,
	type ColorSliderContextValue,
} from "./color-slider-context";

export interface ColorSliderRootOptions {
	/** The controlled values of the slider. */
	value?: Color;

	/** The value of the slider when initially rendered. */
	defaultValue?: Color;

	/** Called when the value changes. */
	onChange?: (value: Color) => void;

	/** Called when the value changes at the end of an interaction. */
	onChangeEnd?: (value: Color) => void;

	/** The color channel that the slider manipulates. */
	channel: ColorChannel;

	/** The color space that the slider operates in. The `channel` must be in this color space.
	 */
	colorSpace?: ColorSpace;

	/**
	 * The orientation of the slider.
	 * @default horizontal
	 */
	orientation?: "horizontal" | "vertical";

	/**
	 * A function to get the accessible label text representing the current value in a human-readable format.
	 */
	getValueLabel?: (value: Color) => string;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the slider, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
	 */
	name?: string;

	/** Whether the slider should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must fill the slider before the owning form can be submitted. */
	required?: boolean;

	/** Whether the slider is disabled. */
	disabled?: boolean;

	/** Whether the slider is read only. */
	readOnly?: boolean;

	/** The localized strings of the component. */
	translations?: ColorIntlTranslations;
}

export interface ColorSliderRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface ColorSliderRootRenderProps
	extends ColorSliderRootCommonProps,
		Slider.SliderRootRenderProps {}

export type ColorSliderRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorSliderRootOptions & Partial<ColorSliderRootCommonProps<ElementOf<T>>>;

export function ColorSliderRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorSliderRootProps<T>>,
) {
	const defaultId = `colorslider-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			translations: COLOR_INTL_TRANSLATIONS,
			defaultValue: parseColor("hsl(0, 100%, 50%)"),
		},
		props as ColorSliderRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"value",
		"defaultValue",
		"onChange",
		"onChangeEnd",
		"channel",
		"colorSpace",
		"getValueLabel",
		"translations",
	]);

	const [value, setValue] = createControllableSignal<Color>({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: (value) => local.onChange?.(value),
	});

	const color = createMemo(() => {
		return local.colorSpace ? value()!.toFormat(local.colorSpace) : value()!;
	});

	const onChange = (value: number[]) => {
		setValue(color()!.withChannelValue(local.channel, value[0]));
	};

	const onChangeEnd = (value: number[]) => {
		local.onChangeEnd?.(color()!.withChannelValue(local.channel, value[0]));
	};

	const getValueLabel = createMemo(() => {
		if (local.getValueLabel) {
			return local.getValueLabel(color()!);
		}

		return color()!.formatChannelValue(local.channel);
	});

	const getDisplayColor = createMemo(() => {
		switch (local.channel) {
			case "hue":
				return parseColor(`hsl(${color()!.getChannelValue("hue")}, 100%, 50%)`);
			case "lightness":
			case "brightness":
			case "saturation":
			case "red":
			case "green":
			case "blue":
				return color()!.withChannelValue("alpha", 1);
			case "alpha": {
				return color()!;
			}
			default:
				throw new Error(`Unknown color channel: ${local.channel}`);
		}
	});

	const context: ColorSliderContextValue = {
		value: color,
		channel: () => local.channel,
		getDisplayColor,
		translations: () => local.translations,
	};

	return (
		<ColorSliderContext.Provider value={context}>
			<Slider.Root<
				Component<
					Omit<ColorSliderRootRenderProps, keyof Slider.SliderRootRenderProps>
				>
			>
				value={[color()!.getChannelValue(local.channel)]}
				onChange={onChange}
				onChangeEnd={onChangeEnd}
				getValueLabel={getValueLabel}
				{...color()!.getChannelRange(local.channel)}
				{...others}
			/>
		</ColorSliderContext.Provider>
	);
}
