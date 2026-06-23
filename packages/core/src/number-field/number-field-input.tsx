import {
	callHandler,
	composeEventHandlers,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import { type JSX, type ValidComponent } from "@solidjs/web";
import {
	createEffect,
	createMemo,
	omit,
} from "solid-js";

import { announce, clearAnnouncer } from "../live-announcer";
import {
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	SPIN_BUTTON_INTL_TRANSLATIONS,
	type SpinButtonIntlTranslations,
} from "../spin-button/spin-button.intl";
import { useNumberFieldContext } from "./number-field-context";

export interface NumberFieldInputOptions {
	/** The localized strings of the component. */
	translations?: SpinButtonIntlTranslations;
}

export interface NumberFieldInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	style?: JSX.CSSProperties | string | false;
	ref: T | ((el: T) => void);
	onInput: JSX.EventHandlerUnion<T, InputEvent>;
	onChange: JSX.EventHandlerUnion<T, Event>;
	onWheel: JSX.EventHandlerUnion<T, WheelEvent>;
	onKeyDown?: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocus?: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur?: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	inputMode?: string;
	autocomplete?: string;
	autocorrect?: string;
	spellcheck?: boolean;
}

export interface NumberFieldInputRenderProps extends NumberFieldInputCommonProps {
	type: "text";
	value: string;
	role: "spinbutton";
	required: boolean | undefined;
	disabled: boolean | undefined;
	readonly: boolean | undefined;
	"aria-valuenow": number | string | undefined;
	"aria-valuetext": string | undefined;
	"aria-valuemin": number | undefined;
	"aria-valuemax": number | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
	"aria-invalid": boolean | undefined;
}

export type NumberFieldInputProps<
	T extends ValidComponent | HTMLElement = HTMLInputElement,
> = NumberFieldInputOptions &
	Partial<NumberFieldInputCommonProps<ElementOf<T>>>;

export function NumberFieldInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, NumberFieldInputProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useNumberFieldContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("input"),
			inputMode: "decimal",
			autocomplete: "off",
			autocorrect: "off",
			spellcheck: false,
			translations: SPIN_BUTTON_INTL_TRANSLATIONS,
		},
		props as NumberFieldInputProps,
	);

	const formControlFieldProps = omit(
		mergedProps as typeof mergedProps & { as: ValidComponent },
		"ref", "onInput", "onChange", "onWheel", "onKeyDown", "onFocus", "onBlur",
		"as", "inputMode", "autocomplete", "autocorrect", "spellcheck", "translations",
	);
	const others = omit(
		mergedProps as typeof mergedProps & { as: ValidComponent },
		"ref", "style", "onInput", "onChange", "onWheel", "onKeyDown", "onFocus", "onBlur",
		"as", "id", "aria-label", "aria-labelledby", "aria-describedby", "translations",
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	let isFocused = false;

	// Replace Unicode hyphen-minus with minus sign for VoiceOver; replace empty string with "Empty" for iOS VoiceOver.
	const textValue = createMemo(() => {
		const tv = context.textValue();
		if (tv === "") {
			return mergedProps.translations?.empty;
		}
		return (tv || `${context.value()}`).replace("-", "−");
	});

	const onKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown);

		if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || formControlContext.isReadOnly()) {
			return;
		}

		switch (e.key) {
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: PageUp falls through to ArrowUp
			case "PageUp":
				e.preventDefault();
				context.varyValue(context.largeStep());
				break;
			case "ArrowUp":
			case "Up":
				e.preventDefault();
				context.varyValue(context.step());
				break;
			// biome-ignore lint/suspicious/noFallthroughSwitchClause: PageDown falls through to ArrowDown
			case "PageDown":
				e.preventDefault();
				context.varyValue(-context.largeStep());
				break;
			case "ArrowDown":
			case "Down":
				e.preventDefault();
				context.varyValue(-context.step());
				break;
			case "Home":
				e.preventDefault();
				context.setValue(context.minValue());
				context.format();
				break;
			case "End":
				e.preventDefault();
				context.setValue(context.maxValue());
				context.format();
				break;
		}
	};

	const onFocus: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onFocus);
		isFocused = true;
	};

	const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(e, mergedProps.onBlur);
		isFocused = false;
	};

	createEffect(
		() => textValue(),
		(tv) => {
			if (isFocused) {
				clearAnnouncer("assertive");
				announce(tv ?? "", "assertive");
			}
		},
		{ defer: true },
	);

	const asComponent: ValidComponent = (mergedProps as any).as || "input";

	return (
		<Polymorphic<NumberFieldInputRenderProps>
			as={asComponent}
			role="spinbutton"
			type="text"
			id={fieldProps.id()}
			ref={mergeRefs(context.setInputRef, mergedProps.ref)}
			value={
				Number.isNaN(context.rawValue()) || context.value() === undefined
					? ""
					: context.formatNumber(context.rawValue())
			}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			aria-valuenow={
				context.rawValue() != null && !Number.isNaN(context.rawValue())
					? context.rawValue()
					: undefined
			}
			aria-valuetext={textValue()}
			aria-valuemin={context.minValue()}
			aria-valuemax={context.maxValue()}
			aria-required={formControlContext.isRequired() || undefined}
			aria-disabled={formControlContext.isDisabled() || undefined}
			aria-readonly={formControlContext.isReadOnly() || undefined}
			aria-invalid={formControlContext.validationState() === "invalid" || undefined}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			style={combineStyle({ "touch-action": "none" }, (mergedProps as any).style || undefined)}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
			onChange={(e) => {
				// @ts-ignore: Polymorphic event type
				callHandler(e, mergedProps.onChange);
				context.format();
			}}
			// @ts-ignore: Polymorphic event type
			onWheel={(e) => {
				// @ts-ignore: Polymorphic event type
				callHandler(e, mergedProps.onWheel);
				if (
					!context.changeOnWheel() ||
					document.activeElement !== context.inputRef()
				)
					return;
				e.preventDefault();
				if (e.deltaY < 0) context.varyValue(context.step());
				else context.varyValue(-context.step());
			}}
			onInput={composeEventHandlers([mergedProps.onInput, context.onInput])}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
