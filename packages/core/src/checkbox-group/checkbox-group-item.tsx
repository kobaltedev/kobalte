/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/checkbox/src/useCheckboxGroup.ts
 */

import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createUniqueId,
	splitProps,
} from "solid-js";

import {
	Checkbox,
	type CheckboxRootCommonProps,
	type CheckboxRootOptions,
	type CheckboxRootRenderProps,
	type CheckboxRootState,
} from "../checkbox";
import {
	FORM_CONTROL_PROP_NAMES,
	useFormControlContext,
} from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

import { useCheckboxGroupContext } from "./checkbox-group-context";

interface CheckboxGroupItemState extends CheckboxRootState {}

export interface CheckboxGroupItemOptions extends CheckboxRootOptions {}

export interface CheckboxGroupItemCommonProps<
	T extends HTMLElement = HTMLElement,
> extends CheckboxRootCommonProps {}

export interface CheckboxGroupItemRenderProps
	extends CheckboxRootRenderProps,
		CheckboxGroupItemCommonProps {}

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

	const checkboxGroupContext = useCheckboxGroupContext();
	const formControlContext = useFormControlContext();

	const defaultId = checkboxGroupContext.generateId(`item-${createUniqueId()}`);

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as CheckboxGroupItemProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"value",
		"validationState",
		"disabled",
		"name",
		"required",
		"readOnly",
		"ref",
	]);

	const isChecked = () => {
		return checkboxGroupContext.isValueSelected(local.value!);
	};
	const value = () => local.value!;

	return (
		<Checkbox<
			Component<
				Omit<CheckboxGroupItemRenderProps, keyof CheckboxRootRenderProps>
			>
		>
			noRole
			ref={mergeRefs((el) => (ref = el), local.ref)}
			onChange={(s) => checkboxGroupContext.handleValue(local.value!)}
			checked={isChecked()}
			defaultChecked={isChecked()}
			value={value()}
			aria-invalid={
				formControlContext.validationState() === "invalid" ||
				local.validationState ||
				undefined
			}
			name={formControlContext.name() || local.name}
			disabled={formControlContext.isDisabled() || local.disabled || undefined}
			required={formControlContext.isRequired() || local.required || undefined}
			readOnly={formControlContext.isReadOnly() || local.readOnly || undefined}
			aria-required={
				formControlContext.isRequired() || local.required || undefined
			}
			aria-disabled={
				formControlContext.isDisabled() || local.disabled || undefined
			}
			aria-readonly={
				formControlContext.isReadOnly() || local.readOnly || undefined
			}
			validationState={
				formControlContext.validationState() ||
				local.validationState ||
				undefined
			}
			{...formControlContext.dataset()}
			{...others}
		/>
	);
}
