import { callHandler, mergeRefs } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type JSX,
	type ValidComponent,
	createMemo,
	createSignal,
	splitProps,
} from "solid-js";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useColorWheelContext } from "./color-wheel-context";

export interface ColorWheelTrackOptions {}

export interface ColorWheelTrackCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	style?: JSX.CSSProperties | string;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface ColorWheelTrackRenderProps
	extends ColorWheelTrackCommonProps,
		FormControlDataSet {}

export type ColorWheelTrackProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorWheelTrackOptions & Partial<ColorWheelTrackCommonProps<ElementOf<T>>>;

export function ColorWheelTrack<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorWheelTrackProps<T>>,
) {
	const context = useColorWheelContext();
	const formControlContext = useFormControlContext();

	const [local, others] = splitProps(props, [
		"style",
		"onPointerDown",
		"onPointerMove",
		"onPointerUp",
	]);

	const [sRect, setRect] = createSignal<DOMRect>();

	const getValueFromPointer = (pointerPosition: { x: number; y: number }) => {
		const rect = sRect() || context.trackRef()!.getBoundingClientRect();
		setRect(rect);
		return [
			pointerPosition.x - rect.left - rect.width / 2,
			pointerPosition.y - rect.top - rect.height / 2,
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

	const backgroundStyle = createMemo(() => {
		return {
			background: `
          conic-gradient(
            from 90deg,
            hsl(0, 100%, 50%),
            hsl(30, 100%, 50%),
            hsl(60, 100%, 50%),
            hsl(90, 100%, 50%),
            hsl(120, 100%, 50%),
            hsl(150, 100%, 50%),
            hsl(180, 100%, 50%),
            hsl(210, 100%, 50%),
            hsl(240, 100%, 50%),
            hsl(270, 100%, 50%),
            hsl(300, 100%, 50%),
            hsl(330, 100%, 50%),
            hsl(360, 100%, 50%)
          )
        `,
		};
	});

	return (
		<Polymorphic<ColorWheelTrackRenderProps>
			as="div"
			ref={mergeRefs(context.setTrackRef, props.ref)}
			style={combineStyle(
				{
					"touch-action": "none",
					"forced-color-adjust": "none",
					...backgroundStyle(),
					"clip-path": `path(evenodd, "${circlePath(context.outerRadius()!, context.outerRadius()!, context.outerRadius()!)} ${circlePath(context.outerRadius()!, context.outerRadius()!, context.innerRadius())}")`,
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

function circlePath(cx: number, cy: number, r: number) {
	return `M ${cx}, ${cy} m ${-r}, 0 a ${r}, ${r}, 0, 1, 0, ${r * 2}, 0 a ${r}, ${r}, 0, 1, 0 ${-r * 2}, 0`;
}
