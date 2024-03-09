import {
	OverrideComponentProps,
	callHandler,
	composeEventHandlers,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { onMount, splitProps } from "solid-js";

import {
	FORM_CONTROL_FIELD_PROP_NAMES,
	createFormControlField,
	useFormControlContext,
} from "../form-control";
import { As, AsChildProp } from "../polymorphic";
import * as SpinButton from "../spin-button";
import { useNumberFieldContext } from "./number-field-context";

export interface NumberFieldInputProps
	extends Omit<
		OverrideComponentProps<"input", AsChildProp>,
		"value" | "step"
	> {}

export function NumberFieldInput(props: NumberFieldInputProps) {
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
		props,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["ref", "onInput", "onChange", "onWheel"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	return (
		<SpinButton.Root
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
			asChild
		>
			{/* @ts-ignore: Polymorphic error */}
			<As
				component={"input"}
				type="text"
				// @ts-ignore: Polymorphic error
				ref={mergeRefs(context.setInputRef, local.ref)}
				id={fieldProps.id()}
				value={
					Number.isNaN(context.rawValue())
						? ""
						: context.formatNumber(context.rawValue())
				}
				required={formControlContext.isRequired()}
				disabled={formControlContext.isDisabled()}
				readOnly={formControlContext.isReadOnly()}
				aria-label={fieldProps.ariaLabel()}
				aria-labelledby={fieldProps.ariaLabelledBy()}
				aria-describedby={fieldProps.ariaDescribedBy()}
				onInput={composeEventHandlers([local.onInput, context.onInput])}
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
				{...formControlContext.dataset()}
				{...others}
			/>
		</SpinButton.Root>
	);
}
