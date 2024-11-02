import { callHandler, mergeRefs } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type JSX,
	type ValidComponent,
	createMemo,
	createSignal,
	splitProps,
} from "solid-js";
import type { Color, ColorChannel } from "../colors";
import { parseColor } from "../colors";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control";
import { useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { linearScale } from "../slider/utils";
import { useColorAreaContext } from "./color-area-context";

export interface ColorAreaBackgroundOptions {}

export interface ColorAreaBackgroundCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	style?: JSX.CSSProperties | string;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface ColorAreaBackgroundRenderProps
	extends ColorAreaBackgroundCommonProps,
		FormControlDataSet {}

export type ColorAreaBackgroundProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorAreaBackgroundOptions &
	Partial<ColorAreaBackgroundCommonProps<ElementOf<T>>>;

export function ColorAreaBackground<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorAreaBackgroundProps<T>>,
) {
	const context = useColorAreaContext();
	const formControlContext = useFormControlContext();

	const [local, others] = splitProps(props, [
		"style",
		"onPointerDown",
		"onPointerMove",
		"onPointerUp",
	]);

	const { direction } = useLocale();

	const [sRect, setRect] = createSignal<DOMRect>();

	const getValueFromPointer = (pointerPosition: { x: number; y: number }) => {
		const rect = sRect() || context.backgroundRef()!.getBoundingClientRect();

		const xInput: [number, number] = [0, rect.width];

		const xOutput: [number, number] = [
			context.state.xMinValue(),
			context.state.xMaxValue(),
		];

		const yInput: [number, number] = [0, rect.height];

		const yOutput: [number, number] = [
			context.state.yMinValue(),
			context.state.yMaxValue(),
		];

		const xValue = linearScale(xInput, xOutput);
		const yValue = linearScale(yInput, yOutput);

		setRect(rect);

		return [
			xValue(pointerPosition.x - rect.left),
			yValue(pointerPosition.y - rect.top),
		];
	};

	let startPosition = { x: 0, y: 0 };

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerDown);

		const target = e.target as HTMLElement;
		target.setPointerCapture(e.pointerId);

		e.preventDefault();
		const value = getValueFromPointer({ x: e.clientX, y: e.clientY });
		startPosition = { x: e.clientX, y: e.clientY };
		context.onDragStart?.(value);
	};

	const onPointerMove: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerMove);

		const target = e.target as HTMLElement;

		if (target.hasPointerCapture(e.pointerId)) {
			context.onDrag?.({
				deltaX: e.clientX - startPosition.x,
				deltaY: e.clientY - startPosition.y,
			});
			startPosition = { x: e.clientX, y: e.clientY };
		}
	};

	const onPointerUp: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (e) => {
		callHandler(e, local.onPointerUp);

		const target = e.target as HTMLElement;

		if (target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);
			setRect(undefined);
			context.onDragEnd?.();
		}
	};

	const backgroundStyles = createMemo(() => {
		const end = direction() === "ltr" ? "right" : "left";
		const zValue = context.state
			.value()
			.getChannelValue(context.state.channels().zChannel);
		switch (context.state.value().getColorSpace()) {
			case "rgb": {
				const rgb = parseColor("rgb(0, 0, 0)");
				return {
					background: [
						`linear-gradient(to ${end}, ${rgb.withChannelValue(context.state.channels().xChannel, 0)}, ${rgb.withChannelValue(context.state.channels().xChannel, 255)})`,
						`linear-gradient(to top, ${rgb.withChannelValue(context.state.channels().yChannel, 0)}, ${rgb.withChannelValue(context.state.channels().yChannel, 255)})`,
						rgb.withChannelValue(context.state.channels().zChannel, zValue),
					].join(","),
					"background-blend-mode": "screen",
				};
			}
			case "hsl": {
				const value = parseColor("hsl(0, 100%, 50%)").withChannelValue(
					context.state.channels().zChannel,
					zValue,
				);
				const bg = context.state
					.value()
					.getColorChannels()
					.filter((c) => c !== context.state.channels().zChannel)
					.map(
						(c) =>
							`linear-gradient(to ${c === context.state.channels().xChannel ? end : "top"}, ${hslChannels[c as Exclude<ColorChannel, "brightness" | "red" | "green" | "blue" | "alpha">](value)})`,
					)
					.reverse();
				if (context.state.channels().zChannel === "hue") {
					bg.push(value.toString("css"));
				}

				return {
					background: bg.join(", "),
				};
			}

			case "hsb": {
				const value = parseColor("hsb(0, 100%, 100%)").withChannelValue(
					context.state.channels().zChannel,
					zValue,
				);
				const bg = context.state
					.value()
					.getColorChannels()
					.filter((c) => c !== context.state.channels().zChannel)
					.map(
						(c) =>
							`linear-gradient(to ${c === context.state.channels().xChannel ? end : "top"}, ${hsbChannels[c as Exclude<ColorChannel, "lightness" | "red" | "green" | "blue" | "alpha">](value)})`,
					)
					.reverse();
				if (context.state.channels().zChannel === "hue") {
					bg.push(value.toString("css"));
				}

				return {
					background: bg.join(", "),
				};
			}
		}
	});

	return (
		<Polymorphic<ColorAreaBackgroundRenderProps>
			as="div"
			ref={mergeRefs(context.setBackgroundRef, props.ref)}
			style={combineStyle(
				{
					"touch-action": "none",
					"forced-color-adjust": "none",
					...backgroundStyles(),
				},
				local.style,
			)}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}

const hue = (color: Color) =>
	[0, 60, 120, 180, 240, 300, 360]
		.map((hue) => color.withChannelValue("hue", hue).toString("css"))
		.join(", ");
const saturation = (color: Color) =>
	`${color.withChannelValue("saturation", 0)}, transparent`;

const hslChannels = {
	hue,
	saturation,
	lightness: () => "black, transparent, white",
};

const hsbChannels = {
	hue,
	saturation,
	brightness: () => "black, transparent",
};
