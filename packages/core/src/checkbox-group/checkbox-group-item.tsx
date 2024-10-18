/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/checkbox/src/useCheckboxGroup.ts
 */

import {
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

import type {
	CheckboxRootCommonProps,
	CheckboxRootOptions,
	CheckboxRootRenderProps,
	CheckboxRootState,
} from "../checkbox";
import {
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	createFormControl,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createFormResetListener, createToggleState } from "../primitives";
import { useCheckboxGroupContext } from "./checkbox-group-context";
import {
	CheckboxGroupItemContext,
	type CheckboxGroupItemContextValue,
	type CheckboxGroupItemDataSet,
} from "./checkbox-group-item-context";

interface CheckboxGroupItemState extends CheckboxRootState {}

export interface CheckboxGroupItemOptions extends CheckboxRootOptions {}

export interface CheckboxGroupItemCommonProps<
	T extends HTMLElement = HTMLElement,
> extends CheckboxRootCommonProps {}

export interface CheckboxGroupItemRenderProps
	extends Omit<CheckboxRootRenderProps, "role">,
		CheckboxGroupItemCommonProps,
		CheckboxGroupItemDataSet {}

export type CheckboxGroupItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxGroupItemOptions &
	Partial<CheckboxGroupItemCommonProps<ElementOf<T>>>;

/**
 * A control that allows the user to toggle between checked and not checked.
 */
export function CheckboxGroupItem<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxGroupItemProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `item-${createUniqueId()}`;
	const checkboxGroupContext = useCheckboxGroupContext();

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as CheckboxGroupItemProps,
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
		isSelected: () =>
			checkboxGroupContext.isSelectedValue(local.value ?? "") ||
			local.checked ||
			false,
		defaultIsSelected: () =>
			checkboxGroupContext.isSelectedValue(local.value ?? "") ||
			local.defaultChecked ||
			false,
		onSelectedChange: (selected) => local.onChange?.(selected),
		isDisabled: () => formControlContext.isDisabled(),
		isReadOnly: () => formControlContext.isReadOnly(),
	});

	createFormResetListener(
		() => ref,
		() =>
			state.setIsSelected(
				checkboxGroupContext.isSelectedValue(local.value ?? "") ||
					local.defaultChecked ||
					false,
			),
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

	const dataset: Accessor<CheckboxGroupItemDataSet> = createMemo(() => ({
		"data-checked": state.isSelected() ? "" : undefined,
		"data-indeterminate": local.indeterminate ? "" : undefined,
	}));

	const context: CheckboxGroupItemContextValue = {
		value: () => local.value!,
		dataset,
		checked: () => state.isSelected(),
		indeterminate: () => local.indeterminate ?? false,
		inputRef,
		generateId: createGenerateId(() => access(formControlProps.id)!),
		toggle: () => {
			state.toggle();
			if (local.value) checkboxGroupContext.setSelectedValue(local.value);
		},
		setIsChecked: (isChecked) => state.setIsSelected(isChecked),
		setIsFocused,
		setInputRef,
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<CheckboxGroupItemContext.Provider value={context}>
				<Polymorphic<CheckboxGroupItemRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el), local.ref)}
					id={access(formControlProps.id)}
					onPointerDown={onPointerDown}
					{...formControlContext.dataset()}
					{...dataset()}
					{...others}
				>
					<CheckboxGroupItemChild state={context}>
						{local.children}
					</CheckboxGroupItemChild>
				</Polymorphic>
			</CheckboxGroupItemContext.Provider>
		</FormControlContext.Provider>
	);
}

interface CheckboxGroupItemChildProps
	extends Pick<CheckboxGroupItemOptions, "children"> {
	state: CheckboxGroupItemState;
}

function CheckboxGroupItemChild(props: CheckboxGroupItemChildProps) {
	const resolvedChildren = children(() => {
		const body = props.children;
		return isFunction(body) ? body(props.state) : body;
	});

	return <>{resolvedChildren()}</>;
}
