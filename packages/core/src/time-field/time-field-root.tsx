import { DateFormatter, Time } from "@internationalized/date";
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
	merge,
	omit,
} from "solid-js";
import {
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
	createFormControl,
} from "../form-control";
import { useLocale } from "../i18n";
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
	MappedTimeValue,
	TimeFieldGranularity,
	TimeFieldHourCycle,
	TimeValue,
} from "./types";
import {
	convertValue,
	createDefaultProps,
	getTimeFieldFormatOptions,
} from "./utils";

export interface TimeFieldRootOptions {
	/** The current value (controlled). */
	value?: TimeValue;

	/** The default value (uncontrolled). */
	defaultValue?: TimeValue;

	/** Handler that is called when the value changes. */
	onChange?: (value: MappedTimeValue<TimeValue>) => void;

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

	/** Whether to hide the time zone abbreviation. */
	hideTimeZone?: boolean;

	/**
	 * Whether to always show leading zeros in the hour field.
	 * By default, this is determined by the user's locale.
	 */
	shouldForceLeadingZeros?: boolean;

	/**
	 * A placeholder time that influences the format of the placeholder shown when no value is selected.
	 * Defaults to 12:00 AM or 00:00 depending on the hour cycle.
	 */
	placeholderValue?: TimeValue;

	/** The minimum allowed time that a user may select. */
	minValue?: TimeValue;

	/** The maximum allowed time that a user may select. */
	maxValue?: TimeValue;

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
	let ref: HTMLElement | undefined;

	const defaultId = `time-field-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			granularity: "minute",
			translations: TIME_FIELD_INTL_MESSAGES,
		},
		props as TimeFieldRootProps,
	);

	const others = omit(mergedProps, "ref", "translations", "minValue", "maxValue", "placeholderValue", "hourCycle", "granularity", "hideTimeZone", "shouldForceLeadingZeros", "validationState", "value", "defaultValue", "onChange", "aria-labelledby", "aria-describedby", "children", ...FORM_CONTROL_PROP_NAMES);

	const { locale } = useLocale();

	const [inputRef, setInputRef] = createSignal<HTMLDivElement>();
	const [valueDescriptionId, setValueDescriptionId] = createSignal<string>();

	const focusManager = createFocusManager(inputRef);

	const [value, setValue] = createControllableSignal<TimeValue | undefined>({
		value: () => mergedProps.value,
		defaultValue: () => mergedProps.defaultValue,
		onChange: (value) => mergedProps.onChange?.(value!),
	});

	const { granularity, defaultTimeZone } = createDefaultProps({
		value: () => value() ?? mergedProps.placeholderValue,
		granularity: () => mergedProps.granularity,
	});

	createFormResetListener(
		() => ref,
		() => {
			setValue(mergedProps.defaultValue ?? new Time());
		},
	);

	const validationState = createMemo(() => {
		if (mergedProps.validationState) {
			return mergedProps.validationState;
		}

		const v = value() || mergedProps.placeholderValue;
		const day = v && "day" in v ? v : undefined;
		const minDate = convertValue(mergedProps.minValue, day);
		const maxDate = convertValue(mergedProps.maxValue, day);

		const rangeOverflow =
			value() != null &&
			minDate != null &&
			value()!.compare(convertValue(mergedProps.maxValue)!) > 0;
		const rangeUnderflow =
			value() != null &&
			maxDate != null &&
			value()!.compare(convertValue(mergedProps.minValue)!) < 0;

		return rangeOverflow || rangeUnderflow ? "invalid" : undefined;
	});

	const { formControlContext } = createFormControl(
		merge(mergedProps, {
			get validationState() {
				return validationState();
			},
		}),
	);

	const formattedValue = createMemo(() => {
		const formatOptions = getTimeFieldFormatOptions({
			granularity: granularity(),
			timeZone: defaultTimeZone(),
			hideTimeZone: mergedProps.hideTimeZone,
			hourCycle: mergedProps.hourCycle,
		});

		const dateFormatter = createMemo(
			() => new DateFormatter(locale(), formatOptions),
		);

		if (value()) {
			return dateFormatter().format(
				convertValue(value())!.toDate(defaultTimeZone() ?? "UTC"),
			);
		}

		return "";
	});

	const ariaLabelledBy = () => {
		return formControlContext.getAriaLabelledBy(
			access(mergedProps.id),
			others["aria-label"],
			mergedProps["aria-labelledby"],
		);
	};

	const ariaDescribedBy = () => {
		return (
			[
				valueDescriptionId(),
				formControlContext.getAriaDescribedBy(mergedProps["aria-describedby"]),
			]
				.filter(Boolean)
				.join(" ") || undefined
		);
	};

	const context: TimeFieldContextValue = {
		translations: () => mergedProps.translations!,
		value,
		setValue,
		hourCycle: () => mergedProps.hourCycle,
		granularity,
		hideTimeZone: () => mergedProps.hideTimeZone ?? false,
		shouldForceLeadingZeros: () => mergedProps.shouldForceLeadingZeros ?? false,
		placeholderTime: () => value() || (mergedProps.placeholderValue ?? new Time()),
		placeholderValue: () => mergedProps.placeholderValue,
		defaultTimeZone,
		formattedValue,
		focusManager: () => focusManager,
		isDisabled: () => formControlContext.isDisabled() ?? false,
		ariaDescribedBy,
		inputRef,
		setInputRef,
		valueDescriptionId,
		registerValueDescriptionId: createRegisterId(setValueDescriptionId),
		generateId: createGenerateId(() => access(mergedProps.id)!),
	};

	return (
		<FormControlContext value={formControlContext}>
			<TimeFieldContext value={context}>
				<Polymorphic<TimeFieldRootRenderProps>
					as="div"
					ref={mergeRefs((el) => (ref = el), mergedProps.ref)}
					role="group"
					id={access(mergedProps.id)!}
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
					{mergedProps.children}
					<TimeFieldValueDescription />
				</Polymorphic>
			</TimeFieldContext>
		</FormControlContext>
	);
}
