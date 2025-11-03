import {
	type ValidationState,
	access,
	createFocusManager,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type JSX,
	type ValidComponent,
	createMemo,
	createSignal,
	createUniqueId,
	mergeProps,
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
	TimeFieldContext,
	type TimeFieldContextValue,
} from "./time-field-context";
import { TimeFieldValueDescription } from "./time-field-value-description";
import {
	TIME_FIELD_INTL_MESSAGES,
	type TimeFieldIntlTranslations,
} from "./time-field.intl";
import type {
	SegmentType,
	Time,
	TimeFieldGranularity,
	TimeFieldHourCycle,
} from "./types";

export interface TimeFieldRootOptions {
	/** The current value (controlled). */
	value?: Time;

	/** The default value (uncontrolled). */
	defaultValue?: Time;

	/** Handler that is called when the value changes. */
	onChange?: (value: Time) => void;

	/**
	 * Whether to display the time in 12 or 24-hour format.
	 * By default, this is determined by the user's locale.
	 */
	hourCycle?: TimeFieldHourCycle;

	/**
	 * Determines the smallest unit that is displayed in the time field.
	 * Defaults to `"minute"`.
	 */
	granularity?: TimeFieldGranularity;

	/**
	 * Whether to always show leading zeros in the hour field.
	 * By default, this is determined by the user's locale.
	 */
	shouldForceLeadingZeros?: boolean;

	/**
	 * A placeholder time that influences the format of the placeholder shown when no value is selected.
	 * Defaults to 12:00 AM or 00:00 depending on the hour cycle.
	 */
	placeholder?: Time;

	/** The minimum allowed time that a user may select. */
	min?: Time;

	/** The maximum allowed time that a user may select. */
	max?: Time;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the time field.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the time field should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the time field is required. */
	required?: boolean;

	/** Whether the time field is disabled. */
	disabled?: boolean;

	/** Whether the time field is read only. */
	readOnly?: boolean;

	/** The localized strings of the component. */
	translations?: TimeFieldIntlTranslations;
}

export interface TimeFieldRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: T | ((el: T) => void);
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
	children: JSX.Element;
}

export interface TimeFieldRootRenderProps
	extends TimeFieldRootCommonProps,
		FormControlDataSet {
	role: "group";
	"aria-invalid": boolean | undefined;
	"aria-required": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-readonly": boolean | undefined;
}

export type TimeFieldRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TimeFieldRootOptions & Partial<TimeFieldRootCommonProps<ElementOf<T>>>;

export function TimeFieldRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TimeFieldRootProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement>();

	const defaultId = `time-field-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			granularity: "minute",
			translations: TIME_FIELD_INTL_MESSAGES,
		},
		props as TimeFieldRootProps,
	);

	const [local, formControlProps, others] = splitProps(
		mergedProps,
		[
			"ref",
			"translations",
			"min",
			"max",
			"placeholder",
			"hourCycle",
			"granularity",
			"shouldForceLeadingZeros",
			"validationState",
			"value",
			"defaultValue",
			"onChange",
			"aria-labelledby",
			"aria-describedby",
			"children",
		],
		FORM_CONTROL_PROP_NAMES,
	);

	const [inputRef, setInputRef] = createSignal<HTMLDivElement>();
	const [valueDescriptionId, setValueDescriptionId] = createSignal<string>();

	const [fieldAriaLabel, setFieldAriaLabel] = createSignal<string>();
	const [fieldAriaLabelledBy, setFieldAriaLabelledBy] = createSignal<string>();
	const [fieldAriaDescribedBy, setFieldAriaDescribedBy] =
		createSignal<string>();

	const focusManager = createFocusManager(inputRef);

	const [value, _setValue] = createControllableSignal<
		Partial<Time> | undefined
	>({
		value: () => local.value,
		defaultValue: () => local.defaultValue,
		// @ts-ignore
		onChange: (value) => local.onChange?.(value!),
	});

	const setValue = (v: Partial<Time> | undefined) => {
		if (!v) {
			_setValue(undefined);
			return;
		}

		const newValue = { ...value() };

		if ("hour" in v) newValue.hour = v.hour;
		if ("minute" in v) newValue.minute = v.minute;
		if ("second" in v) newValue.second = v.second;

		_setValue(newValue);
	};

	createFormResetListener(ref, () => {
		setValue(local.defaultValue);
	});

	const validationState = createMemo(() => {
		if (local.validationState) {
			return local.validationState;
		}

		const minTime = Number.parseInt(
			`${local.min?.hour ?? "00"}${local.min?.minute ?? "00"}${local.min?.second ?? "00"}`,
		);
		const maxTime = Number.parseInt(
			`${local.max?.hour ?? "23"}${local.max?.minute ?? "59"}${local.max?.second ?? "59"}`,
		);
		const val = Number.parseInt(
			`${value()?.hour ?? "00"}${value()?.minute ?? "00"}${value()?.second ?? "00"}`,
		);

		console.log(minTime, maxTime, val, val > maxTime, val < minTime);

		if (val > maxTime || val < minTime) return "invalid";

		return undefined;
	});

	const { formControlContext } = createFormControl(
		mergeProps(formControlProps, {
			get validationState() {
				return validationState();
			},
		}),
	);

	const resolvedGranularity = createMemo(() => {
		return {
			hour: true,
			minute: true,
			second: true,
		};
	});

	const formattedValue = createMemo(() => {
		let hour = value()?.hour ?? 0;
		const pm = hour > 12;

		if (local.hourCycle === 12 && pm) {
			hour -= 12;
		}

		const padding = local.shouldForceLeadingZeros ? 2 : 1;

		const segments: string[] = [];

		if (resolvedGranularity().hour) {
			segments.push(hour.toString().padStart(padding, "0"));
		}

		if (resolvedGranularity().minute) {
			segments.push((value()?.minute ?? 0).toString().padStart(padding, "0"));
		}

		if (resolvedGranularity().second) {
			segments.push((value()?.second ?? 0).toString().padStart(padding, "0"));
		}

		let val = segments.join(":");

		if (local.hourCycle === 12) {
			val += ` ${pm ? local.translations?.pm : local.translations?.am}`;
		}

		return val;
	});

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			access(formControlProps.id),
			others["aria-label"],
			local["aria-labelledby"],
		);
	};

	const ariaDescribedBy = () => {
		return (
			[
				valueDescriptionId(),
				formControlContext.getAriaDescribedBy(local["aria-describedby"]),
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const segments = createMemo(() => {
		const seg = Object.keys(resolvedGranularity());

		if (seg.includes("hour") && local.hourCycle === 12) seg.push("dayPeriod");

		return seg as SegmentType[];
	});

	const context: TimeFieldContextValue = {
		translations: () => local.translations!,
		value,
		setValue,
		hourCycle: () => local.hourCycle,
		resolvedGranularity,
		shouldForceLeadingZeros: () => local.shouldForceLeadingZeros ?? false,
		placeholder: () => local.placeholder,
		formattedValue,
		focusManager: () => focusManager,
		isDisabled: () => formControlContext.isDisabled() ?? false,
		ariaDescribedBy,
		inputRef,
		setInputRef,
		valueDescriptionId,
		registerValueDescriptionId: createRegisterId(setValueDescriptionId),
		generateId: createGenerateId(() => access(formControlProps.id)!),
		segments,

		fieldAriaLabel,
		fieldAriaLabelledBy,
		fieldAriaDescribedBy,
		setFieldAriaLabel,
		setFieldAriaLabelledBy,
		setFieldAriaDescribedBy,
	};

	return (
		<FormControlContext.Provider value={formControlContext}>
			<TimeFieldContext.Provider value={context}>
				<Polymorphic<TimeFieldRootRenderProps>
					as="div"
					ref={mergeRefs(setRef, local.ref)}
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
					{...formControlContext.dataset()}
					{...others}
				>
					{local.children}
					<TimeFieldValueDescription />
				</Polymorphic>
			</TimeFieldContext.Provider>
		</FormControlContext.Provider>
	);
}
