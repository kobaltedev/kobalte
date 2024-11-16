/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a98da553e73ca70bb3215a106878fa98fac826f2/packages/%40react-stately/datepicker/src/useDateFieldState.ts
 * https://github.com/adobe/react-spectrum/blob/a98da553e73ca70bb3215a106878fa98fac826f2/packages/%40react-aria/datepicker/src/useDateField.ts
 */

import { DateFormatter } from "@internationalized/date";
import {
	callHandler,
	createGenerateId,
	getFocusableTreeWalker,
	getWindow,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Accessor,
	Index,
	type JSX,
	type ValidComponent,
	createMemo,
	createSignal,
	splitProps,
} from "solid-js";

import { useFormControlContext } from "../form-control";
import { useLocale } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useTimeFieldContext } from "./time-field-context";
import {
	TimeFieldFieldContext,
	type TimeFieldFieldContextValue,
} from "./time-field-field-context";
import type {
	FormatterOptions,
	SegmentType,
	TimeSegment,
	TimeValue,
} from "./types";
import {
	convertValue,
	createPlaceholderDate,
	getTimeFieldFormatOptions,
} from "./utils";

export interface TimeFieldFieldOptions {
	children?: (segment: Accessor<TimeSegment>) => JSX.Element;
}

export interface TimeFieldFieldCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
	"aria-label"?: string;
	children: JSX.Element | ((segment: Accessor<TimeSegment>) => JSX.Element);
}

export interface TimeFieldFieldRenderProps extends TimeFieldFieldCommonProps {
	role: "presentation";
}

export type TimeFieldFieldProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TimeFieldFieldOptions & Partial<TimeFieldFieldCommonProps<ElementOf<T>>>;

export function TimeFieldField<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TimeFieldFieldProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const formControlContext = useFormControlContext();
	const timeFieldContext = useTimeFieldContext();

	const mergedProps = mergeDefaultProps(
		{
			id: timeFieldContext.generateId("input"),
		},
		props as TimeFieldFieldProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"ref",
		"children",
		"onKeyDown",
		"onFocusOut",
		"aria-labelledby",
		"aria-describedby",
	]);

	const { locale, direction } = useLocale();

	const val = createMemo(
		() => timeFieldContext.value() || timeFieldContext.placeholderValue(),
	);

	const [placeholderDate, setPlaceholderDate] = createSignal(
		createPlaceholderDate(
			val(),
			timeFieldContext.placeholderValue(),
			timeFieldContext.defaultTimeZone(),
		),
	);

	const formatOpts: Accessor<FormatterOptions> = createMemo(() => ({
		granularity: timeFieldContext.granularity(),
		maxGranularity: "hour",
		timeZone: timeFieldContext.defaultTimeZone(),
		hideTimeZone: timeFieldContext.hideTimeZone(),
		hourCycle: timeFieldContext.hourCycle(),
		shouldForceLeadingZeros: timeFieldContext.shouldForceLeadingZeros(),
	}));

	const opts = createMemo(() => getTimeFieldFormatOptions(formatOpts()));

	const dateFormatter = createMemo(() => new DateFormatter(locale(), opts()));
	const resolvedOptions = createMemo(() => dateFormatter().resolvedOptions());

	const ariaLabelledBy = createMemo(() => {
		return formControlContext.getAriaLabelledBy(
			others.id,
			others["aria-label"],
			local["aria-labelledby"],
		);
	});

	const ariaDescribedBy = createMemo(() => {
		return [local["aria-describedby"], timeFieldContext.ariaDescribedBy()]
			.filter(Boolean)
			.join(" ");
	});

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
	>(timeFieldContext.value() ? { ...allSegments() } : {});

	const displayValue = createMemo(() => {
		return timeFieldContext.value() &&
			Object.keys(validSegments()).length >= Object.keys(allSegments()).length
			? timeFieldContext.value()
			: placeholderDate();
	});

	const setValue = (newValue: TimeValue) => {
		if (formControlContext.isDisabled() || formControlContext.isReadOnly()) {
			return;
		}

		if (
			Object.keys(validSegments()).length >= Object.keys(allSegments()).length
		) {
			timeFieldContext.setValue(newValue);
		} else {
			setPlaceholderDate(convertValue(newValue));
		}
	};

	const dateValue = createMemo(() =>
		convertValue(displayValue())?.toDate(
			timeFieldContext.defaultTimeZone() ?? "UTC",
		),
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

				const isEditable = isOriginallyEditable;

				const isPlaceholder =
					isOriginallyEditable && !(validSegments() as any)[segment.type];
				const placeholder = isOriginallyEditable
					? getPlaceholder(segment.type, segment.value)
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
				} as TimeSegment;
			});
	});

	const markValid = (part: Intl.DateTimeFormatPartTypes) => {
		setValidSegments((prev) => {
			const newValue = { ...prev, [part]: true };

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
				setValue(resolvedDisplayValue);
			}
		} else if (resolvedDisplayValue) {
			const newValue = addSegment(
				resolvedDisplayValue,
				type,
				amount,
				resolvedOptions(),
			);

			if (newValue) {
				setValue(newValue);
			}
		}
	};

	const increment = (part: SegmentType) => {
		adjustSegment(part, 1);
	};

	const decrement = (part: SegmentType) => {
		adjustSegment(part, -1);
	};

	const incrementPage = (part: SegmentType) => {
		adjustSegment(part, PAGE_STEP[part as keyof typeof PAGE_STEP] || 1);
	};

	const decrementPage = (part: SegmentType) => {
		adjustSegment(part, -(PAGE_STEP[part as keyof typeof PAGE_STEP] || 1));
	};

	const setSegment = (part: SegmentType, value: number) => {
		markValid(part);

		const resolvedDisplayValue = displayValue();

		if (resolvedDisplayValue) {
			const newValue = setSegmentBase(
				resolvedDisplayValue,
				part,
				value,
				resolvedOptions(),
			);

			if (newValue) {
				setValue(newValue);
			}
		}
	};

	const clearSegment = (part: SegmentType) => {
		setValidSegments((prev) => {
			const newValue = { ...prev };
			delete newValue[part as keyof typeof newValue];
			return newValue;
		});

		const placeholder = createPlaceholderDate(
			val(),
			timeFieldContext.placeholderValue(),
			timeFieldContext.defaultTimeZone(),
		);

		const resolvedDisplayValue = displayValue();
		let value = resolvedDisplayValue;

		if (resolvedDisplayValue && placeholder) {
			if (part === "dayPeriod") {
				const isPM = resolvedDisplayValue.hour >= 12;
				const shouldBePM = placeholder.hour >= 12;

				if (isPM && !shouldBePM) {
					value = resolvedDisplayValue.set({
						hour: resolvedDisplayValue.hour - 12,
					});
				} else if (!isPM && shouldBePM) {
					value = resolvedDisplayValue.set({
						hour: resolvedDisplayValue.hour + 12,
					});
				}
			} else if (part in resolvedDisplayValue) {
				value = resolvedDisplayValue.set({
					[part]: placeholder[part as keyof typeof placeholder],
				});
			}
		}
		timeFieldContext.setValue(undefined);

		if (value) {
			setValue(value);
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, local.onKeyDown);

		switch (e.key) {
			case "ArrowLeft":
				e.preventDefault();
				e.stopPropagation();
				if (direction() === "rtl") {
					timeFieldContext.focusManager().focusNext();
				} else {
					timeFieldContext.focusManager().focusPrevious();
				}
				break;
			case "ArrowRight":
				e.preventDefault();
				e.stopPropagation();
				if (direction() === "rtl") {
					timeFieldContext.focusManager().focusPrevious();
				} else {
					timeFieldContext.focusManager().focusNext();
				}
				break;
		}
	};

	const onFocusOut: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		callHandler(e, local.onFocusOut);

		if (formControlContext.isDisabled() || formControlContext.isReadOnly()) {
			return;
		}

		// Confirm the placeholder if only the day period is not filled in.
		const validKeys = Object.keys(validSegments());
		const allKeys = Object.keys(allSegments());

		if (
			validKeys.length === allKeys.length - 1 &&
			allSegments().dayPeriod &&
			!validSegments().dayPeriod
		) {
			setValidSegments({ ...allSegments() });

			const resolvedDisplayValue = displayValue();

			if (resolvedDisplayValue) {
				setValue(resolvedDisplayValue.copy());
			}
		}
	};

	const context: TimeFieldFieldContextValue = {
		dateValue,
		dateFormatterResolvedOptions: resolvedOptions,
		ariaLabel: () => others["aria-label"],
		ariaLabelledBy,
		ariaDescribedBy,
		segments,
		increment,
		decrement,
		incrementPage,
		decrementPage,
		setSegment,
		clearSegment,
		generateId: createGenerateId(() => mergedProps.id),
	};

	return (
		<TimeFieldFieldContext.Provider value={context}>
			<Polymorphic<TimeFieldFieldRenderProps>
				as="div"
				role="presentation"
				ref={mergeRefs((el) => {
					timeFieldContext.setInputRef(el);
					ref = el;
				}, local.ref)}
				aria-labelledby={ariaLabelledBy()}
				aria-describedby={ariaDescribedBy()}
				onKeyDown={onKeyDown}
				onFocusOut={onFocusOut}
				{...formControlContext.dataset()}
				{...others}
			>
				<Index each={segments()}>
					{(segment) => local.children?.(segment)}
				</Index>
			</Polymorphic>
		</TimeFieldFieldContext.Provider>
	);
}

const EDITABLE_SEGMENTS = {
	hour: true,
	minute: true,
	second: true,
	dayPeriod: true,
};

const PAGE_STEP = {
	hour: 2,
	minute: 15,
	second: 15,
};

const TYPE_MAPPING = {
	dayperiod: "dayPeriod",
};

function getSegmentLimits(
	date: TimeValue,
	type: string,
	options: Intl.ResolvedDateTimeFormatOptions,
) {
	switch (type) {
		case "dayPeriod":
			return {
				value: date.hour >= 12 ? 12 : 0,
				minValue: 0,
				maxValue: 12,
			};
		case "hour":
			if (options.hour12) {
				const isPM = date.hour >= 12;
				return {
					value: date.hour,
					minValue: isPM ? 12 : 0,
					maxValue: isPM ? 23 : 11,
				};
			}

			return {
				value: date.hour,
				minValue: 0,
				maxValue: 23,
			};
		case "minute":
			return {
				value: date.minute,
				minValue: 0,
				maxValue: 59,
			};
		case "second":
			return {
				value: date.second,
				minValue: 0,
				maxValue: 59,
			};
	}

	return {};
}

function addSegment(
	value: TimeValue,
	part: string,
	amount: number,
	options: Intl.ResolvedDateTimeFormatOptions,
) {
	if ("hour" in value) {
		switch (part) {
			case "dayPeriod": {
				const hours = value.hour;
				const isPM = hours >= 12;
				return value.set({ hour: isPM ? hours - 12 : hours + 12 });
			}
			case "hour":
			case "minute":
			case "second":
				return value.cycle(part, amount, {
					round: part !== "hour",
					hourCycle: options.hour12 ? 12 : 24,
				});
		}
	}
}

function setSegmentBase(
	value: TimeValue,
	part: string,
	segmentValue: number,
	options: Intl.ResolvedDateTimeFormatOptions,
) {
	if ("hour" in value) {
		switch (part) {
			case "dayPeriod": {
				const hours = value.hour;
				const wasPM = hours >= 12;
				const isPM = segmentValue >= 12;
				if (isPM === wasPM) {
					return value;
				}
				return value.set({ hour: wasPM ? hours - 12 : hours + 12 });
			}

			case "hour":
				if (options.hour12) {
					const hours = value.hour;
					const wasPM = hours >= 12;
					if (!wasPM && segmentValue === 12) {
						// biome-ignore lint/style/noParameterAssign: used in fallthrough
						segmentValue = 0;
					}
					if (wasPM && segmentValue < 12) {
						// biome-ignore lint/style/noParameterAssign: used in fallthrough
						segmentValue += 12;
					}
				}
				return value.set({ [part]: segmentValue });
			case "minute":
			case "second":
				return value.set({ [part]: segmentValue });
		}
	}
}

export function getPlaceholder(field: string, value: string) {
	if (field === "dayPeriod") {
		return value;
	}

	return "––";
}
