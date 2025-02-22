/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */

import {
	type Orientation,
	type ValidationState,
	access,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { type ValidComponent, createUniqueId, splitProps } from "solid-js";

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
import {
	createControllableSignal,
	createFormResetListener,
} from "../primitives";
import {
	RadioGroupContext,
	type RadioGroupContextValue,
} from "./radio-group-context";

export interface RadioGroupRootOptions {
	/** The controlled value of the radio button to check. */
	value?: string;

	/**
	 * The value of the radio button that should be checked when initially rendered.
	 * Useful when you do not need to control the state of the radio buttons.
	 */
	defaultValue?: string;

	/** Event handler called when the value changes. */
	onChange?: (value: string) => void;

	/** The axis the radio group items should align with. */
	orientation?: Orientation;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the radio group.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the radio group should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must select an item before the owning form can be submitted. */
	required?: boolean;

	/** Whether the radio group is disabled. */
	disabled?: boolean;

	/** Whether the radio group is read only. */
	readOnly?: boolean;
}

export interface RadioGroupRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
}

export interface RadioGroupRootRenderProps
	extends RadioGroupRootCommonProps,
		FormControlDataSet {
	role: "radiogroup";
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
	"aria-orientation": Orientation | undefined;
}

export type RadioGroupRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RadioGroupRootOptions & Partial<RadioGroupRootCommonProps<ElementOf<T>>>;

/**
 * A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.
 * This component is based on the [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/)
 */
export function RadioGroupRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioGroupRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `radiogroup-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			orientation: "vertical",
		},
		props as RadioGroupRootProps,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"value",
			"defaultValue",
			"onChange",
			"orientation",
			"aria-labelledby",
			"aria-describedby",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const [selected, setSelected] = createControllableSignal<string>({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: (value) => local.onChange?.(value),
	});

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(
		() => ref,
		() => setSelected(local.defaultValue ?? ""),
	);

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			access(formControlProps.id),
			others["aria-label"],
			local["aria-labelledby"],
		);
	};

	const ariaDescribedBy = () => {
		return formControlContext.getAriaDescribedBy(local["aria-describedby"]);
	};

	const isDefaultValue = (value: string) => {
		return value === props.defaultValue;
	};

	const isSelectedValue = (value: string) => {
		return value === selected();
	};

	const setSelectedValue = (value: string) => {
		if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
			return;
		}

		setSelected(value);

		// Sync all radio input checked state in the group with the selected value.
		// This is necessary because checked state might be out of sync
		// (ex: when using controlled radio-group).
		if (ref)
			for (const el of ref.querySelectorAll("[type='radio']")) {
				const radio = el as HTMLInputElement;
				radio.checked = isSelectedValue(radio.value);
			}
	};

	const context: RadioGroupContextValue = {
		ariaDescribedBy,
		isDefaultValue,
		isSelectedValue,
		setSelectedValue,
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<RadioGroupContext.Provider value={context}>
				<Polymorphic<RadioGroupRootRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el), local.ref)}
					role="radiogroup"
					id={access(formControlProps.id)!}
					aria-invalid={
						formControlContext.validationState() === "invalid" || undefined
					}
					aria-required={formControlContext.isRequired() || undefined}
					aria-disabled={formControlContext.isDisabled() || undefined}
					aria-readonly={formControlContext.isReadOnly() || undefined}
					aria-orientation={local.orientation}
					aria-labelledby={ariaLabelledBy()}
					aria-describedby={ariaDescribedBy()}
					{...formControlContext.dataset()}
					{...others}
				/>
			</RadioGroupContext.Provider>
		</FormControlContext.Provider>
	);
}
