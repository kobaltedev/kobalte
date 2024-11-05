/*
 * Portions of this file are based on code from chakra-ui/zag
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/tree/main/packages/machines/rating-group
 */

import {
	type Orientation,
	type ValidationState,
	access,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type ValidComponent,
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
import {
	createControllableSignal,
	createFormResetListener,
	createRegisterId,
} from "../primitives";

import {
	RatingGroupContext,
	type RatingGroupContextValue,
} from "./rating-group-context";

export interface RatingGroupRootOptions {
	/** The total number of rating items to display. */
	count?: number;

	/** If true, allows selecting half-values. */
	allowHalf?: boolean;

	/** The controlled value of the rating to check. */
	value?: number;

	/**
	 * The initial rating value when the component is first rendered.
	 * Useful for uncontrolled components where the rating state is managed internally.
	 */
	defaultValue?: number;

	/** Event handler called when the rating value changes. */
	onChange?: (value: number) => void;

	/** Specifies the alignment axis for rating items: horizontal or vertical. */
	orientation?: Orientation;

	/**
	 * A unique identifier for the rating group component.
	 * Used to generate `id` attributes for nested elements.
	 * If omitted, a generated ID will be used.
	 */
	id?: string;

	/**
	 * The name attribute for the rating group.
	 * Included in form submissions as part of a name/value pair.
	 */
	name?: string;

	/** Determines the visual styling state of the rating group as "valid" or "invalid". */
	validationState?: ValidationState;

	/** Indicates whether the user is required to select a rating before form submission. */
	required?: boolean;

	/** Disables all interactions with the rating group if set to true. */
	disabled?: boolean;

	/** Makes the rating group read-only, so it displays a value but can't be modified. */
	readOnly?: boolean;
}

export interface RatingGroupRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
}

export interface RatingGroupRootRenderProps
	extends RatingGroupRootCommonProps,
		FormControlDataSet {
	role: "radiogroup";
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
	"aria-orientation": Orientation | undefined;
}

export type RatingGroupRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingGroupRootOptions & Partial<RatingGroupRootCommonProps<ElementOf<T>>>;

export function RatingGroupRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingGroupRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `ratinggroup-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			orientation: "horizontal",
			allowHalf: false,
		},
		props as RatingGroupRootProps,
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
			"allowHalf",
			"count",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const [selected, setSelected] = createControllableSignal<number>({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: (value) => local.onChange?.(value),
	});

	const [hovered, setHovered] = createSignal<number>(local.defaultValue!);
	const [isInteractive, setIsInteractive] = createSignal<boolean>(false);

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(
		() => ref,
		() => {
			setSelected(local.defaultValue!);
			setHovered(local.defaultValue!);
		},
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

	const isSelectedValue = (value: number) => {
		return value === selected();
	};

	const isHoveredValue = (value: number) => {
		if (isInteractive()) {
			return value <= hovered();
		}
		return value <= selected()!;
	};

	const context: RatingGroupContextValue = {
		allowHalf: () => local.allowHalf!,
		orientation: () => local.orientation!,
		value: () => selected()!,
		count: () => local.count!,

		ariaDescribedBy,

		isSelectedValue,
		setSelectedValue: (value: number) => {
			if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
				return;
			}
			setSelected(value);
		},

		isHoveredValue,
		hoveredValue: () => hovered()!,
		setHoveredValue: (value: number) => {
			if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
				return;
			}
			setHovered(value);
		},

		setIsInteractive,
		isInteractive,
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<RatingGroupContext.Provider value={context}>
				<Polymorphic<RatingGroupRootRenderProps>
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
			</RatingGroupContext.Provider>
		</FormControlContext.Provider>
	);
}
