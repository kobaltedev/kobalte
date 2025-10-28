import {
	type Orientation,
	type ValidationState,
	access,
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
	type CollectionItemWithRef,
	createControllableSignal,
	createFormResetListener,
} from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { RatingContext, type RatingContextValue } from "./rating-context";

export interface RatingRootOptions {
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

export interface RatingRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
}

export interface RatingRootRenderProps
	extends RatingRootCommonProps,
		FormControlDataSet {
	role: "radiogroup";
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
	"aria-orientation": Orientation | undefined;
}

export type RatingRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingRootOptions & Partial<RatingRootCommonProps<ElementOf<T>>>;

export function RatingRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `Rating-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			orientation: "horizontal",
		},
		props as RatingRootProps,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"value",
			"defaultValue",
			"onChange",
			"allowHalf",
			"orientation",
			"aria-labelledby",
			"aria-describedby",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const [items, setItems] = createSignal<CollectionItemWithRef[]>([]);
	const { DomCollectionProvider } = createDomCollection({
		items,
		onItemsChange: setItems,
	});

	const [hoveredValue, setHoveredValue] = createSignal(-1);

	const [value, setValue] = createControllableSignal<number>({
		value: () => local.value,
		defaultValue: () => local.defaultValue ?? 0,
		onChange: (value) => local.onChange?.(value),
	});

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(
		() => ref,
		() => setValue(local.defaultValue!),
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

	const context: RatingContextValue = {
		value,
		setValue: (newValue) => {
			if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
				return;
			}

			setValue(newValue);
		},
		allowHalf: () => local.allowHalf,
		orientation: () => local.orientation!,
		hoveredValue,
		setHoveredValue,
		isHovering: () => hoveredValue() > -1,
		ariaDescribedBy,
		items,
		setItems,
	};

	return (
		<DomCollectionProvider>
			<FormControlContext.Provider value={formControlContext}>
				<RatingContext.Provider value={context}>
					<Polymorphic<RatingRootRenderProps>
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
				</RatingContext.Provider>
			</FormControlContext.Provider>
		</DomCollectionProvider>
	);
}
