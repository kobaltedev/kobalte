import {
	type Orientation,
	type ValidationState,
	access,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { type ValidComponent } from "@solidjs/web";
import { createSignal, createUniqueId, omit } from "solid-js";

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
	type CollectionItemWithRef,
	createControllableSignal,
	createFormResetListener,
} from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import {
	RatingGroupContext,
	type RatingGroupContextValue,
} from "./rating-group-context";

export interface RatingGroupRootOptions {
	/** The current rating value. */
	value?: number;

	/**
	 * The initial value of the rating group when it is first rendered.
	 * Use when you do not need to control the state of the rating group.
	 */
	defaultValue?: number;

	/** Event handler called when the value changes. */
	onChange?: (value: number) => void;

	/** Whether to allow half ratings. */
	allowHalf?: boolean;

	/** The axis the rating group items should align with. */
	orientation?: Orientation;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the rating group.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the rating group should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must select an item before the owning form can be submitted. */
	required?: boolean;

	/** Whether the rating group is disabled. */
	disabled?: boolean;

	/** Whether the rating group is read only. */
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
	"aria-invalid": "true" | undefined;
	"aria-required": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-readonly": "true" | undefined;
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
		},
		props as RatingGroupRootProps,
	);

	const formControlProps = omit(mergedProps, "ref", "value", "defaultValue", "onChange", "allowHalf", "orientation", "aria-labelledby", "aria-describedby");
	const others = omit(mergedProps, "ref", "value", "defaultValue", "onChange", "allowHalf", "orientation", "aria-labelledby", "aria-describedby", ...FORM_CONTROL_PROP_NAMES);

	const [items, setItems] = createSignal<CollectionItemWithRef[]>([]);
	const { DomCollectionProvider } = createDomCollection({
		items,
		onItemsChange: setItems,
	});

	const [hoveredValue, setHoveredValue] = createSignal(-1);

	const [value, setValue] = createControllableSignal<number>({
		value: () => mergedProps.value,
		defaultValue: () => mergedProps.defaultValue ?? 0,
		onChange: (value) => mergedProps.onChange?.(value),
	});

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(
		() => ref,
		() => setValue(mergedProps.defaultValue!),
	);

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			access(mergedProps.id),
			others["aria-label"],
			mergedProps["aria-labelledby"],
		);
	};

	const ariaDescribedBy = () => {
		return formControlContext.getAriaDescribedBy(mergedProps["aria-describedby"]);
	};

	const context: RatingGroupContextValue = {
		value,
		setValue: (newValue) => {
			if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
				return;
			}

			setValue(newValue);
		},
		allowHalf: () => mergedProps.allowHalf,
		orientation: () => mergedProps.orientation!,
		hoveredValue,
		setHoveredValue,
		isHovering: () => hoveredValue() > -1,
		ariaDescribedBy,
		items,
		setItems,
	};

	return (
		<DomCollectionProvider>
			<FormControlContext value={formControlContext}>
				<RatingGroupContext value={context}>
					<Polymorphic<RatingGroupRootRenderProps>
						as="div"
						ref={mergeRefs((el) => (ref = el), mergedProps.ref)}
						role="radiogroup"
						id={access(mergedProps.id)!}
						aria-invalid={
							formControlContext.validationState() === "invalid" ? "true" : undefined
						}
						aria-required={formControlContext.isRequired() ? "true" : undefined}
						aria-disabled={formControlContext.isDisabled() ? "true" : undefined}
						aria-readonly={formControlContext.isReadOnly() ? "true" : undefined}
						aria-orientation={mergedProps.orientation}
						aria-labelledby={ariaLabelledBy()}
						aria-describedby={ariaDescribedBy()}
						{...formControlContext.dataset()}
						{...others}
					/>
				</RatingGroupContext>
			</FormControlContext>
		</DomCollectionProvider>
	);
}
