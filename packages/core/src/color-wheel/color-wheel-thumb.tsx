import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type JSX,
	type ValidComponent,
	createSignal,
	splitProps,
} from "solid-js";
import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useColorWheelContext } from "./color-wheel-context";

export interface ColorWheelThumbOptions {}

export interface ColorWheelThumbCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	style: JSX.CSSProperties | string;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export interface ColorWheelThumbRenderProps extends ColorWheelThumbCommonProps {
	role: "slider";
	tabIndex: 0 | undefined;
	"aria-valuetext": string;
	"aria-valuemin": number;
	"aria-valuenow": number | undefined;
	"aria-valuemax": number;
}

export type ColorWheelThumbProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorWheelThumbOptions & Partial<ColorWheelThumbCommonProps<ElementOf<T>>>;

export function ColorWheelThumb<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ColorWheelThumbProps<T>>,
) {
	const context = useColorWheelContext();
	const formControlContext = useFormControlContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("thumb"),
		},
		props as ColorWheelThumbProps,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["style", "onKeyDown", "onPointerDown", "onPointerMove", "onPointerUp"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);
		context.onStepKeyDown(e);
	};

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

		const target = e.currentTarget as HTMLElement;

		e.preventDefault();
		e.stopPropagation();
		target.setPointerCapture(e.pointerId);
		target.focus();

		const value = getValueFromPointer({ x: e.clientX, y: e.clientY });
		startPosition = { x: e.clientX, y: e.clientY };
		context.onDragStart?.(value);
	};

	const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		e.stopPropagation();
		callHandler(e, local.onPointerMove);

		const target = e.currentTarget as HTMLElement;

		if (target.hasPointerCapture(e.pointerId)) {
			const delta = {
				deltaX: e.clientX - startPosition.x,
				deltaY: e.clientY - startPosition.y,
			};

			context.onDrag?.(delta);
			startPosition = { x: e.clientX, y: e.clientY };
		}
	};

	const onPointerUp: JSX.EventHandlerUnion<any, PointerEvent> = (e) => {
		e.stopPropagation();
		callHandler(e, local.onPointerUp);

		const target = e.currentTarget as HTMLElement;

		if (target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);
			context.onDragEnd?.();
		}
	};

	return (
		<Polymorphic<ColorWheelThumbRenderProps>
			as="span"
			ref={mergeRefs(context.setThumbRef, props.ref)}
			role="slider"
			id={fieldProps.id()}
			tabIndex={context.state.isDisabled() ? undefined : 0}
			style={combineStyle(
				{
					position: "absolute",
					left: `${context.outerRadius()! + context.state.getThumbPosition().x}px`,
					top: `${context.outerRadius()! + context.state.getThumbPosition().y}px`,
					transform: "translate(-50%, -50%)",
					"forced-color-adjust": "none",
					"touch-action": "none",
					opacity: context.outerRadius() ? 1 : 0,
					transition: "opacity .1s linear",
					"--kb-color-current": context.state.value().toString(),
				},
				local.style,
			)}
			aria-valuetext={context.getThumbValueLabel()}
			aria-valuemin={context.state.minValue()}
			aria-valuenow={context.state.hue()}
			aria-valuemax={context.state.maxValue()}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			onKeyDown={onKeyDown}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
