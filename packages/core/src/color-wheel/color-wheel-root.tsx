import {
	type ValidationState,
	access,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { type ValidComponent } from "@solidjs/web";
import {
	createMemo,
	createSignal,
	createUniqueId,
	omit,
} from "solid-js";

import {
	COLOR_INTL_TRANSLATIONS,
	type Color,
	type ColorIntlTranslations,
} from "@solid-primitives/utils/colors";
import {
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
	createFormControl,
} from "../form-control";
import { useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createFormResetListener } from "@solid-primitives/form";
import { createElementSize } from "@solid-primitives/resize-observer";
import {
	ColorWheelContext,
	type ColorWheelContextValue,
} from "./color-wheel-context";
import { createColorWheelState } from "./create-color-wheel-state";

export interface ColorWheelRootOptions {
	/** The localized strings of the component. */
	translations?: ColorIntlTranslations;

	/** The controlled value of the color wheel. */
	value?: Color;

	/** The value of the color wheel when initially rendered. */
	defaultValue?: Color;

	/** The thickness of the track. */
	thickness: number;

	/** Event handler called when the value changes. */
	onChange?: (value: Color) => void;

	/** Called when the value changes at the end of an interaction. */
	onChangeEnd?: (value: Color) => void;

	/**
	 * A function to get the accessible label text representing the current value in a human-readable format.
	 */
	getValueLabel?: (param: Color) => string;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the color wheel, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
	 */
	name?: string;

	/** Whether the color wheel should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must select an item before the owning form can be submitted. */
	required?: boolean;

	/** Whether the color wheel is disabled. */
	disabled?: boolean;

	/** Whether the color wheel is read only. */
	readOnly?: boolean;
}

export interface ColorWheelRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface ColorWheelRootRenderProps
	extends ColorWheelRootCommonProps,
		FormControlDataSet {
	role: "group";
}

export type ColorWheelRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorWheelRootOptions & Partial<ColorWheelRootCommonProps<ElementOf<T>>>;

export function ColorWheelRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorWheelRootProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement>();

	const defaultId = `colorwheel-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			getValueLabel: (param) => param.formatChannelValue("hue"),
			translations: COLOR_INTL_TRANSLATIONS,
			disabled: false,
			thickness: 30,
		},
		props as ColorWheelRootProps,
	);

	const formControlProps = omit(
		mergedProps,
		"ref",
		"value",
		"defaultValue",
		"thickness",
		"onChange",
		"onChangeEnd",
		"getValueLabel",
		"translations",
	);
	const others = omit(
		mergedProps,
		"ref",
		"value",
		"defaultValue",
		"thickness",
		"onChange",
		"onChangeEnd",
		"getValueLabel",
		"translations",
		...FORM_CONTROL_PROP_NAMES,
	);

	const { formControlContext } = createFormControl(formControlProps);
	const { direction } = useLocale();

	const [trackRef, setTrackRef] = createSignal<HTMLElement>();
	const [thumbRef, setThumbRef] = createSignal<HTMLElement>();

	const size = createElementSize(trackRef);

	const outerRadius = createMemo(() => {
		if (size.width === null) return undefined;

		return size.width / 2;
	});

	const thumbRadius = () =>
		((139.75 - (mergedProps.thickness / 100) * 70) * outerRadius()!) / 140;

	const state = createColorWheelState({
		value: () => mergedProps.value,
		defaultValue: () => mergedProps.defaultValue,
		thumbRadius,
		onChange: mergedProps.onChange,
		onChangeEnd: mergedProps.onChangeEnd,
		isDisabled: () => formControlContext.isDisabled() ?? false,
	});

	createFormResetListener(ref, () => state.resetValue());

	const isLTR = () => direction() === "ltr";

	let currentPosition: { x: number; y: number } | null = null;
	const onDragStart = (value: number[]) => {
		state.setIsDragging(true);
		state.setThumbValue(
			value[0],
			value[1],
			Math.sqrt(value[0] * value[0] + value[1] * value[1]),
		);
		currentPosition = null;
	};

	const onDrag = ({ deltaX, deltaY }: { deltaX: number; deltaY: number }) => {
		if (currentPosition === null) {
			currentPosition = state.getThumbPosition();
		}
		currentPosition.x += deltaX;
		currentPosition.y += deltaY;
		state.setThumbValue(currentPosition.x, currentPosition.y, thumbRadius());
		mergedProps.onChange?.(state.value());
	};

	const onDragEnd = () => {
		state.setIsDragging(false);
		thumbRef()?.focus();
	};

	const getThumbValueLabel = () =>
		`${state.value().formatChannelValue("hue")}, ${context.state.value().getHueName(mergedProps.translations)}`;

	const onHomeKeyDown = (event: KeyboardEvent) => {
		if (!formControlContext.isDisabled()) {
			event.preventDefault();
			event.stopPropagation();
			state.setHue(state.minValue());
		}
	};

	const onEndKeyDown = (event: KeyboardEvent) => {
		if (!formControlContext.isDisabled()) {
			event.preventDefault();
			event.stopPropagation();
			state.setHue(state.maxValue());
		}
	};

	const onStepKeyDown = (event: KeyboardEvent) => {
		if (!formControlContext.isDisabled()) {
			switch (event.key) {
				case "Left":
				case "ArrowLeft":
					event.preventDefault();
					event.stopPropagation();
					if (!isLTR()) {
						state.increment(event.shiftKey ? state.pageSize() : state.step());
					} else {
						state.decrement(event.shiftKey ? state.pageSize() : state.step());
					}
					break;
				case "Down":
				case "ArrowDown":
					event.preventDefault();
					event.stopPropagation();
					state.decrement(event.shiftKey ? state.pageSize() : state.step());
					break;
				case "Up":
				case "ArrowUp":
					event.preventDefault();
					event.stopPropagation();
					state.increment(event.shiftKey ? state.pageSize() : state.step());
					break;
				case "Right":
				case "ArrowRight":
					event.preventDefault();
					event.stopPropagation();
					if (!isLTR()) {
						state.decrement(event.shiftKey ? state.pageSize() : state.step());
					} else {
						state.increment(event.shiftKey ? state.pageSize() : state.step());
					}
					break;
				case "Home":
					onHomeKeyDown(event);
					break;
				case "End":
					onEndKeyDown(event);
					break;
				case "PageUp":
					event.preventDefault();
					event.stopPropagation();
					state.increment(state.pageSize());
					break;
				case "PageDown":
					event.preventDefault();
					event.stopPropagation();
					state.decrement(state.pageSize());
					break;
			}
		}
	};

	const context: ColorWheelContextValue = {
		state,
		outerRadius,
		thickness: () => mergedProps.thickness,
		onDragStart,
		onDrag,
		onDragEnd,
		getThumbValueLabel,
		getValueLabel: mergedProps.getValueLabel,
		onStepKeyDown,
		trackRef,
		setTrackRef,
		thumbRef,
		setThumbRef,
		generateId: createGenerateId(() => access(formControlProps.id)!),
	};

	return (
		<FormControlContext value={formControlContext}>
			<ColorWheelContext value={context}>
				<Polymorphic<ColorWheelRootRenderProps>
					as="div"
					ref={mergeRefs(setRef, mergedProps.ref)}
					role="group"
					id={access(formControlProps.id)!}
					{...formControlContext.dataset()}
					{...others}
				/>
			</ColorWheelContext>
		</FormControlContext>
	);
}
