import {
	type ValidationState,
	access,
	clamp,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type ValidComponent,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import { parseColor } from "../colors";
import type { Color, ColorChannel, ColorSpace } from "../colors/types";
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
import { createFormResetListener } from "../primitives";
import {
	ColorAreaContext,
	type ColorAreaContextValue,
} from "./color-area-context";
import {
	COLOR_AREA_INTL_TRANSLATIONS,
	type ColorAreaIntlTranslations,
} from "./color-area.intl";
import { createColorAreaState } from "./create-color-area-state";

export interface ColorAreaRootOptions {
	/** The localized strings of the component. */
	translations?: ColorAreaIntlTranslations;

	/** The controlled value of the color area. */
	value?: Color;

	/** The value of the color area when initially rendered. */
	defaultValue?: Color;

	/** Event handler called when the value changes. */
	onChange?: (value: Color) => void;

	/** Called when the value changes at the end of an interaction. */
	onChangeEnd?: (value: Color) => void;

	/** Color channel for the horizontal axis. */
	xChannel?: ColorChannel;

	/** Color channel for the vertical axis. */
	yChannel?: ColorChannel;

	/**
	 * The color space that the color area operates in. The `xChannel` and `yChannel` must be in this color space.
	 */
	colorSpace?: ColorSpace;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the color area, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
	 */
	name?: string;

	/**
	 * The name of the x channel input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
	 */
	xName?: string;

	/**
	 * The name of the y channel input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
	 */
	yName?: string;

	/** Whether the color area should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must select an item before the owning form can be submitted. */
	required?: boolean;

	/** Whether the color area is disabled. */
	disabled?: boolean;

	/** Whether the color area is read only. */
	readOnly?: boolean;
}

export interface ColorAreaRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface ColorAreaRootRenderProps
	extends ColorAreaRootCommonProps,
		FormControlDataSet {
	role: "group";
}

export type ColorAreaRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorAreaRootOptions & Partial<ColorAreaRootCommonProps<ElementOf<T>>>;

export function ColorAreaRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorAreaRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `colorarea-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			translations: COLOR_AREA_INTL_TRANSLATIONS,
			disabled: false,
			defaultValue: parseColor("hsl(0, 100%, 50%)"),
		},
		props as ColorAreaRootProps,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"value",
			"defaultValue",
			"colorSpace",
			"xChannel",
			"yChannel",
			"onChange",
			"onChangeEnd",
			"translations",
			"xName",
			"yName",
			"disabled",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const { formControlContext } = createFormControl(formControlProps);
	const { direction } = useLocale();

	const [backgroundRef, setBackgroundRef] = createSignal<HTMLElement>();
	const [thumbRef, setThumbRef] = createSignal<HTMLElement>();

	const state = createColorAreaState({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: local.onChange,
		onChangeEnd: local.onChangeEnd,
		colorSpace: () => local.colorSpace,
		xChannel: () => local.xChannel,
		yChannel: () => local.yChannel,
		isDisabled: () => formControlContext.isDisabled() ?? false,
	});

	createFormResetListener(
		() => ref,
		() => state.resetValue(),
	);

	const isLTR = () => direction() === "ltr";

	let currentPosition: { x: number; y: number } | null = null;
	const onDragStart = (value: number[]) => {
		state.setIsDragging(true);
		state.setThumbValue({
			x: value[0],
			y: context.state.yMaxValue() - value[1],
		});
		currentPosition = null;
	};

	const onDrag = ({ deltaX, deltaY }: { deltaX: number; deltaY: number }) => {
		const { width, height } = backgroundRef()!.getBoundingClientRect();
		if (currentPosition === null) {
			currentPosition = {
				x: state.getThumbPercent().x * width,
				y: state.getThumbPercent().y * height,
			};
		}
		currentPosition.x += deltaX;
		currentPosition.y += -deltaY;
		const xPercent = clamp(currentPosition.x / width, 0, 1);
		const yPercent = clamp(currentPosition.y / height, 0, 1);
		state.setThumbPercent({ x: xPercent, y: yPercent });
		local.onChange?.(state.value());
	};

	const onDragEnd = () => {
		state.setIsDragging(false);
		thumbRef()?.focus();
	};

	const getDisplayColor = () => {
		return state.value().withChannelValue("alpha", 1);
	};

	const onHomeKeyDown = (event: KeyboardEvent) => {
		if (!formControlContext.isDisabled()) {
			event.preventDefault();
			event.stopPropagation();
			if (!isLTR()) {
				state.incrementX(state.xPageSize());
			} else {
				state.decrementX(state.xPageSize());
			}
		}
	};

	const onEndKeyDown = (event: KeyboardEvent) => {
		if (!formControlContext.isDisabled()) {
			event.preventDefault();
			event.stopPropagation();
			if (!isLTR()) {
				state.decrementX(state.xPageSize());
			} else {
				state.incrementX(state.xPageSize());
			}
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
						state.incrementX(
							event.shiftKey ? state.xPageSize() : state.xStep(),
						);
					} else {
						state.decrementX(
							event.shiftKey ? state.xPageSize() : state.xStep(),
						);
					}
					break;
				case "Down":
				case "ArrowDown":
					event.preventDefault();
					event.stopPropagation();
					state.decrementY(event.shiftKey ? state.yPageSize() : state.yStep());
					break;
				case "Up":
				case "ArrowUp":
					event.preventDefault();
					event.stopPropagation();
					state.incrementY(event.shiftKey ? state.yPageSize() : state.yStep());
					break;
				case "Right":
				case "ArrowRight":
					event.preventDefault();
					event.stopPropagation();
					if (!isLTR()) {
						state.decrementX(
							event.shiftKey ? state.xPageSize() : state.xStep(),
						);
					} else {
						state.incrementX(
							event.shiftKey ? state.xPageSize() : state.xStep(),
						);
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
					state.incrementY(state.yPageSize());
					break;
				case "PageDown":
					event.preventDefault();
					event.stopPropagation();
					state.decrementY(state.yPageSize());
					break;
			}
		}
	};

	const context: ColorAreaContextValue = {
		state,
		xName: () => local.xName,
		yName: () => local.yName,
		onDragStart,
		onDrag,
		onDragEnd,
		translations: () => local.translations,
		getDisplayColor,
		onStepKeyDown,
		backgroundRef,
		setBackgroundRef,
		thumbRef,
		setThumbRef,
		generateId: createGenerateId(() => access(formControlProps.id)!),
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<ColorAreaContext.Provider value={context}>
				<Polymorphic<ColorAreaRootRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el), local.ref)}
					role="group"
					id={access(formControlProps.id)!}
					{...formControlContext.dataset()}
					{...others}
				/>
			</ColorAreaContext.Provider>
		</FormControlContext.Provider>
	);
}
