import { mergeDefaultProps } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createMemo,
	createUniqueId,
	splitProps,
} from "solid-js";
import type { Color, ColorChannel, ColorSpace } from "../colors";
import * as NumberField from "../number-field";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { createControllableSignal } from "../primitives";

export interface ColorChannelFieldRootOptions
	extends Omit<
		NumberField.NumberFieldRootOptions,
		| "value"
		| "defaultValue"
		| "rawValue"
		| "onChange"
		| "onRawValueChange"
		| "formatOptions"
		| "allowedInput"
	> {
	/** The controlled formatted value of the field. */
	value?: Color;

	/** The default formatted value when initially rendered. */
	defaultValue?: Color;

	/** Event handler called when the value of the field changes. */
	onChange?: (value: Color) => void;

	/** The color channel that the field manipulates. */
	channel: ColorChannel;

	/** The color space that the field operates in. The `channel` must be in this color space.
	 */
	colorSpace?: ColorSpace;
}

export interface ColorChannelFieldRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface ColorChannelFieldRootRenderProps
	extends ColorChannelFieldRootCommonProps,
		NumberField.NumberFieldRootRenderProps {}

export type ColorChannelFieldRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorChannelFieldRootOptions &
	Partial<ColorChannelFieldRootCommonProps<ElementOf<T>>>;

export function ColorChannelFieldRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorChannelFieldRootProps<T>>,
) {
	const defaultId = `colorchannelfield-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{ id: defaultId },
		props as ColorChannelFieldRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"value",
		"defaultValue",
		"onChange",
		"channel",
		"colorSpace",
	]);

	if (!local.value && !local.defaultValue) {
		throw new Error("ColorChannelField requires a value or defaultValue");
	}

	const [value, setValue] = createControllableSignal<Color>({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: (value) => local.onChange?.(value),
	});

	const color = createMemo(() =>
		local.colorSpace ? value()!.toFormat(local.colorSpace) : value(),
	);

	const range = createMemo(() => color()!.getChannelRange(local.channel));

	const formatOptions = createMemo(() =>
		color()!.getChannelFormatOptions(local.channel),
	);

	const multiplier = createMemo(() =>
		formatOptions().style === "percent" && range().maxValue === 100 ? 100 : 1,
	);

	const onRawValueChange = (value: number) => {
		setValue(
			color()!.withChannelValue(
				local.channel,
				!Number.isNaN(value) ? value * multiplier() : Number.NaN,
			),
		);
	};

	return (
		<NumberField.Root<
			Component<
				Omit<
					ColorChannelFieldRootRenderProps,
					keyof NumberField.NumberFieldRootRenderProps
				>
			>
		>
			value={
				Number.isNaN(color()!.getChannelValue(local.channel))
					? ""
					: color()!.getChannelValue(local.channel) / multiplier()
			}
			minValue={range().minValue / multiplier()}
			maxValue={range().maxValue / multiplier()}
			step={range().step / multiplier()}
			formatOptions={formatOptions()}
			onRawValueChange={onRawValueChange}
			{...others}
		/>
	);
}
