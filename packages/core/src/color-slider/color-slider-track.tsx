import { combineStyle } from "@solid-primitives/props";
import {
	type Component,
	type JSX,
	type ValidComponent,
	createMemo,
	splitProps,
} from "solid-js";
import { useLocale } from "../i18n";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import * as Slider from "../slider";
import { useSliderContext } from "../slider/slider-context";
import { useColorSliderContext } from "./color-slider-context";

export interface ColorSliderTrackOptions extends Slider.SliderTrackOptions {}

export interface ColorSliderTrackCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	style?: JSX.CSSProperties | string;
}

export interface ColorSliderTrackRenderProps
	extends ColorSliderTrackCommonProps,
		Slider.SliderTrackRenderProps {}

export type ColorSliderTrackProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorSliderTrackOptions &
	Partial<ColorSliderTrackCommonProps<ElementOf<T>>>;

export function ColorSliderTrack<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorSliderTrackProps<T>>,
) {
	const sliderContext = useSliderContext();
	const context = useColorSliderContext();

	const [local, others] = splitProps(props, ["style"]);

	const { direction } = useLocale();

	const backgroundStyles = createMemo(() => {
		let to: string;
		if (sliderContext.state.orientation() === "vertical") {
			to = "top";
		} else if (direction() === "ltr") {
			to = "right";
		} else {
			to = "left";
		}
		switch (context.channel()) {
			case "hue": {
				const stops = [0, 60, 120, 180, 240, 300, 360]
					.map((hue) =>
						context
							.getDisplayColor()
							.withChannelValue("hue", hue)
							.toString("css"),
					)
					.join(", ");
				return `linear-gradient(to ${to}, ${stops})`;
			}
			case "lightness": {
				const min = sliderContext.state.getThumbMinValue(0);
				const max = sliderContext.state.getThumbMaxValue(0);
				const start = context
					.getDisplayColor()
					.withChannelValue(context.channel(), min)
					.toString("css");
				const middle = context
					.getDisplayColor()
					.withChannelValue(context.channel(), (max - min) / 2)
					.toString("css");
				const end = context
					.getDisplayColor()
					.withChannelValue(context.channel(), max)
					.toString("css");
				return `linear-gradient(to ${to}, ${start}, ${middle}, ${end})`;
			}
			case "saturation":
			case "brightness":
			case "red":
			case "green":
			case "blue":
			case "alpha": {
				const start = context
					.getDisplayColor()
					.withChannelValue(
						context.channel(),
						sliderContext.state.getThumbMinValue(0),
					)
					.toString("css");
				const end = context
					.getDisplayColor()
					.withChannelValue(
						context.channel(),
						sliderContext.state.getThumbMaxValue(0),
					)
					.toString("css");
				return `linear-gradient(to ${to}, ${start}, ${end})`;
			}
			default:
				throw new Error(`Unknown color channel: ${context.channel()}`);
		}
	});
	return (
		<Slider.Track<
			Component<
				Omit<ColorSliderTrackRenderProps, keyof Slider.SliderTrackRenderProps>
			>
		>
			style={combineStyle(
				{
					"forced-color-adjust": "none",
					background: backgroundStyles(),
				},
				local.style,
			)}
			{...others}
		/>
	);
}
