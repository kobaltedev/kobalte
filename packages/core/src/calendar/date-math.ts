/**
 * Native `Date` arithmetic/comparison/formatting helpers shared by `calendar/` and
 * `date-field/`, replacing the calendar-math previously provided by `@internationalized/date`.
 *
 * Scope is intentionally Gregorian-only, single-timezone (the environment's local time
 * zone): there is no calendar-system abstraction and no explicit per-value time zone.
 * Every function is pure and immutable — none ever mutate their `Date` arguments.
 */

export interface DateDuration {
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
}

export type CycleField =
	| "year"
	| "month"
	| "day"
	| "hour"
	| "minute"
	| "second";

export interface FieldBounds {
	value: number;
	minValue: number;
	maxValue: number;
}

export type DateGranularity = "day" | "hour" | "minute" | "second";

/* -----------------------------------------------------------------------------
 * Construction
 * -----------------------------------------------------------------------------*/

/** Returns local midnight for the current moment. */
export function todayDate(): Date {
	return startOfDay(new Date());
}

/**
 * Builds a `Date` from a fully-computed field tuple in one shot — never chain
 * in-place setters on a pre-existing `Date`. Deliberately does NOT use the
 * `new Date(year, month, day, ...)` constructor directly: for a two-digit `year`
 * (0-99) that constructor silently reinterprets it as 1900-1999 (e.g.
 * `new Date(1, 0, 1)` is the year 1901, not 1) — `setFullYear` has no such quirk.
 */
function fromFields(
	year: number,
	month: number,
	day: number,
	hours = 0,
	minutes = 0,
	seconds = 0,
	milliseconds = 0,
): Date {
	const date = new Date(0);
	date.setFullYear(year, month, day);
	date.setHours(hours, minutes, seconds, milliseconds);
	return date;
}

/* -----------------------------------------------------------------------------
 * Comparison
 * -----------------------------------------------------------------------------*/

export function compareDates(a: Date, b: Date): number {
	return a.getTime() - b.getTime();
}

export function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function isSameMonth(a: Date, b: Date): boolean {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(date: Date): boolean {
	return isSameDay(date, new Date());
}

const DEFAULT_WEEKEND = [6, 0]; // Saturday, Sunday

/** Whether `date` falls on a locale-aware weekend day. Falls back to Sat/Sun. */
export function isWeekend(date: Date, locale?: string): boolean {
	const weekend = locale ? getWeekInfo(locale).weekend : DEFAULT_WEEKEND;
	return weekend.includes(date.getDay());
}

export function minDate(...dates: Array<Date | undefined>): Date | undefined {
	return dates.reduce<Date | undefined>((min, date) => {
		if (date == null) return min;
		if (min == null) return date;
		return compareDates(date, min) < 0 ? date : min;
	}, undefined);
}

export function maxDate(...dates: Array<Date | undefined>): Date | undefined {
	return dates.reduce<Date | undefined>((max, date) => {
		if (date == null) return max;
		if (max == null) return date;
		return compareDates(date, max) > 0 ? date : max;
	}, undefined);
}

export function clampDate(date: Date, min?: Date, max?: Date): Date {
	let result = date;
	if (min) result = maxDate(result, min)!;
	if (max) result = minDate(result, max)!;
	return result;
}

/* -----------------------------------------------------------------------------
 * Unit boundaries
 * -----------------------------------------------------------------------------*/

export function startOfDay(date: Date): Date {
	return fromFields(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDaysInMonth(date: Date): number {
	// Day 0 of the *next* month is the last day of the current month.
	return fromFields(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * The locale's first day of week (0 = Sunday .. 6 = Saturday) and weekend days.
 * Prefers the native `Intl.Locale.prototype.getWeekInfo()` (a method, not a `.weekInfo`
 * property — the latter reliably returns `undefined`, verified against real engines)
 * when available, falling back to a small hardcoded table for older engines.
 */
export function getWeekInfo(locale: string): {
	firstDay: number;
	weekend: number[];
} {
	try {
		const intlLocale = new Intl.Locale(locale) as Intl.Locale & {
			getWeekInfo?: () => { firstDay: number; weekend: number[] };
		};

		if (typeof intlLocale.getWeekInfo === "function") {
			const info = intlLocale.getWeekInfo();
			// `getWeekInfo` reports `firstDay` as ISO 1 (Monday) .. 7 (Sunday); normalize to 0-6 (Sunday-first).
			return {
				firstDay: info.firstDay % 7,
				weekend: info.weekend.map((day) => day % 7),
			};
		}
	} catch {
		// Fall through to the static table below (invalid/unrecognized locale, or no Intl.Locale support).
	}

	const language = locale.split("-")[0]!.toLowerCase();
	const firstDay = FIRST_DAY_OF_WEEK[language] ?? FIRST_DAY_OF_WEEK.default!;
	return { firstDay, weekend: DEFAULT_WEEKEND };
}

/**
 * Fallback locale (base language) → first day of week (0 = Sunday .. 6 = Saturday).
 * Ported from the same CLDR week-data table `@internationalized/date` ships (public domain
 * data, portable). Only used when `Intl.Locale.prototype.getWeekInfo` is unavailable.
 */
const FIRST_DAY_OF_WEEK: Record<string, number> = {
	default: 0,
	af: 1,
	ar: 6,
	az: 1,
	bg: 1,
	bn: 0,
	ca: 1,
	cs: 1,
	da: 1,
	de: 1,
	el: 1,
	es: 1,
	et: 1,
	eu: 1,
	fa: 6,
	fi: 1,
	fr: 1,
	he: 0,
	hi: 0,
	hr: 1,
	hu: 1,
	hy: 1,
	id: 0,
	is: 1,
	it: 1,
	ja: 0,
	ka: 1,
	kk: 1,
	km: 0,
	ko: 0,
	lt: 1,
	lv: 1,
	mk: 1,
	ms: 1,
	nb: 1,
	nl: 1,
	pl: 1,
	pt: 0,
	ro: 1,
	ru: 1,
	sk: 1,
	sl: 1,
	sq: 1,
	sr: 1,
	sv: 1,
	th: 0,
	tr: 1,
	uk: 1,
	vi: 1,
	zh: 0,
};

export function getDayOfWeek(date: Date, locale: string): number {
	const { firstDay } = getWeekInfo(locale);
	return (date.getDay() - firstDay + 7) % 7;
}

export function startOfWeek(date: Date, locale: string): Date {
	return addDays(date, -getDayOfWeek(date, locale));
}

export function endOfWeek(date: Date, locale: string): Date {
	return addDays(startOfWeek(date, locale), 6);
}

export function startOfMonth(date: Date): Date {
	return fromFields(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
	return fromFields(date.getFullYear(), date.getMonth(), getDaysInMonth(date));
}

export function startOfYear(date: Date): Date {
	return fromFields(date.getFullYear(), 0, 1);
}

export function getWeeksInMonth(date: Date, locale: string): number {
	const first = startOfMonth(date);
	const daysInMonth = getDaysInMonth(date);
	const firstWeekday = getDayOfWeek(first, locale);
	return Math.ceil((firstWeekday + daysInMonth) / 7);
}

/* -----------------------------------------------------------------------------
 * Arithmetic — month/year operations always clamp the day-of-month into the
 * target month's valid range instead of letting native `Date` roll over into
 * the next month (e.g. Jan 31 + 1 month -> Feb 28/29, never Mar 3).
 * -----------------------------------------------------------------------------*/

function addMonthsClamped(date: Date, amount: number): Date {
	const targetMonthIndex = date.getMonth() + amount;
	const targetYear = date.getFullYear() + Math.floor(targetMonthIndex / 12);
	const normalizedMonth = ((targetMonthIndex % 12) + 12) % 12;
	const daysInTargetMonth = getDaysInMonth(
		fromFields(targetYear, normalizedMonth, 1),
	);
	const clampedDay = Math.min(date.getDate(), daysInTargetMonth);

	return fromFields(
		targetYear,
		normalizedMonth,
		clampedDay,
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds(),
	);
}

export function addDays(date: Date, amount: number): Date {
	return fromFields(
		date.getFullYear(),
		date.getMonth(),
		date.getDate() + amount,
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds(),
	);
}

export function addWeeks(date: Date, amount: number): Date {
	return addDays(date, amount * 7);
}

export function addMonths(date: Date, amount: number): Date {
	return addMonthsClamped(date, amount);
}

export function addYears(date: Date, amount: number): Date {
	return addMonthsClamped(date, amount * 12);
}

export function addDuration(date: Date, duration: DateDuration): Date {
	let result = date;
	if (duration.years) result = addYears(result, duration.years);
	if (duration.months) result = addMonths(result, duration.months);
	if (duration.weeks) result = addWeeks(result, duration.weeks);
	if (duration.days) result = addDays(result, duration.days);
	if (duration.hours || duration.minutes || duration.seconds) {
		result = fromFields(
			result.getFullYear(),
			result.getMonth(),
			result.getDate(),
			result.getHours() + (duration.hours ?? 0),
			result.getMinutes() + (duration.minutes ?? 0),
			result.getSeconds() + (duration.seconds ?? 0),
			result.getMilliseconds(),
		);
	}
	return result;
}

export function subtractDuration(date: Date, duration: DateDuration): Date {
	const negated: DateDuration = {};
	for (const key of Object.keys(duration) as Array<keyof DateDuration>) {
		negated[key] = -(duration[key] ?? 0);
	}
	return addDuration(date, negated);
}

/* -----------------------------------------------------------------------------
 * Immutable setters — always build a fresh Date from a fully-computed tuple.
 * -----------------------------------------------------------------------------*/

export function setYear(date: Date, year: number): Date {
	const daysInTargetMonth = getDaysInMonth(
		fromFields(year, date.getMonth(), 1),
	);
	const clampedDay = Math.min(date.getDate(), daysInTargetMonth);
	return fromFields(
		year,
		date.getMonth(),
		clampedDay,
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds(),
	);
}

/** `month` is 0-indexed, matching native `Date.prototype.getMonth()`/`setMonth()`. */
export function setMonth(date: Date, month: number): Date {
	const targetYear = date.getFullYear() + Math.floor(month / 12);
	const normalizedMonth = ((month % 12) + 12) % 12;
	const daysInTargetMonth = getDaysInMonth(
		fromFields(targetYear, normalizedMonth, 1),
	);
	const clampedDay = Math.min(date.getDate(), daysInTargetMonth);
	return fromFields(
		targetYear,
		normalizedMonth,
		clampedDay,
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds(),
	);
}

export function setDay(date: Date, day: number): Date {
	return fromFields(
		date.getFullYear(),
		date.getMonth(),
		day,
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds(),
	);
}

export function setHours(date: Date, hours: number): Date {
	return fromFields(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		hours,
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds(),
	);
}

export function setMinutes(date: Date, minutes: number): Date {
	return fromFields(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
		minutes,
		date.getSeconds(),
		date.getMilliseconds(),
	);
}

export function setSeconds(date: Date, seconds: number): Date {
	return fromFields(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
		date.getMinutes(),
		seconds,
		date.getMilliseconds(),
	);
}

/* -----------------------------------------------------------------------------
 * DateField segment cycling — shares this bounds table with
 * `date-field/utils.ts`'s `getSegmentLimits` so the two can never drift.
 * -----------------------------------------------------------------------------*/

export function getFieldBounds(
	date: Date,
	field: CycleField | "dayPeriod",
	hour12: boolean,
): FieldBounds {
	switch (field) {
		case "year":
			return { value: date.getFullYear(), minValue: 1, maxValue: 9999 };
		case "month":
			return { value: date.getMonth() + 1, minValue: 1, maxValue: 12 };
		case "day":
			return {
				value: date.getDate(),
				minValue: 1,
				maxValue: getDaysInMonth(date),
			};
		case "dayPeriod":
			return {
				value: date.getHours() >= 12 ? 12 : 0,
				minValue: 0,
				maxValue: 12,
			};
		case "hour": {
			if (hour12) {
				const isPM = date.getHours() >= 12;
				return {
					value: date.getHours(),
					minValue: isPM ? 12 : 0,
					maxValue: isPM ? 23 : 11,
				};
			}
			return { value: date.getHours(), minValue: 0, maxValue: 23 };
		}
		case "minute":
			return { value: date.getMinutes(), minValue: 0, maxValue: 59 };
		case "second":
			return { value: date.getSeconds(), minValue: 0, maxValue: 59 };
	}
}

function applyFieldValue(
	date: Date,
	field: CycleField,
	newValue: number,
): Date {
	switch (field) {
		case "year":
			return setYear(date, newValue);
		case "month":
			return setMonth(date, newValue - 1); // newValue is the 1-indexed segment value
		case "day":
			return setDay(date, newValue);
		case "hour":
			return setHours(date, newValue);
		case "minute":
			return setMinutes(date, newValue);
		case "second":
			return setSeconds(date, newValue);
	}
}

/**
 * Increments/decrements a segment field with wraparound (real modulo, not `%`, which
 * produces negative results for negative amounts). `year` clamps instead of wrapping —
 * matches the pre-existing `@internationalized/date`-backed behavior (`round: true`).
 */
export function cycleField(
	date: Date,
	field: CycleField,
	amount: number,
	options: { hour12?: boolean } = {},
): Date {
	if (field === "year") {
		return setYear(date, date.getFullYear() + amount);
	}

	const { value, minValue, maxValue } = getFieldBounds(
		date,
		field,
		options.hour12 ?? false,
	);
	const range = maxValue - minValue + 1;
	const newValue =
		minValue + ((((value - minValue + amount) % range) + range) % range);

	return applyFieldValue(date, field, newValue);
}

/* -----------------------------------------------------------------------------
 * Serialization — deliberately does NOT emit a trailing `Z`/UTC offset: once values
 * have no explicit time zone, there is nothing truthful to claim about one.
 * -----------------------------------------------------------------------------*/

function pad(n: number, len = 2): string {
	return String(Math.abs(n)).padStart(len, "0");
}

export function toLocalISOString(
	date: Date,
	granularity: DateGranularity,
): string {
	const datePart = `${date.getFullYear() < 0 ? "-" : ""}${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

	if (granularity === "day") {
		return datePart;
	}

	let result = `${datePart}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

	if (granularity === "second") {
		result += `:${pad(date.getSeconds())}`;
	}

	return result;
}

const LOCAL_ISO_PATTERN =
	/^(-?\d{4,})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/;

/** Inverse of `toLocalISOString` — parses a local wall-clock date/time string, never UTC. */
export function parseLocalISOString(value: string): Date | undefined {
	const match = LOCAL_ISO_PATTERN.exec(value.trim());

	if (!match) {
		return undefined;
	}

	const [, year, month, day, hours, minutes, seconds] = match;

	const date = fromFields(
		Number(year),
		Number(month) - 1,
		Number(day),
		hours != null ? Number(hours) : 0,
		minutes != null ? Number(minutes) : 0,
		seconds != null ? Number(seconds) : 0,
	);

	return Number.isNaN(date.getTime()) ? undefined : date;
}
