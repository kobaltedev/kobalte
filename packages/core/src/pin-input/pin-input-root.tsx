import {
	type ValidationState,
	access,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Accessor,
	type ValidComponent,
	createEffect,
	createSignal,
	createUniqueId,
	on,
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
	createControllableArraySignal,
	createFormResetListener,
} from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import {
	PinInputContext,
	type PinInputContextValue,
	type PinInputDataSet,
} from "./pin-input-context";
import {
	PIN_INPUT_INTL_TRANSLATIONS,
	type PinInputIntlTranslations,
} from "./pin-input.intl";

export interface PinInputRootOptions {
	/** The value of the the pin input. */
	value?: string[];

	/**
	 * The initial value of the pin input when it is first rendered.
	 * Use when you do not need to control the state of the pin input.
	 */
	defaultValue?: string[];

	/** Function called on input change. */
	onChange?: (value: string[]) => void;

	/** Function called when all inputs have valid values. */
	onComplete?: (value: string[]) => void;

	/** Whether to blur the input when the value is complete. */
	blurOnComplete?: boolean;

	/** If `true`, the input's value will be masked just like `type=password`. */
	mask?: boolean;

	/** If `true`, the pin input component signals to its fields that they should use `autocomplete="one-time-code"`. */
	otp?: boolean;

	/** The regular expression that the user-entered input value is checked against. */
	pattern?: string;

	/** The placeholder text for the input. */
	placeholder?: string;

	/** Whether to select input value when input is focused. */
	selectOnFocus?: boolean;

	/** The type of value the pin-input should allow. */
	type?: "numeric" | "alphabetic" | "alphanumeric";

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the pin input.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the pin input should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the pin input is required. */
	required?: boolean;

	/** Whether the pin input is disabled. */
	disabled?: boolean;

	/** Whether the pin input is read only. */
	readOnly?: boolean;

	/** The localized strings of the component. */
	translations?: PinInputIntlTranslations;
}

export interface PinInputRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
}

export interface PinInputRootRenderProps
	extends PinInputRootCommonProps,
		FormControlDataSet {
	role: "group";
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
}

export type PinInputRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PinInputRootOptions & Partial<PinInputRootCommonProps<ElementOf<T>>>;

export function PinInputRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PinInputRootProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const defaultId = `pininput-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			otp: false,
			placeholder: "○",
			type: "numeric",
			translations: PIN_INPUT_INTL_TRANSLATIONS,
		},
		props as PinInputRootProps,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"value",
			"defaultValue",
			"onChange",
			"onComplete",
			"blurOnComplete",
			"mask",
			"otp",
			"pattern",
			"placeholder",
			"selectOnFocus",
			"type",
			"aria-labelledby",
			"aria-describedby",
			"translations",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const [inputs, setInputs] = createSignal<CollectionItemWithRef[]>([]);
	const { DomCollectionProvider } = createDomCollection({
		items: inputs,
		onItemsChange: setInputs,
	});

	const [value, setValue] = createControllableArraySignal<string>({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		onChange: (value) => local.onChange?.(value),
	});

	const { formControlContext } = createFormControl(formControlProps);

	createFormResetListener(
		() => ref,
		() => setValue(local.defaultValue ?? []),
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

	const [focusedIndex, setFocusedIndex] = createSignal(-1);
	const isValueComplete = () =>
		context.value().length === value().filter((v) => v?.trim() !== "").length;

	createEffect(
		on(
			focusedIndex,
			() => {
				if (focusedIndex() === -1) return;
				const inputEl = inputs()[focusedIndex()].ref() as HTMLInputElement;
				inputEl.focus();
				if (local.selectOnFocus) {
					inputEl.select();
				}
			},
			{ defer: true },
		),
	);

	createEffect(
		on(
			isValueComplete,
			() => {
				if (!isValueComplete()) return;
				local.onComplete?.(value());
				if (local.blurOnComplete) {
					(inputs()[focusedIndex()].ref() as HTMLInputElement).blur();
				}
			},
			{ defer: true },
		),
	);

	createEffect(() => {
		if (value().length < inputs().length) {
			const maxLength = Math.max(value().length, inputs().length);
			setValue((prev) =>
				(prev ?? []).concat(Array(maxLength - value().length).fill("")),
			);
		}
	});

	const dataset: Accessor<PinInputDataSet> = () => ({
		...formControlContext.dataset(),
		"data-complete": isValueComplete() ? "" : undefined,
	});

	const context: PinInputContextValue = {
		dataset,
		value,
		setValue,
		mask: () => local.mask,
		otp: () => local.otp,
		placeholder: () => local.placeholder!,
		pattern: () => local.pattern,
		type: () => local.type!,
		focusedIndex,
		setFocusedIndex,
		inputs,
		setInputs,
		translations: () => local.translations!,
	};

	return (
		<DomCollectionProvider>
			<FormControlContext.Provider value={formControlContext}>
				<PinInputContext.Provider value={context}>
					<Polymorphic<PinInputRootRenderProps>
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
						aria-labelledby={ariaLabelledBy()}
						aria-describedby={ariaDescribedBy()}
						{...dataset()}
						{...others}
					/>
				</PinInputContext.Provider>
			</FormControlContext.Provider>
		</DomCollectionProvider>
	);
}
