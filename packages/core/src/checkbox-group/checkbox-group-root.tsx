/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/checkbox/src/useCheckboxGroup.ts
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-stately/checkbox/src/useCheckboxGroupState.ts
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
	CheckboxGroupContext,
	type CheckboxGroupContextValue,
} from "./checkbox-group-context";

export interface CheckboxGroupRootOptions {
	/** The controlled values of the checkboxes to check. */
	values?: string[];

	/**
	 * The value of the checkboxes that should be checked when initially rendered.
	 * Useful when you do not need to control the state of the Checkboxes.
	 */
	defaultValues?: string[];

	/** Event handler called when the value changes. */
	onChange?: (value: string[]) => void;

	/** The axis the checkbox group items should align with. */
	orientation?: Orientation;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the checkbox group.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the checkbox group should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must select an item before the owning form can be submitted. */
	required?: boolean;

	/** Whether the checkbox group is disabled. */
	disabled?: boolean;

	/** Whether the checkbox group is read only. */
	readOnly?: boolean;
}

export interface CheckboxGroupRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
}

export interface CheckboxGroupRootRenderProps
	extends CheckboxGroupRootCommonProps,
		FormControlDataSet {
	role: "group";
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
	"aria-orientation": Orientation | undefined;
}

export type CheckboxGroupRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxGroupRootOptions &
	Partial<CheckboxGroupRootCommonProps<ElementOf<T>>>;

/**
 * A set of checkboxes, where more than one of the checkbox can be checked at a time.
 */
export function CheckboxGroupRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxGroupRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `checkboxgroup-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			orientation: "vertical",
		},
		props as CheckboxGroupRootProps,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"values",
			"defaultValues",
			"onChange",
			"orientation",
			"aria-labelledby",
			"aria-describedby",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const [selected, setSelected] = createControllableSignal<string[]>({
		value: () => local.values,
		defaultValue: () => local.defaultValues,
		onChange: (value) => local.onChange?.(value),
	});

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(
		() => ref,
		() => setSelected(local.defaultValues ?? []),
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

	const isSelectedValue = (value: string) => {
		return selected()?.includes(value) || false;
	};

	const context: CheckboxGroupContextValue = {
		ariaDescribedBy,
		isSelectedValue,
		setSelectedValue: (value) => {
			if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
				return;
			}

			const selectedValues = selected() || [];
			if (isSelectedValue(value)) {
				setSelected(selectedValues.filter((val) => val !== value));
			} else setSelected([...selectedValues, value]);

			// Sync all checkbox inputs' checked state in the group with the selected values.
			// This ensures the checked state is in sync (e.g., when using a controlled checkbox group).
			if (ref) {
				for (const el of ref.querySelectorAll("[type='checkbox']")) {
					const checkbox = el as HTMLInputElement;
					checkbox.checked = selectedValues.includes(checkbox.value);
				}
			}
		},
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<CheckboxGroupContext.Provider value={context}>
				<Polymorphic<CheckboxGroupRootRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el), local.ref)}
					role="group"
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
			</CheckboxGroupContext.Provider>
		</FormControlContext.Provider>
	);
}
