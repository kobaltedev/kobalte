import {
	type DateValue,
	getLocalTimeZone,
	toCalendarDateTime,
	toZoned,
	today,
} from "@internationalized/date";
import { type Accessor, createEffect, createMemo } from "solid-js";
import type {
	FormatterOptions,
	TimeFieldGranularity,
} from "./types";

export function createDefaultProps(props: {
	value: Accessor<Date | undefined>;
	granularity: Accessor<TimeFieldGranularity | undefined>;
}) {
	let lastValue: Date;

	const value = createMemo(() => {
		const resolvedValue = props.value();

		if (resolvedValue) {
			lastValue = resolvedValue;
		}

		return lastValue;
	});

	// const defaultTimeZone = createMemo(() => {
	// 	const resolvedValue = value();

	// 	if (resolvedValue && "timeZone" in resolvedValue) {
	// 		return resolvedValue.timeZone;
	// 	}

	// 	return undefined;
	// });

	const granularity = createMemo(() => {
		return props.granularity() || "minute";
	});

	createEffect(() => {
		const resolvedValue = value();
		const resolvedGranularity = granularity();

		if (resolvedValue && !(resolvedGranularity in resolvedValue)) {
			throw new Error(
				`Invalid granularity ${resolvedGranularity} for value ${resolvedValue.toString()}`,
			);
		}
	});

	return { granularity/*, defaultTimeZone  */};
}

export function createPlaceholderDate(
	placeholderValue?: Date | null,
	timeZone?: string,
) {

	return placeholderValue;
	// (valueTimeZone || timeZone) && placeholderValue
	// 	? toZoned(convertValue(placeholderValue)!, (valueTimeZone || timeZone)!)
	// 	: convertValue(placeholderValue);
}

export function getTimeFieldFormatOptions(
	options: FormatterOptions,
): Intl.DateTimeFormatOptions {
	const defaultFieldOptions = {
		hour: options.shouldForceLeadingZeros ? "2-digit" : "numeric",
		minute: "2-digit",
		second: "2-digit",
	};
	const granularity = options.granularity || "minute";
	const keys = Object.keys(defaultFieldOptions);

	let startIdx = keys.indexOf("hour");
	if (startIdx < 0) {
		startIdx = 0;
	}

	let endIdx = keys.indexOf(granularity);
	if (endIdx < 0) {
		endIdx = 2;
	}

	const opts: Intl.DateTimeFormatOptions = keys
		.slice(startIdx, endIdx + 1)
		.reduce((opts, key) => {
			//@ts-ignore
			opts[key] = defaultFieldOptions[key];
			return opts;
		}, {});

	if (options.hourCycle != null) {
		opts.hour12 = options.hourCycle === 12;
	}

	opts.timeZone = options.timeZone || "UTC";

	if (options.timeZone && !options.hideTimeZone) {
		opts.timeZoneName = "short";
	}

	return opts;
}

/**
 * Returns the current date with the time set to 00:00:00.
 */
export function emptyDateTime(): Date {
	return new Date(new Date().setHours(0, 0, 0, 0));
}
