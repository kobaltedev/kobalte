import { combineStyle } from "@solid-primitives/props";
import {
	type Component,
	type JSX,
	type ValidComponent,
	createMemo,
	splitProps,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import * as Slider from "../slider";
import { useColorSliderContext } from "./color-slider-context";

export interface ColorSliderThumbOptions extends Slider.SliderThumbOptions {}

export interface ColorSliderThumbCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	style?: JSX.CSSProperties | string;
}

export interface ColorSliderThumbRenderProps
	extends ColorSliderThumbCommonProps,
		Slider.SliderThumbRenderProps {}

export type ColorSliderThumbProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorSliderThumbOptions &
	Partial<ColorSliderThumbCommonProps<ElementOf<T>>>;

export function ColorSliderThumb<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ColorSliderThumbProps<T>>,
) {
	const context = useColorSliderContext();

	const [local, others] = splitProps(props, ["style"]);

	const valueText = createMemo(() => {
		const formattedValue = context
			.value()
			?.formatChannelValue(context.channel());
		if (context.channel() === "hue") {
			return `${formattedValue}, ${context.getDisplayColor().getHueName(context.translations())}`;
		}
		if (context.channel() !== "alpha") {
			return `${formattedValue}, ${context.getDisplayColor().getColorName(context.translations())}`;
		}

		return formattedValue;
	});

	return (
		<Slider.Thumb<
			Component<
				Omit<ColorSliderThumbRenderProps, keyof Slider.SliderThumbRenderProps>
			>
		>
			style={combineStyle(
				{
					"forced-color-adjust": "none",
					"--kb-color-current": context.value().toString(),
				},
				local.style,
			)}
			aria-valuetext={valueText()}
			{...others}
		/>
	);
}
