/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/@react-stately/datepicker/src/useDateFieldState.ts
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/@react-aria/datepicker/src/useDateField.ts
 */

import {
	type Calendar,
	createCalendar as createCalendarFn,
	DateFormatter,
	GregorianCalendar,
	toCalendar,
} from "@internationalized/date";
import type { ValidationState } from "@kobalte/utils";
import { createFocusGroup } from "@solid-primitives/focus";
import { createFormResetListener } from "@solid-primitives/form";
import { access } from "@solid-primitives/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
	merge,
	omit,
	type Ref,
	untrack,
} from "solid-js";
import {
	createFormControl,
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
} from "../form-control/index.ts";
import { useLocale } from "../i18n/index.tsx";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import {
	createControllableSignal,
	createRegisterId,
} from "../primitives/index.ts";
import {
	DATE_FIELD_INTL_MESSAGES,
	type DateFieldIntlTranslations,
} from "./date-field.intl.ts";
import {
	DateFieldContext,
	type DateFieldContextValue,
} from "./date-field-context.tsx";
import { DateFieldValueDescription } from "./date-field-value-description.tsx";
import type {
	DateFieldGranularity,
	DateFieldHourCycle,
	DateFieldMaxGranularity,
	DateFieldOptions,
	DateSegment,
	DateValue,
	SegmentType,
} from "./types.ts";
import {
	addSegment,
	convertValue,
	createPlaceholderDate,
	type FormatterOptions,
	getDateFieldFormatOptions,
	getPlaceholder,
	getSegmentLimits,
	setSegmentBase,
} from "./utils.ts";

const EDITABLE_SEGMENTS = {
	year: true,
	month: true,
	day: true,
	hour: true,
	minute: true,
	second: true,
	dayPeriod: true,
	era: true,
};

const PAGE_STEP = {
	year: 5,
	month: 2,
	day: 7,
	hour: 2,
	minute: 15,
	second: 15,
};

// Node seems to convert everything to lowercase...
const TYPE_MAPPING = {
	dayperiod: "dayPeriod",
};

export interface DateFieldRootOptions {
	/** The current value (controlled). */
	value?: DateValue;

	/** The default value (uncontrolled). */
	defaultValue?: DateValue;

	/** Handler that is called when the value changes. */
	onChange?: (value: DateValue) => void;

	/**
	 * A placeholder date that influences the format of the placeholder shown when no value is selected.
	 * Defaults to today's date at midnight.
	 */
	placeholderValue?: DateValue;

	/** The minimum allowed date that a user may select. */
	minValue?: DateValue;

	/** The maximum allowed date that a user may select. */
	maxValue?: DateValue;

	/**
	 * Whether to display the time in 12 or 24-hour format.
	 * By default, this is determined by the user's locale.
	 */
	hourCycle?: DateFieldHourCycle;

	/**
	 * Determines the smallest unit that is displayed in the date field.
	 * Defaults to `"day"`.
	 */
	granularity?: DateFieldGranularity;

	/** Determines the largest unit that is displayed in the date field. Defaults to `"year"`. */
	maxGranularity?: DateFieldMaxGranularity;

	/** Whether to hide the time zone abbreviation. */
	hideTimeZone?: boolean;

	/**
	 * Whether to always show leading zeros in the day/month/hour fields.
	 * By default, this is determined by the user's locale.
	 */
	shouldForceLeadingZeros?: boolean;

	/**
	 * A function that creates a [Calendar](https://react-spectrum.adobe.com/internationalized/date/Calendar.html)
	 * object for a given calendar identifier. Such a function may be imported from the
	 * `@internationalized/date` package, or manually implemented to include support for
	 * only certain calendars.
	 */
	createCalendar?: (name: string) => Calendar;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/**
	 * The name of the date field.
	 * Submitted with its owning form as part of a name/value pair.
	 */
	name?: string;

	/** Whether the date field should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the date field is required. */
	required?: boolean;

	/** Whether the date field is disabled. */
	disabled?: boolean;

	/** Whether the date field is read only. */
	readOnly?: boolean;

	/** The localized strings of the component. */
	translations?: DateFieldIntlTranslations;
}

export interface DateFieldRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
	ref: Ref<T>;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
	children: JSX.Element;
}

export interface DateFieldRootRenderProps
	extends DateFieldRootCommonProps,
		FormControlDataSet {
	role: "group";
	"aria-invalid": "true" | undefined;
	"aria-required": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-readonly": "true" | undefined;
}

export type DateFieldRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DateFieldRootOptions & Partial<DateFieldRootCommonProps<ElementOf<T>>>;

export function DateFieldRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DateFieldRootProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement>();

	const defaultId = `date-field-${createUniqueId()}`;

	const mergedProps = merge(
		{
			id: defaultId,
			maxGranularity: "year",
			hideTimeZone: false,
			shouldForceLeadingZeros: false,
			createCalendar: createCalendarFn,
			translations: DATE_FIELD_INTL_MESSAGES,
		} as const,
		props as DateFieldRootProps,
	);

	const formControlProps = omit(
		mergedProps,
		"ref",
		"translations",
		"minValue",
		"maxValue",
		"placeholderValue",
		"hourCycle",
		"granularity",
		"maxGranularity",
		"hideTimeZone",
		"shouldForceLeadingZeros",
		"createCalendar",
		"validationState",
		"value",
		"defaultValue",
		"onChange",
		"aria-labelledby",
		"aria-describedby",
		"children",
	);
	const others = omit(
		mergedProps,
		"ref",
		"translations",
		"minValue",
		"maxValue",
		"placeholderValue",
		"hourCycle",
		"granularity",
		"maxGranularity",
		"hideTimeZone",
		"shouldForceLeadingZeros",
		"createCalendar",
		"validationState",
		"value",
		"defaultValue",
		"onChange",
		"aria-labelledby",
		"aria-describedby",
		"children",
		...FORM_CONTROL_PROP_NAMES,
	);

	const [inputRef, setInputRef] = createSignal<HTMLElement>();
	const [valueDescriptionId, setValueDescriptionId] = createSignal<string>();

	const [fieldAriaLabel, setFieldAriaLabel] = createSignal<string>();
	const [fieldAriaLabelledBy, setFieldAriaLabelledBy] = createSignal<string>();
	const [fieldAriaDescribedBy, setFieldAriaDescribedBy] =
		createSignal<string>();

	// Segment navigation is driven manually (see `date-field-segment.tsx`), so
	// disable `createFocusGroup`'s automatic arrow-key/Home/End/Tab handling.
	const focusManager = createFocusGroup(inputRef, () => ({
		keyboardNavigation: false,
	}));

	const { locale } = useLocale();

	const [value, _setValue] = createControllableSignal<DateValue | undefined>({
		value: () => mergedProps.value,
		defaultValue: () => mergedProps.defaultValue,
		onChange: (value) => mergedProps.onChange?.(value!),
	});

	const defaultFormatter = createMemo(() => new DateFormatter(locale()));

	const calendar = createMemo(() => {
		return mergedProps.createCalendar!(
			defaultFormatter().resolvedOptions().calendar as any,
		);
	});

	const timeZone = createMemo(() => {
		const resolvedValue = value();
		return resolvedValue && "timeZone" in resolvedValue
			? resolvedValue.timeZone
			: undefined;
	});

	const calendarValue = createMemo(() => convertValue(value(), calendar()));

	// We keep track of the placeholder date separately in state so that onChange is not called
	// until all segments are set.
	const [placeholderDate, setPlaceholderDate] = createSignal(
		untrack(() =>
			createPlaceholderDate(
				mergedProps.placeholderValue,
				mergedProps.granularity ?? "day",
				calendar(),
				timeZone() ?? "UTC",
			),
		),
	);

	const val = createMemo(() => calendarValue() || placeholderDate());

	const showEra = createMemo(
		() => calendar().identifier === "gregory" && val()?.era === "BC",
	);

	const formatOpts: Accessor<FormatterOptions> = createMemo(() => ({
		granularity: mergedProps.granularity ?? "day",
		maxGranularity: mergedProps.maxGranularity ?? "year",
		timeZone: timeZone(),
		hideTimeZone: mergedProps.hideTimeZone,
		hourCycle: mergedProps.hourCycle,
		showEra: showEra(),
		shouldForceLeadingZeros: mergedProps.shouldForceLeadingZeros,
	}));

	const opts = createMemo(() => getDateFieldFormatOptions({}, formatOpts()));

	const dateFormatter = createMemo(() => new DateFormatter(locale(), opts()));
	const resolvedOptions = createMemo(() => dateFormatter().resolvedOptions());

	// Determine how many editable segments there are for validation purposes.
	const allSegments: Accessor<Partial<typeof EDITABLE_SEGMENTS>> = createMemo(
		() => {
			return dateFormatter()
				.formatToParts(new Date())
				.filter(
					(segment) =>
						EDITABLE_SEGMENTS[segment.type as keyof typeof EDITABLE_SEGMENTS],
				)
				.reduce(
					(acc, segment) => {
						acc[segment.type as keyof typeof EDITABLE_SEGMENTS] = true;
						return acc;
					},
					{} as Partial<typeof EDITABLE_SEGMENTS>,
				);
		},
	);

	const [validSegments, setValidSegments] = createSignal<
		Partial<typeof EDITABLE_SEGMENTS>
	>(untrack(() => (value() ? { ...allSegments() } : {})));

	// If all segments are valid, use the date from state, otherwise use the placeholder date.
	const displayValue = createMemo(() => {
		return calendarValue() &&
			Object.keys(validSegments()).length >= Object.keys(allSegments()).length
			? calendarValue()
			: placeholderDate();
	});

	const commit = (newValue: DateValue) => {
		if (
			Object.keys(validSegments()).length >= Object.keys(allSegments()).length
		) {
			const v = value();

			// The display calendar should not have any effect on the emitted value.
			// Emit dates in the same calendar as the original value, if any, otherwise gregorian.
			_setValue(toCalendar(newValue, v?.calendar || new GregorianCalendar()));
		} else {
			setPlaceholderDate(newValue);
		}
	};

	const dateValue = createMemo(() =>
		displayValue()?.toDate(timeZone() ?? "UTC"),
	);

	const segments = createMemo(() => {
		const resolvedDateValue = dateValue();
		const resolvedDisplayValue = displayValue();

		if (!resolvedDateValue || !resolvedDisplayValue) {
			return [];
		}

		return dateFormatter()
			.formatToParts(resolvedDateValue)
			.map((segment) => {
				const isOriginallyEditable =
					EDITABLE_SEGMENTS[segment.type as keyof typeof EDITABLE_SEGMENTS];

				let isEditable = isOriginallyEditable;

				if (segment.type === "era" && calendar().getEras().length === 1) {
					isEditable = false;
				}

				const isPlaceholder =
					isOriginallyEditable && !(validSegments() as any)[segment.type];

				const placeholder = isOriginallyEditable
					? getPlaceholder(
							mergedProps.translations!,
							segment.type,
							segment.value,
						)
					: null;

				return {
					type:
						TYPE_MAPPING[segment.type as keyof typeof TYPE_MAPPING] ||
						segment.type,
					text: isPlaceholder ? placeholder : segment.value,
					...getSegmentLimits(
						resolvedDisplayValue,
						segment.type,
						resolvedOptions(),
					),
					isPlaceholder,
					placeholder,
					isEditable,
				} as DateSegment;
			});
	});

	const markValid = (part: Intl.DateTimeFormatPartTypes) => {
		setValidSegments((prev) => {
			const newValue = { ...prev, [part]: true };

			if (part === "year" && allSegments().era) {
				newValue.era = true;
			}

			return newValue;
		});
	};

	const adjustSegment = (
		type: Intl.DateTimeFormatPartTypes,
		amount: number,
	) => {
		const resolvedDisplayValue = displayValue();

		if (!(validSegments() as any)[type]) {
			markValid(type);
			if (
				resolvedDisplayValue &&
				Object.keys(validSegments()).length >= Object.keys(allSegments()).length
			) {
				commit(resolvedDisplayValue);
			}
		} else if (resolvedDisplayValue) {
			const newValue = addSegment(
				resolvedDisplayValue,
				type,
				amount,
				resolvedOptions(),
			);

			if (newValue) {
				commit(newValue);
			}
		}
	};

	/**
	 * Increments the given segment.
	 * Upon reaching the minimum or maximum value, the value wraps around to the opposite limit.
	 */
	const increment = (part: SegmentType) => {
		adjustSegment(part, 1);
	};

	/**
	 * Decrements the given segment.
	 * Upon reaching the minimum or maximum value, the value wraps around to the opposite limit.
	 */
	const decrement = (part: SegmentType) => {
		adjustSegment(part, -1);
	};

	/**
	 * Increments the given segment by a larger amount, rounding it to the nearest increment.
	 */
	const incrementPage = (part: SegmentType) => {
		adjustSegment(part, PAGE_STEP[part as keyof typeof PAGE_STEP] || 1);
	};

	/**
	 * Decrements the given segment by a larger amount, rounding it to the nearest increment.
	 */
	const decrementPage = (part: SegmentType) => {
		adjustSegment(part, -(PAGE_STEP[part as keyof typeof PAGE_STEP] || 1));
	};

	/** Sets the value of the given segment. */
	const setSegment = (part: SegmentType, segmentValue: number) => {
		markValid(part);

		const resolvedDisplayValue = displayValue();

		if (resolvedDisplayValue) {
			const newValue = setSegmentBase(
				resolvedDisplayValue,
				part,
				segmentValue,
				resolvedOptions(),
			);

			if (newValue) {
				commit(newValue);
			}
		}
	};

	/** Clears the value of the given segment, reverting it to the placeholder. */
	const clearSegment = (part: SegmentType) => {
		setValidSegments((prev) => {
			const newValue = { ...prev };
			delete newValue[part as keyof typeof newValue];
			return newValue;
		});

		const placeholder = createPlaceholderDate(
			mergedProps.placeholderValue,
			mergedProps.granularity ?? "day",
			calendar(),
			timeZone() ?? "UTC",
		);

		const resolvedDisplayValue = displayValue();
		let newValue = resolvedDisplayValue;

		// Reset day period to default without changing the hour.
		if (resolvedDisplayValue && placeholder) {
			if (
				part === "dayPeriod" &&
				"hour" in resolvedDisplayValue &&
				"hour" in placeholder
			) {
				const isPM = resolvedDisplayValue.hour >= 12;
				const shouldBePM = placeholder.hour >= 12;

				if (isPM && !shouldBePM) {
					newValue = resolvedDisplayValue.set({
						hour: resolvedDisplayValue.hour - 12,
					});
				} else if (!isPM && shouldBePM) {
					newValue = resolvedDisplayValue.set({
						hour: resolvedDisplayValue.hour + 12,
					});
				}
			} else if (part in resolvedDisplayValue) {
				newValue = resolvedDisplayValue.set({
					[part]: placeholder[part as keyof typeof placeholder],
				});
			}
		}

		_setValue(undefined);

		if (newValue) {
			commit(newValue);
		}
	};

	/** Formats the current date value using the given options. */
	const formatValue = (fieldOptions: DateFieldOptions) => {
		const resolvedDateValue = dateValue();

		if (!calendarValue() || !resolvedDateValue) {
			return "";
		}

		const formatOptions = getDateFieldFormatOptions(fieldOptions, formatOpts());
		const formatter = new DateFormatter(locale(), formatOptions);
		return formatter.format(resolvedDateValue);
	};

	const formattedValue = createMemo(() =>
		calendarValue() ? formatValue({}) : undefined,
	);

	createFormResetListener(ref, () => {
		_setValue(mergedProps.defaultValue);
	});

	const validationState = createMemo(() => {
		if (mergedProps.validationState) {
			return mergedProps.validationState;
		}

		const resolvedValue = value();

		if (!resolvedValue) {
			return undefined;
		}

		if (
			mergedProps.minValue &&
			resolvedValue.compare(mergedProps.minValue) < 0
		) {
			return "invalid";
		}

		if (
			mergedProps.maxValue &&
			resolvedValue.compare(mergedProps.maxValue) > 0
		) {
			return "invalid";
		}

		return undefined;
	});

	const { formControlContext } = createFormControl(
		merge(formControlProps, {
			get validationState() {
				return validationState();
			},
		}),
	);

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

	// If there is a value prop, and some segments were previously placeholders, mark them all as valid.
	createEffect(
		() =>
			value() != null &&
			Object.keys(validSegments()).length < Object.keys(allSegments()).length
				? allSegments()
				: undefined,
		(segmentsToMarkValid) => {
			if (segmentsToMarkValid) {
				setValidSegments({ ...segmentsToMarkValid });
			}
		},
	);

	// If the value is set to undefined and all segments are valid, reset the placeholder.
	createEffect(
		() =>
			[
				value(),
				mergedProps.placeholderValue,
				mergedProps.granularity,
				calendar(),
				timeZone(),
			] as const,
		([
			resolvedValue,
			placeholderValue,
			granularity,
			resolvedCalendar,
			resolvedTimeZone,
		]) => {
			if (resolvedValue == null) {
				setValidSegments({});
				setPlaceholderDate(
					createPlaceholderDate(
						placeholderValue,
						granularity ?? "day",
						resolvedCalendar,
						resolvedTimeZone ?? "UTC",
					),
				);
			}
		},
	);

	// When the era field appears, mark it valid if the year field is already valid.
	// If the era field disappears, remove it from the valid segments.
	createEffect(
		() => ({
			hasEraSegment: !!allSegments().era,
			isYearValid: !!validSegments().year,
			isEraValid: !!validSegments().era,
		}),
		({ hasEraSegment, isYearValid, isEraValid }) => {
			if (hasEraSegment && isYearValid && !isEraValid) {
				setValidSegments((prev) => ({ ...prev, era: true }));
			} else if (!hasEraSegment && isEraValid) {
				setValidSegments((prev) => {
					const newValue = { ...prev };
					newValue.era = undefined;
					return newValue;
				});
			}
		},
	);

	const context: DateFieldContextValue = {
		translations: () => mergedProps.translations!,
		value,
		setValue: commit,
		calendar,
		dateValue,
		dateFormatterResolvedOptions: resolvedOptions,
		segments,
		formattedValue,
		isDisabled: () => formControlContext.isDisabled() ?? false,
		focusManager: () => focusManager,
		ariaDescribedBy,
		inputRef,
		setInputRef,
		valueDescriptionId,
		registerValueDescriptionId: createRegisterId(setValueDescriptionId),
		generateId: (suffix: string) =>
			`${untrack(() => access(mergedProps.id))}-${suffix}`,
		increment,
		decrement,
		incrementPage,
		decrementPage,
		setSegment,
		clearSegment,
		formatValue,
		fieldAriaLabel,
		fieldAriaLabelledBy,
		fieldAriaDescribedBy,
		setFieldAriaLabel,
		setFieldAriaLabelledBy,
		setFieldAriaDescribedBy,
	};

	// Flatten `others` into a plain object before spreading it alongside this many other
	// named props on Polymorphic: `omit()`'s proxy leaks the underlying `merge()` source's
	// internal `$SOURCES` bookkeeping symbol on direct property access (a lookup Solid's own
	// prop-merging performs to flatten nested merges for performance) — bypassing `omit()`'s
	// own key-exclusion filter, which only guards enumeration and named-key `get()` calls, not
	// that symbol. A component call mixing many named props with a spread whose source hides
	// `$SOURCES` can flatten straight through it, resurfacing keys `others` was supposed to
	// exclude. A plain-object spread only copies what `ownKeys()` actually reports, so it can't leak.
	const plainOthers = createMemo(() => ({ ...others }));

	return (
		<FormControlContext value={formControlContext}>
			<DateFieldContext value={context}>
				<Polymorphic<DateFieldRootRenderProps>
					as="div"
					{...formControlContext.dataset()}
					{...plainOthers()}
					ref={[setRef, mergedProps.ref]}
					role="group"
					id={access(mergedProps.id)!}
					aria-invalid={
						formControlContext.validationState() === "invalid"
							? "true"
							: undefined
					}
					aria-required={formControlContext.isRequired() ? "true" : undefined}
					aria-disabled={formControlContext.isDisabled() ? "true" : undefined}
					aria-readonly={formControlContext.isReadOnly() ? "true" : undefined}
					aria-labelledby={ariaLabelledBy()}
					aria-describedby={ariaDescribedBy()}
				>
					{mergedProps.children}
					<DateFieldValueDescription />
				</Polymorphic>
			</DateFieldContext>
		</FormControlContext>
	);
}
