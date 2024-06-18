/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/switch/src/useSwitch.ts
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
	SwitchContext,
	type SwitchContextValue,
	type SwitchDataSet,
} from "./switch-context";

interface SwitchRootState {
	/** Whether the switch is checked or not. */
	checked: Accessor<boolean>;
}

export interface SwitchRootOptions {
	/** The controlled checked state of the switch. */
	checked?: boolean;

	/**
	 * The default checked state when initially rendered.
	 * Useful when you do not need to control the checked state.
	 */
	defaultChecked?: boolean;

	/** Event handler called when the checked state of the switch changes. */
	onChange?: (isChecked: boolean) => void;

	/**
	 * The value of the switch, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
	 */
	value?: string;

	/**
	 * The name of the switch, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
	 */
	name?: string;

	/** Whether the switch should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must check the switch before the owning form can be submitted. */
	required?: boolean;

	/** Whether the switch is disabled. */
	disabled?: boolean;

	/** Whether the switch is read only. */
	readOnly?: boolean;

	/**
	 * The children of the switch.
	 * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
	 */
	children?: JSX.Element | ((state: SwitchRootState) => JSX.Element);
}

export interface SwitchRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface SwitchRootRenderProps
	extends SwitchRootCommonProps,
		SwitchDataSet,
		FormControlDataSet {
	role: "group";
	children: JSX.Element;
}

export type SwitchRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SwitchRootOptions & Partial<SwitchRootCommonProps<ElementOf<T>>>;

/**
 * A control that allows users to choose one of two values: on or off.
 */
export function SwitchRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SwitchRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `switch-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			value: "on",
			id: defaultId,
		},
		props as SwitchRootProps,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"children",
			"value",
			"checked",
			"defaultChecked",
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

	const dataset: Accessor<SwitchDataSet> = createMemo(() => ({
		"data-checked": state.isSelected() ? "" : undefined,
	}));

	const context: SwitchContextValue = {
		value: () => local.value!,
		dataset,
		checked: () => state.isSelected(),
		inputRef,
		generateId: createGenerateId(() => access(formControlProps.id)!),
		toggle: () => state.toggle(),
		setIsChecked: (isChecked) => state.setIsSelected(isChecked),
		setIsFocused,
		setInputRef,
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<SwitchContext.Provider value={context}>
				<Polymorphic<SwitchRootRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el), local.ref)}
					role="group"
					id={access(formControlProps.id)}
					onPointerDown={onPointerDown}
					{...formControlContext.dataset()}
					{...dataset()}
					{...others}
				>
					<SwitchRootChild state={context}>{local.children}</SwitchRootChild>
				</Polymorphic>
			</SwitchContext.Provider>
		</FormControlContext.Provider>
	);
}

interface SwitchRootChildProps extends Pick<SwitchRootOptions, "children"> {
	state: SwitchRootState;
}

function SwitchRootChild(props: SwitchRootChildProps) {
	const resolvedChildren = children(() => {
		const body = props.children;
		return isFunction(body) ? body(props.state) : body;
	});

	return <>{resolvedChildren()}</>;
}
