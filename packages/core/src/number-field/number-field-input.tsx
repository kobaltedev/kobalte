import {
	callHandler,
	composeEventHandlers,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Component,
	type JSX,
	type ValidComponent,
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
	PolymorphicCallbackProps,
	type PolymorphicProps,
} from "../polymorphic";
import * as SpinButton from "../spin-button";
import { useNumberFieldContext } from "./number-field-context";

export interface NumberFieldInputOptions {}

export interface NumberFieldInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onInput: JSX.EventHandlerUnion<T, InputEvent>;
	onChange: JSX.EventHandlerUnion<T, Event>;
	onWheel: JSX.EventHandlerUnion<T, WheelEvent>;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	inputMode?: string;
	autocomplete?: string;
	autocorrect?: string;
	spellcheck?: boolean;
}

export interface NumberFieldInputRenderProps
	extends NumberFieldInputCommonProps,
		SpinButton.SpinButtonRootRenderProps {
	type: "text";
	value: string;
	required: boolean | undefined;
	disabled: boolean | undefined;
	readOnly: boolean | undefined;
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
		},
		props as NumberFieldInputProps,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps as typeof mergedProps & { as: ValidComponent },
		["ref", "onInput", "onChange", "onWheel", "as"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	return (
		<SpinButton.Root<
			Component<
				Omit<
					NumberFieldInputRenderProps,
					| keyof SpinButton.SpinButtonRootRenderProps
					| "value"
					| "required"
					| "disabled"
					| "readOnly"
				>
			>
		>
			type="text"
			id={fieldProps.id()}
			ref={mergeRefs(context.setInputRef, local.ref)}
			value={context.value()}
			validationState={formControlContext.validationState()}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readOnly={formControlContext.isReadOnly()}
			textValue={context.textValue()}
			minValue={context.minValue()}
			maxValue={context.maxValue()}
			onIncrement={() => {
				context.varyValue(context.step());
			}}
			onIncrementPage={() => {
				context.varyValue(context.largeStep());
			}}
			onIncrementToMax={() => {
				context.setValue(context.maxValue());
				context.format();
			}}
			onDecrement={() => {
				context.varyValue(-context.step());
			}}
			onDecrementPage={() => {
				context.varyValue(-context.largeStep());
			}}
			onDecrementToMin={() => {
				context.setValue(context.minValue());
				context.format();
			}}
			translations={context.translations()}
			onChange={(e) => {
				// @ts-ignore: Polymorphic error
				callHandler(e, local.onChange);

				// format on change end
				context.format();
			}}
			// @ts-ignore: Polymorphic error
			onWheel={(e) => {
				// @ts-ignore: Polymorphic error
				callHandler(e, local.onWheel);

				if (
					!context.changeOnWheel() ||
					document.activeElement !== context.inputRef()
				)
					return;

				e.preventDefault();

				if (e.deltaY < 0) context.varyValue(context.step());
				else context.varyValue(-context.step());
			}}
			onInput={composeEventHandlers([local.onInput, context.onInput])}
			aria-label={fieldProps.ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			{...formControlContext.dataset()}
			as={(props) => (
				<Polymorphic<
					Omit<
						Pick<
							NumberFieldInputRenderProps,
							"required" | "disabled" | "readOnly" | "value"
						>,
						keyof SpinButton.SpinButtonRootRenderProps
					>
				>
					as={local.as || "input"}
					value={
						Number.isNaN(context.rawValue()) || context.value() === undefined
							? ""
							: context.formatNumber(context.rawValue())
					}
					required={formControlContext.isRequired()}
					disabled={formControlContext.isDisabled()}
					readOnly={formControlContext.isReadOnly()}
					{...props}
					{...others}
				/>
			)}
		/>
	);
}
