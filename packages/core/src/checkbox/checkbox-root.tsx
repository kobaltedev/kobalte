/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/checkbox/src/useCheckbox.ts
 */

import {
	OverrideComponentProps,
	type ValidationState,
	access,
	callHandler,
	createGenerateId,
	isFunction,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Accessor,
	type JSX,
	type ValidComponent,
	children,
	createMemo,
	createSignal,
	createUniqueId,
	splitProps,
} from "solid-js";

import {
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
	createFormControl,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createFormResetListener, createToggleState } from "../primitives";
import {
	CheckboxContext,
	type CheckboxContextValue,
	type CheckboxDataSet,
} from "./checkbox-context";

interface CheckboxRootState {
	/** Whether the checkbox is checked or not. */
	checked: Accessor<boolean>;

	/** Whether the checkbox is in an indeterminate state. */
	indeterminate: Accessor<boolean>;
}

export interface CheckboxRootOptions {
	/** The controlled checked state of the checkbox. */
	checked?: boolean;

	/**
	 * The default checked state when initially rendered.
	 * Useful when you do not need to control the checked state.
	 */
	defaultChecked?: boolean;

	/** Event handler called when the checked state of the checkbox changes. */
	onChange?: (checked: boolean) => void;

	/**
	 * Whether the checkbox is in an indeterminate state.
	 * Indeterminism is presentational only.
	 * The indeterminate visual representation remains regardless of user interaction.
	 */
	indeterminate?: boolean;

	/**
	 * The value of the checkbox, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
	 */
	value?: string;

	/**
	 * The name of the checkbox, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
	 */
	name?: string;

	/** Whether the checkbox should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must check the checkbox before the owning form can be submitted. */
	required?: boolean;

	/** Whether the checkbox is disabled. */
	disabled?: boolean;

	/** Whether the checkbox is read only. */
	readOnly?: boolean;

	/**
	 * The children of the checkbox.
	 * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
	 */
	children?: JSX.Element | ((state: CheckboxRootState) => JSX.Element);
}

export interface CheckboxRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface CheckboxRootRenderProps
	extends CheckboxRootCommonProps,
		FormControlDataSet,
		CheckboxDataSet {
	children: JSX.Element;
	role: "group";
}

export type CheckboxRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxRootOptions & Partial<CheckboxRootCommonProps<ElementOf<T>>>;

/**
 * A control that allows the user to toggle between checked and not checked.
 */
export function CheckboxRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `checkbox-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			value: "on",
			id: defaultId,
		},
		props as CheckboxRootProps,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"children",
			"value",
			"checked",
			"defaultChecked",
			"indeterminate",
			"onChange",
			"onPointerDown",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
	const [isFocused, setIsFocused] = createSignal(false);

	const { formControlContext } = createFormControl(formControlProps);

	const state = createToggleState({
		isSelected: () => local.checked,
		defaultIsSelected: () => local.defaultChecked,
		onSelectedChange: (selected) => local.onChange?.(selected),
		isDisabled: () => formControlContext.isDisabled(),
		isReadOnly: () => formControlContext.isReadOnly(),
	});

	createFormResetListener(
		() => ref,
		() => state.setIsSelected(local.defaultChecked ?? false),
	);

	const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerDown);

		// For consistency with native, prevent the input blurs on pointer down.
		if (isFocused()) {
			e.preventDefault();
		}
	};

	const dataset: Accessor<CheckboxDataSet> = createMemo(() => ({
		"data-checked": state.isSelected() ? "" : undefined,
		"data-indeterminate": local.indeterminate ? "" : undefined,
	}));

	const context: CheckboxContextValue = {
		value: () => local.value!,
		dataset,
		checked: () => state.isSelected(),
		indeterminate: () => local.indeterminate ?? false,
		inputRef,
		generateId: createGenerateId(() => access(formControlProps.id)!),
		toggle: () => state.toggle(),
		setIsChecked: (isChecked) => state.setIsSelected(isChecked),
		setIsFocused,
		setInputRef,
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<CheckboxContext.Provider value={context}>
				<Polymorphic<CheckboxRootRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el), local.ref)}
					role="group"
					id={access(formControlProps.id)}
					onPointerDown={onPointerDown}
					{...formControlContext.dataset()}
					{...dataset()}
					{...others}
				>
					<CheckboxRootChild state={context}>
						{local.children}
					</CheckboxRootChild>
				</Polymorphic>
			</CheckboxContext.Provider>
		</FormControlContext.Provider>
	);
}

interface CheckboxRootChildProps extends Pick<CheckboxRootOptions, "children"> {
	state: CheckboxRootState;
}

function CheckboxRootChild(props: CheckboxRootChildProps) {
	const resolvedChildren = children(() => {
		const body = props.children;
		return isFunction(body) ? body(props.state) : body;
	});

	return <>{resolvedChildren()}</>;
}
