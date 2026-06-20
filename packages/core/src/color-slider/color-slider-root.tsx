import { type ValidationState, mergeDefaultProps } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createMemo,
	createUniqueId,
	omit,
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

	const others = omit(mergedProps, "value", "defaultValue", "onChange", "onChangeEnd", "channel", "colorSpace", "getValueLabel", "translations");

	const [value, setValue] = createControllableSignal<Color>({
		value: () => mergedProps.value,
		defaultValue: () => mergedProps.defaultValue,
		onChange: (value) => mergedProps.onChange?.(value),
	});

	const color = createMemo(() => {
		return mergedProps.colorSpace ? value()!.toFormat(mergedProps.colorSpace) : value()!;
	});

	const onChange = (value: number[]) => {
		setValue(color()!.withChannelValue(mergedProps.channel, value[0]));
	};

	const onChangeEnd = (value: number[]) => {
		mergedProps.onChangeEnd?.(color()!.withChannelValue(mergedProps.channel, value[0]));
	};

	const getValueLabel = createMemo(() => {
		if (mergedProps.getValueLabel) {
			return mergedProps.getValueLabel(color()!);
		}

		return color()!.formatChannelValue(mergedProps.channel);
	});

	const getDisplayColor = createMemo(() => {
		switch (mergedProps.channel) {
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
				throw new Error(`Unknown color channel: ${mergedProps.channel}`);
		}
	});

	const context: ColorSliderContextValue = {
		value: color,
		channel: () => mergedProps.channel,
		getDisplayColor,
		translations: () => mergedProps.translations,
	};

	return (
		<ColorSliderContext value={context}>
			<Slider.Root<
				Component<
					Omit<ColorSliderRootRenderProps, keyof Slider.SliderRootRenderProps>
				>
			>
				value={[color()!.getChannelValue(mergedProps.channel)]}
				onChange={onChange}
				onChangeEnd={onChangeEnd}
				getValueLabel={getValueLabel}
				{...color()!.getChannelRange(mergedProps.channel)}
				{...others}
			/>
		</ColorSliderContext>
	);
}
