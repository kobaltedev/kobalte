import { access, type Orientation, type ValidationState } from "@kobalte/utils";
import { createFormResetListener } from "@solid-primitives/form";
import type { ValidComponent } from "@solidjs/web";
import { createSignal, createUniqueId, merge, omit, type Ref } from "solid-js";
import {
	createFormControl,
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
} from "../form-control/index.ts";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { createDomCollection } from "../primitives/create-dom-collection/index.ts";
import {
	type CollectionItemWithRef,
	createControllableSignal,
} from "../primitives/index.ts";
import { RatingContext, type RatingContextValue } from "./rating-context.tsx";

export interface RatingRootOptions {
	/** The current rating value. */
	value?: number;

	/**
	 * The initial value of the rating when it is first rendered.
	 * Use when you do not need to control the state of the rating.
	 */
	defaultValue?: number;

	/** Event handler called when the value changes. */
	onChange?: (value: number) => void;

	/** Whether to allow half ratings. */
	allowHalf?: boolean;

	/** The axis the rating items should align with. */
	orientation?: Orientation;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the rating.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the rating should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must select an item before the owning form can be submitted. */
	required?: boolean;

	/** Whether the rating is disabled. */
	disabled?: boolean;

	/** Whether the rating is read only. */
	readOnly?: boolean;
}

export interface RatingRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: Ref<T>;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
}

export interface RatingRootRenderProps
	extends RatingRootCommonProps,
		FormControlDataSet {
	role: "radiogroup";
	"aria-invalid": "true" | undefined;
	"aria-required": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-readonly": "true" | undefined;
	"aria-orientation": Orientation | undefined;
}

export type RatingRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RatingRootOptions & Partial<RatingRootCommonProps<ElementOf<T>>>;

export function RatingRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RatingRootProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const defaultId = `Rating-${createUniqueId()}`;

	const mergedProps = merge(
		{
			id: defaultId,
			orientation: "horizontal",
		} as const,
		props as RatingRootProps,
	);

	const formControlProps = omit(
		mergedProps,
		"ref",
		"value",
		"defaultValue",
		"onChange",
		"allowHalf",
		"orientation",
		"aria-labelledby",
		"aria-describedby",
	);
	const others = omit(
		mergedProps,
		"ref",
		"value",
		"defaultValue",
		"onChange",
		"allowHalf",
		"orientation",
		"aria-labelledby",
		"aria-describedby",
		...FORM_CONTROL_PROP_NAMES,
	);

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

	createFormResetListener(ref, () => setValue(mergedProps.defaultValue!));

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			access(mergedProps.id),
			others["aria-label"],
			mergedProps["aria-labelledby"],
		);
	};

	const ariaDescribedBy = () => {
		return formControlContext.getAriaDescribedBy(
			mergedProps["aria-describedby"],
		);
	};

	const context: RatingContextValue = {
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
				<RatingContext value={context}>
					<Polymorphic<RatingRootRenderProps>
						as="div"
						ref={[setRef, mergedProps.ref]}
						role="radiogroup"
						id={access(mergedProps.id)!}
						aria-invalid={
							formControlContext.validationState() === "invalid"
								? "true"
								: undefined
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
				</RatingContext>
			</FormControlContext>
		</DomCollectionProvider>
	);
}
