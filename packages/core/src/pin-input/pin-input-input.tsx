import {
	EventKey,
	callHandler,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	batch,
	createUniqueId,
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
import type { CollectionItemWithRef } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { type PinInputDataSet, usePinInputContext } from "./pin-input-context";

export interface PinInputInputOptions {}

export interface PinInputInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onBeforeInput: JSX.EventHandlerUnion<T, InputEvent>;
	onInput: JSX.EventHandlerUnion<T, InputEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-label": string | undefined;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export interface PinInputInputRenderProps
	extends PinInputInputCommonProps,
		PinInputDataSet {
	type: string;
	value: string;
	inputMode: string;
	placeholder: string;
	autoCapitalize: "none";
	autoComplete: string;
	required: boolean | undefined;
	disabled: boolean | undefined;
	readonly: boolean | undefined;
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
}

export type PinInputInputProps<
	T extends ValidComponent | HTMLElement = HTMLInputElement,
> = PinInputInputOptions & Partial<PinInputInputCommonProps<ElementOf<T>>>;

export function PinInputInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, PinInputInputProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const context = usePinInputContext();
	const formControlContext = useFormControlContext();

	const mergedProps = mergeDefaultProps(
		{
			id: `${formControlContext.generateId("input")}-${createUniqueId()}`,
		},
		props as PinInputInputProps,
	);

	const [local, formControlFieldProps, others] = splitProps(
		mergedProps,
		["ref", "onBeforeInput", "onInput", "onKeyDown", "onFocus", "onBlur"],
		FORM_CONTROL_FIELD_PROP_NAMES,
	);

	const { fieldProps } = createFormControlField(formControlFieldProps);

	createDomCollectionItem<CollectionItemWithRef>({
		getItem: () => ({
			ref: () => ref,
			disabled: formControlContext.isDisabled()!,
			key: fieldProps.id(),
			textValue: "",
			type: "item",
		}),
	});

	const index = () =>
		ref ? context.inputs().findIndex((v) => v.ref() === ref) : -1;

	const inputType = () => (context.type() === "numeric" ? "tel" : "text");

	const hasValue = () => context.value()[context.focusedIndex()] !== "";
	const valueLength = () => context.value().length;
	const filledValueLength = () =>
		context.value().filter((v) => v?.trim() !== "").length;
	const valueAsString = () => context.value().join("");
	const focusedValue = () => context.value()[context.focusedIndex()] || "";
	const isFinalValue = () =>
		filledValueLength() + 1 === valueLength() &&
		context.value().findIndex((v) => v.trim() === "") ===
			context.focusedIndex();

	const setFocusedValue = (value: string) => {
		const nextValue = getNextValue(focusedValue(), value);
		context.setValue((prev) => {
			return [...replaceIndex(prev, context.focusedIndex(), nextValue)];
		});
	};
	const setPrevFocusedIndex = () =>
		context.setFocusedIndex(Math.max(context.focusedIndex() - 1, 0));
	const setNextFocusedIndex = () =>
		context.setFocusedIndex(
			Math.min(context.focusedIndex() + 1, valueLength() - 1),
		);
	const clearFocusedValue = () =>
		context.setValue((prev) => [
			...replaceIndex(prev, context.focusedIndex(), ""),
		]);

	const ariaLabel = () =>
		[
			fieldProps.ariaLabel(),
			context.translations().inputLabel(index(), valueLength()),
		]
			.filter(Boolean)
			.join(", ");

	const isValidType = (value: string) => {
		if (!context.type()) return true;
		return !!REGEX[context.type()]?.test(value);
	};

	const isValidValue = (value: string) => {
		if (!context.pattern()) return isValidType(value);
		const regex = new RegExp(context.pattern()!, "g");
		return regex.test(value);
	};

	const onBeforeInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (
		e,
	) => {
		callHandler(e, local.onBeforeInput);
		const target = e.currentTarget as HTMLInputElement;
		try {
			const value = getBeforeInputValue(e);
			const isValid = isValidValue(value);
			if (!isValid) {
				e.preventDefault();
			}
			if (value.length > 2) {
				target.setSelectionRange(0, 1, "forward");
			}
		} catch {}
	};

	const onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
		callHandler(e, local.onInput);
		const target = e.currentTarget as HTMLInputElement;

		if (e.inputType === "insertFromPaste" || target.value.length > 2) {
			const startIndex = Math.min(context.focusedIndex(), filledValueLength());
			const left =
				startIndex > 0
					? valueAsString().substring(0, context.focusedIndex())
					: "";
			const right = target.value.substring(0, valueLength() - startIndex);
			const value = left + right;
			batch(() => {
				context.setValue(value.split(""));
				context.setFocusedIndex(
					Math.min(filledValueLength(), valueLength() - 1),
				);
			});

			target.value = target.value[0];
			e.preventDefault();
			return;
		}

		if (e.inputType === "deleteContentBackward") {
			if (hasValue()) {
				clearFocusedValue();
			} else {
				setPrevFocusedIndex();
				clearFocusedValue();
			}
			return;
		}
		if (isFinalValue()) {
			setFocusedValue(target.value);
		} else {
			batch(() => {
				setFocusedValue(target.value);
				setNextFocusedIndex();
			});
		}
		target.value = target.value[0];
	};

	const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = (e) => {
		if (formControlContext.isDisabled() || formControlContext.isReadOnly())
			return;
		callHandler(e, local.onKeyDown);

		switch (e.key) {
			case EventKey.ArrowLeft:
				e.preventDefault();
				setPrevFocusedIndex();
				break;
			case EventKey.ArrowRight:
				e.preventDefault();
				setNextFocusedIndex();
				break;
			case "Delete":
				e.preventDefault();
				if (hasValue()) {
					clearFocusedValue();
				}
				break;
			case "Backspace":
				e.preventDefault();
				if (hasValue()) {
					clearFocusedValue();
				} else {
					setPrevFocusedIndex();
					clearFocusedValue();
				}
				break;
		}
	};

	const onFocus: JSX.EventHandlerUnion<any, FocusEvent> = (e) => {
		callHandler(e, local.onFocus);
		context.setFocusedIndex(index());
	};

	const onBlur: JSX.EventHandlerUnion<any, FocusEvent> = (e) => {
		callHandler(e, local.onBlur);
		context.setFocusedIndex(-1);
	};

	return (
		<Polymorphic<PinInputInputRenderProps>
			as="input"
			id={fieldProps.id()}
			ref={mergeRefs((el) => (ref = el), local.ref)}
			type={context.mask() ? "password" : inputType()}
			value={context.value()[index()] ?? ""}
			inputMode={
				context.otp() || context.type() === "numeric" ? "numeric" : "text"
			}
			placeholder={
				context.focusedIndex() === index() ? "" : context.placeholder()
			}
			autoCapitalize="none"
			autoComplete={context.otp() ? "one-time-code" : "off"}
			required={formControlContext.isRequired()}
			disabled={formControlContext.isDisabled()}
			readonly={formControlContext.isReadOnly()}
			aria-label={ariaLabel()}
			aria-labelledby={fieldProps.ariaLabelledBy()}
			aria-describedby={fieldProps.ariaDescribedBy()}
			aria-invalid={
				formControlContext.validationState() === "invalid" || undefined
			}
			aria-required={formControlContext.isRequired()}
			aria-disabled={formControlContext.isDisabled()}
			aria-readonly={formControlContext.isReadOnly()}
			onBeforeInput={onBeforeInput}
			onInput={onInput}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
			{...context.dataset()}
			{...others}
		/>
	);
}

const REGEX = {
	numeric: /^[0-9]+$/,
	alphabetic: /^[A-Za-z]+$/,
	alphanumeric: /^[a-zA-Z0-9]+$/i,
};

function replaceIndex<T>(array: T[], index: number, value: T) {
	if (array[index] === value) {
		return array;
	}

	return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

function getBeforeInputValue(event: Pick<InputEvent, "currentTarget">) {
	const { selectionStart, selectionEnd, value } =
		event.currentTarget as HTMLInputElement;
	return (
		value.slice(0, selectionStart!) +
		(event as any).data +
		value.slice(selectionEnd!)
	);
}

function getNextValue(current: string, next: string) {
	let nextValue = next;
	if (current[0] === next[0]) nextValue = next[1];
	else if (current[0] === next[1]) nextValue = next[0];
	return nextValue.split("")[nextValue.length - 1];
}
