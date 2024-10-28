import { callHandler, mergeRefs } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import { type JSX, type ValidComponent, splitProps } from "solid-js";
import { useFormControlContext } from "../../form-control";
import { type ElementOf, Polymorphic, type PolymorphicProps } from "../../polymorphic";
import { useColorAreaContext } from "./color-area-context";

export interface ColorAreaThumbOptions {}

export interface ColorAreaThumbCommonProps<T extends HTMLElement = HTMLElement> {
	style?: JSX.CSSProperties | string;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface ColorAreaThumbRenderProps extends ColorAreaThumbCommonProps {
	role: "presentation";
}

export type ColorAreaThumbProps<T extends ValidComponent | HTMLElement = HTMLElement> =
	ColorAreaThumbOptions & Partial<ColorAreaThumbCommonProps<ElementOf<T>>>;

export function ColorAreaThumb<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ColorAreaThumbProps<T>>,
) {
	const context = useColorAreaContext();
	const formControlContext = useFormControlContext();

	const [local, others] = splitProps(props, [
		"style",
		"onKeyDown",
		"onPointerDown",
		"onPointerMove",
		"onPointerUp",
	]);

	const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
		callHandler(e, local.onKeyDown);
		context.onStepKeyDown(e);
	};

	let startPosition = { x: 0, y: 0 };

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = e => {
		callHandler(e, local.onPointerDown);

		const target = e.currentTarget as HTMLElement;

		e.preventDefault();
		e.stopPropagation();
		target.setPointerCapture(e.pointerId);
		target.focus();

		startPosition = { x: e.clientX, y: e.clientY };
		context.onDragStart?.([
			context.state.xValue(),
			context.state.yMaxValue() - context.state.yValue(),
		]);
	};

	const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = e => {
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

	const onPointerUp: JSX.EventHandlerUnion<any, PointerEvent> = e => {
		e.stopPropagation();
		callHandler(e, local.onPointerUp);

		const target = e.currentTarget as HTMLElement;

		if (target.hasPointerCapture(e.pointerId)) {
			target.releasePointerCapture(e.pointerId);
			context.onDragEnd?.();
		}
	};

	return (
		<Polymorphic<ColorAreaThumbRenderProps>
			as="span"
			ref={mergeRefs(context.setThumbRef, props.ref)}
			role="presentation"
			tabIndex={context.state.isDisabled() ? undefined : 0}
			style={combineStyle(
				{
					position: "absolute",
					left: `${context.state.getThumbPosition().x * 100}%`,
					top: `${context.state.getThumbPosition().y * 100}%`,
					transform: "translate(-50%, -50%)",
					"forced-color-adjust": "none",
					"touch-action": "none",
				},
				local.style,
			)}
			onKeyDown={onKeyDown}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
