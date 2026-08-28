/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2023-2025 Jasmin Noetzli.
 *
 * corvu has no dedicated date-picker primitive — its docs instead show
 * combining `Calendar` with `Popover` directly:
 * https://corvu.dev/docs/primitives/calendar/
 *
 * This composes Kobalte's own `Calendar` and `Popover` the same way, rather
 * than the historical react-spectrum-derived implementation's inline
 * segmented-text-input control.
 */

import type { RangeValue, ValidationState } from "@kobalte/utils";
import { access } from "@solid-primitives/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createMemo, createUniqueId, merge, omit } from "solid-js";
import { type DateDuration, toLocalISOString } from "../calendar/date-math.ts";
import type {
	CalendarMultipleSelectionOptions,
	CalendarRangeSelectionOptions,
	CalendarSelectionMode,
	CalendarSingleSelectionOptions,
} from "../calendar/index.tsx";
import type { DateValue } from "../calendar/types.ts";
import {
	asArrayValue,
	asRangeValue,
	asSingleValue,
	getArrayValueOfSelection,
	isDateInvalid,
} from "../calendar/utils.ts";
import {
	createFormControl,
	FormControlContext,
} from "../form-control/index.ts";
import { useLocale } from "../i18n/index.tsx";
import type { PolymorphicProps } from "../polymorphic/index.tsx";
import { Polymorphic } from "../polymorphic/index.tsx";
import { Popover, type PopoverRootOptions } from "../popover/index.tsx";
import { createControllableSignal } from "../primitives/index.ts";
import {
	DATE_PICKER_INTL_MESSAGES,
	type DatePickerIntlTranslations,
} from "./date-picker.intl.ts";
import {
	DatePickerContext,
	type DatePickerContextValue,
	type DatePickerDataSet,
} from "./date-picker-context.tsx";
import { DatePickerHiddenInput } from "./date-picker-hidden-input.tsx";

export type DatePickerRootOptions = (
	| CalendarSingleSelectionOptions
	| CalendarMultipleSelectionOptions
	| CalendarRangeSelectionOptions
) &
	Omit<
		PopoverRootOptions,
		"anchorRef" | "contentRef" | "onCurrentPlacementChange" | "translations"
	> & {
		/** The localized strings of the component. */
		translations?: DatePickerIntlTranslations;

		/** The locale to display and edit the value according to. */
		locale?: string;

		/** The amount of days that will be displayed at once. This affects how pagination works. */
		visibleDuration?: DateDuration;

		/** The minimum allowed date that a user may select. */
		minValue?: DateValue;

		/** The maximum allowed date that a user may select. */
		maxValue?: DateValue;

		/** Callback that is called for each date of the calendar. If it returns true, then the date is unavailable. */
		isDateUnavailable?: (date: DateValue) => boolean;

		/**
		 * In "range" selection mode, when combined with `isDateUnavailable`, determines whether
		 * non-contiguous ranges, i.e. ranges containing unavailable dates, may be selected.
		 */
		allowsNonContiguousRanges?: boolean;

		/** Whether the date picker should close automatically when a date is selected. Defaults to `true` for "single" and "range", `false` for "multiple". */
		closeOnSelect?: boolean;

		/** A placeholder date used to center the calendar when no value is selected yet. Defaults to today. */
		placeholderValue?: DateValue;

		/**
		 * A unique identifier for the component.
		 * The id is used to generate id attributes for nested components.
		 * If no id prop is provided, a generated id will be used.
		 */
		id?: string;

		/** The name of the date picker. Submitted with its owning form as part of a name/value pair. */
		name?: string;

		/** Whether the date picker should display its "valid" or "invalid" visual styling. */
		validationState?: ValidationState;

		/** Whether the user must select a date before the owning form can be submitted. */
		required?: boolean;

		/** Whether the date picker is disabled. */
		disabled?: boolean;

		/** Whether the date picker is read only. */
		readOnly?: boolean;

		/** The children of the date picker. */
		children?: JSX.Element;
	};

export interface DatePickerRootCommonProps {
	id: string;
	children: JSX.Element;
}

export interface DatePickerRootRenderProps extends DatePickerRootCommonProps {
	role: "group";
	"aria-invalid": "true" | undefined;
	"aria-required": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-readonly": "true" | undefined;
}

export type DatePickerRootProps<
	_T extends ValidComponent | HTMLElement = HTMLElement,
> = DatePickerRootOptions & Partial<DatePickerRootCommonProps>;

/**
 * A date picker combines a `Calendar` popover (opened from a trigger button)
 * to allow users to select a date, dates, or date range.
 */
export function DatePickerRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DatePickerRootProps<T>>,
) {
	const defaultId = `date-picker-${createUniqueId()}`;

	const mergedProps = merge(
		{
			id: defaultId,
			visibleDuration: { months: 1 },
			selectionMode: "single",
			modal: false,
			gutter: 8,
			sameWidth: false,
			placement: "bottom-start",
			translations: DATE_PICKER_INTL_MESSAGES,
		} as const,
		props as DatePickerRootProps,
	);

	// Only Popper/Popover's own configuration is forwarded to the (headless,
	// non-rendering) `<Popover>` — everything else (`class`, `style`, arbitrary
	// passthrough attributes) belongs on the group `<div>` this component itself
	// renders, or `<Popover>` would silently drop it.
	const popoverPropNames = [
		"open",
		"defaultOpen",
		"onOpenChange",
		"modal",
		"preventScroll",
		"forceMount",
		"getAnchorRect",
		"placement",
		"gutter",
		"shift",
		"flip",
		"slide",
		"overlap",
		"sameWidth",
		"fitViewport",
		"hideWhenDetached",
		"detachedPadding",
		"arrowPadding",
		"overflowPadding",
	] as const;

	// Flattened into a plain object before being spread alongside many other named
	// props on `<Popover>`: `merge()`'s proxy can leak internal bookkeeping to a
	// downstream multi-prop merge, resurfacing keys that weren't meant to be there
	// (confirmed via direct repro this session — see the same pattern in
	// `date-field-root.tsx`). A plain-object spread only copies what `ownKeys()`
	// reports, so it can't leak.
	const popoverProps = createMemo(() => {
		const props: Record<string, unknown> = {};
		for (const name of popoverPropNames) {
			if (name in mergedProps) {
				props[name] = mergedProps[name as keyof typeof mergedProps];
			}
		}
		return props;
	});

	const nonGroupPropNames = [
		"translations",
		"locale",
		"visibleDuration",
		"selectionMode",
		"isDateUnavailable",
		"allowsNonContiguousRanges",
		"closeOnSelect",
		"minValue",
		"maxValue",
		"placeholderValue",
		"value",
		"defaultValue",
		"onChange",
		"id",
		"name",
		"required",
		"disabled",
		"readOnly",
		"validationState",
		"children",
		...popoverPropNames,
	] as const;

	const others = omit(mergedProps, ...nonGroupPropNames);

	const locale = createMemo(() => {
		return mergedProps.locale ?? useLocale().locale();
	});

	const [value, setValue] = createControllableSignal<
		DateValue | DateValue[] | RangeValue<DateValue> | null | undefined
	>({
		value: () => mergedProps.value,
		defaultValue: () => mergedProps.defaultValue,
		onChange: (value) => (mergedProps.onChange as any)?.(value),
	});

	const closeOnSelect = createMemo(() => {
		return (
			mergedProps.closeOnSelect ?? mergedProps.selectionMode !== "multiple"
		);
	});

	const validationState = createMemo(() => {
		if (mergedProps.validationState) {
			return mergedProps.validationState;
		}

		const values = getArrayValueOfSelection(mergedProps.selectionMode, value());

		if (values.length <= 0) {
			return undefined;
		}

		const isSomeDateInvalid = values.some((date) => {
			return (
				mergedProps.isDateUnavailable?.(date) ||
				isDateInvalid(date, mergedProps.minValue, mergedProps.maxValue)
			);
		});

		return isSomeDateInvalid ? "invalid" : undefined;
	});

	// Not `createDateFormatter` from `../i18n` — that primitive always reads the
	// ambient locale, but this needs to respect a per-instance `locale` override
	// (`locale()` below already falls back to the ambient locale itself).
	const dateFormatter = createMemo(() => {
		return new Intl.DateTimeFormat(locale(), {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	});

	const formatDate = (date: DateValue | null | undefined) => {
		return date ? dateFormatter().format(date) : "";
	};

	const formattedValue = createMemo(() => {
		const resolvedValue = value();

		if (resolvedValue == null) {
			return "";
		}

		if (mergedProps.selectionMode === "single") {
			return formatDate(asSingleValue(resolvedValue));
		}

		if (mergedProps.selectionMode === "multiple") {
			return asArrayValue(resolvedValue)?.map(formatDate).join(", ") ?? "";
		}

		const range = asRangeValue(resolvedValue);

		if (!range?.start || !range.end) {
			return "";
		}

		return `${formatDate(range.start)} – ${formatDate(range.end)}`;
	});

	const ariaDescribedBy = () => {
		const resolvedValue = value();

		if (resolvedValue == null) {
			return undefined;
		}

		if (mergedProps.selectionMode === "range") {
			const range = asRangeValue(resolvedValue);

			if (!range?.start || !range.end) {
				return undefined;
			}

			return mergedProps.translations!.selectedRangeDescription(
				toLocalISOString(range.start, "day"),
				toLocalISOString(range.end, "day"),
			);
		}

		const firstValue =
			mergedProps.selectionMode === "multiple"
				? asArrayValue(resolvedValue)?.[0]
				: asSingleValue(resolvedValue);

		return firstValue
			? mergedProps.translations!.selectedDateDescription(
					toLocalISOString(firstValue, "day"),
				)
			: undefined;
	};

	const nonFormControlPropNames = [
		"translations",
		"locale",
		"visibleDuration",
		"selectionMode",
		"isDateUnavailable",
		"allowsNonContiguousRanges",
		"closeOnSelect",
		"minValue",
		"maxValue",
		"placeholderValue",
		"value",
		"defaultValue",
		"onChange",
		"children",
		"open",
		"defaultOpen",
		"onOpenChange",
		"modal",
		"forceMount",
		"getAnchorRect",
		"placement",
		"gutter",
		"shift",
		"flip",
		"slide",
		"overlap",
		"sameWidth",
		"fitViewport",
		"hideWhenDetached",
		"detachedPadding",
		"arrowPadding",
		"overflowPadding",
	] as const;

	const formControlProps = omit(mergedProps, ...nonFormControlPropNames);

	const { formControlContext } = createFormControl(
		merge(formControlProps, {
			get validationState() {
				return validationState();
			},
		}),
	);

	const dataset = createMemo<DatePickerDataSet>(() => ({
		"data-expanded": undefined,
		"data-closed": undefined,
	}));

	const context: DatePickerContextValue = {
		dataset,
		isDisabled: () => formControlContext.isDisabled() ?? false,
		translations: () => mergedProps.translations!,
		selectionMode: () => mergedProps.selectionMode as CalendarSelectionMode,
		visibleDuration: () => mergedProps.visibleDuration!,
		allowsNonContiguousRanges: () =>
			mergedProps.allowsNonContiguousRanges ?? false,
		closeOnSelect,
		minValue: () => mergedProps.minValue,
		maxValue: () => mergedProps.maxValue,
		placeholderValue: () => mergedProps.placeholderValue,
		locale,
		ariaDescribedBy,
		validationState,
		value,
		formattedValue,
		isDateUnavailable: (date) => mergedProps.isDateUnavailable?.(date) ?? false,
		setDateValue: (newValue) => setValue(newValue as any),
		generateId: (part) => `${access(mergedProps.id)}-${part}`,
	};

	return (
		<FormControlContext value={formControlContext}>
			<DatePickerContext value={context}>
				<Popover id={mergedProps.id} {...popoverProps()}>
					<Polymorphic<DatePickerRootRenderProps>
						as="div"
						role="group"
						id={mergedProps.id}
						aria-invalid={validationState() === "invalid" ? "true" : undefined}
						aria-required={formControlContext.isRequired() ? "true" : undefined}
						aria-disabled={formControlContext.isDisabled() ? "true" : undefined}
						aria-readonly={formControlContext.isReadOnly() ? "true" : undefined}
						{...formControlContext.dataset()}
						{...others}
					>
						{mergedProps.children}
					</Polymorphic>
					{mergedProps.name && (
						<DatePickerHiddenInput
							name={mergedProps.name}
							selectionMode={mergedProps.selectionMode as CalendarSelectionMode}
							value={value()}
							required={mergedProps.required}
							disabled={formControlContext.isDisabled()}
						/>
					)}
				</Popover>
			</DatePickerContext>
		</FormControlContext>
	);
}
