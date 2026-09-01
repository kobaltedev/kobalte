import {
	addDays,
	addMonths,
	addYears,
	compareDates,
	cycleField,
	getDayOfWeek,
	getDaysInMonth,
	getWeeksInMonth,
	isSameDay,
	parseLocalISOString,
	setMonth,
	setYear,
	startOfWeek,
	toLocalISOString,
} from "./date-math.ts";

describe("date-math", () => {
	describe("addMonths", () => {
		it("clamps to the last valid day instead of rolling over (Jan 31 -> Feb, non-leap)", () => {
			const result = addMonths(new Date(2023, 0, 31), 1);
			expect(result.getFullYear()).toBe(2023);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(28);
		});

		it("clamps to Feb 29 in a leap year", () => {
			const result = addMonths(new Date(2024, 0, 31), 1);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(29);
		});

		it("Dec 31 + 1 month -> Jan 31 next year", () => {
			const result = addMonths(new Date(2024, 11, 31), 1);
			expect(result.getFullYear()).toBe(2025);
			expect(result.getMonth()).toBe(0);
			expect(result.getDate()).toBe(31);
		});

		it("supports negative amounts (Mar 31 - 1 month -> Feb 28)", () => {
			const result = addMonths(new Date(2023, 2, 31), -1);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(28);
		});

		it("crosses multiple year boundaries (Jan 2024 + 13 months)", () => {
			const result = addMonths(new Date(2024, 0, 15), 13);
			expect(result.getFullYear()).toBe(2025);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(15);
		});

		it("preserves time-of-day fields", () => {
			const result = addMonths(new Date(2024, 0, 15, 10, 30, 45), 1);
			expect(result.getHours()).toBe(10);
			expect(result.getMinutes()).toBe(30);
			expect(result.getSeconds()).toBe(45);
		});
	});

	describe("addYears", () => {
		it("Feb 29 2024 + 1 year -> Feb 28 2025 (non-leap target)", () => {
			const result = addYears(new Date(2024, 1, 29), 1);
			expect(result.getFullYear()).toBe(2025);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(28);
		});

		it("Feb 29 2024 + 4 years -> Feb 29 2028 (leap target)", () => {
			const result = addYears(new Date(2024, 1, 29), 4);
			expect(result.getFullYear()).toBe(2028);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(29);
		});

		it("negative years across a leap boundary", () => {
			const result = addYears(new Date(2024, 1, 29), -1);
			expect(result.getFullYear()).toBe(2023);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(28);
		});
	});

	describe("addDays", () => {
		it("rolls over month/year correctly", () => {
			const result = addDays(new Date(2024, 0, 31), 1);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(1);
		});

		it("leap-day Feb 29 + 1 -> Mar 1 in a leap year", () => {
			const result = addDays(new Date(2024, 1, 29), 1);
			expect(result.getMonth()).toBe(2);
			expect(result.getDate()).toBe(1);
		});
	});

	describe("setMonth / setYear clamp instead of rolling over", () => {
		it("setMonth: Jan 31 -> Feb clamps to 28/29", () => {
			const result = setMonth(new Date(2023, 0, 31), 1);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(28);
		});

		it("setYear: Feb 29 (leap) -> non-leap year clamps to Feb 28", () => {
			const result = setYear(new Date(2024, 1, 29), 2023);
			expect(result.getMonth()).toBe(1);
			expect(result.getDate()).toBe(28);
		});
	});

	describe("locale week math", () => {
		it("en-US is Sunday-first", () => {
			// Jan 1 2024 is a Monday.
			const start = startOfWeek(new Date(2024, 0, 1), "en-US");
			expect(start.getDay()).toBe(0);
			expect(start.getDate()).toBe(31);
			expect(start.getMonth()).toBe(11);
		});

		it("fr-FR is Monday-first", () => {
			const start = startOfWeek(new Date(2024, 0, 1), "fr-FR");
			expect(start.getDay()).toBe(1);
			expect(start.getDate()).toBe(1);
		});

		it("getDayOfWeek is relative to the locale's first day", () => {
			// Jan 1 2024 is a Monday: index 1 in a Sunday-first week, index 0 in a Monday-first week.
			expect(getDayOfWeek(new Date(2024, 0, 1), "en-US")).toBe(1);
			expect(getDayOfWeek(new Date(2024, 0, 1), "fr-FR")).toBe(0);
		});
	});

	describe("getWeeksInMonth", () => {
		it("handles February in a leap year vs non-leap year", () => {
			expect(
				getWeeksInMonth(new Date(2024, 1, 1), "en-US"),
			).toBeGreaterThanOrEqual(4);
			expect(
				getWeeksInMonth(new Date(2023, 1, 1), "en-US"),
			).toBeGreaterThanOrEqual(4);
		});

		it("covers months starting on different weekdays (en-US, Sunday-first), against independently hand-computed row counts", () => {
			// Jan 2024: 1st is a Monday (weekday index 1), 31 days -> ceil((1+31)/7) = 5 rows.
			expect(getWeeksInMonth(new Date(2024, 0, 1), "en-US")).toBe(5);
			// Jun 2024: 1st is a Saturday (weekday index 6), 30 days -> ceil((6+30)/7) = 6 rows.
			expect(getWeeksInMonth(new Date(2024, 5, 1), "en-US")).toBe(6);
			// Sep 2024: 1st is a Sunday (weekday index 0), 30 days -> ceil((0+30)/7) = 5 rows.
			expect(getWeeksInMonth(new Date(2024, 8, 1), "en-US")).toBe(5);
		});
	});

	describe("getDaysInMonth", () => {
		it("returns correct lengths for every month, including leap/non-leap Feb", () => {
			const lengths2024 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			const lengths2023 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			lengths2024.forEach((expected, month) => {
				expect(getDaysInMonth(new Date(2024, month, 1))).toBe(expected);
			});
			lengths2023.forEach((expected, month) => {
				expect(getDaysInMonth(new Date(2023, month, 1))).toBe(expected);
			});
		});
	});

	describe("compareDates / isSameDay", () => {
		it("same day different times are not equal instants but are the same day", () => {
			const a = new Date(2024, 0, 15, 8, 0, 0);
			const b = new Date(2024, 0, 15, 20, 0, 0);
			expect(compareDates(a, b)).not.toBe(0);
			expect(isSameDay(a, b)).toBe(true);
		});

		it("different days compare correctly", () => {
			const a = new Date(2024, 0, 15);
			const b = new Date(2024, 0, 16);
			expect(compareDates(a, b)).toBeLessThan(0);
			expect(isSameDay(a, b)).toBe(false);
		});

		it("distinguishes across a midnight boundary by a few ms", () => {
			const a = new Date(2024, 0, 15, 23, 59, 59, 999);
			const b = new Date(2024, 0, 16, 0, 0, 0, 0);
			expect(isSameDay(a, b)).toBe(false);
			expect(compareDates(b, a)).toBeGreaterThan(0);
		});
	});

	describe("cycleField", () => {
		it("wraps day at the min/max boundary", () => {
			const atMax = new Date(2024, 0, 31); // January has 31 days
			expect(cycleField(atMax, "day", 1).getDate()).toBe(1);
			const atMin = new Date(2024, 0, 1);
			expect(cycleField(atMin, "day", -1).getDate()).toBe(31);
		});

		it("wraps month at the min/max boundary", () => {
			const atMax = new Date(2024, 11, 15);
			expect(cycleField(atMax, "month", 1).getMonth()).toBe(0);
			const atMin = new Date(2024, 0, 15);
			expect(cycleField(atMin, "month", -1).getMonth()).toBe(11);
		});

		it("year does NOT wrap — it clamps/increments linearly", () => {
			const date = new Date(9999, 0, 1);
			expect(cycleField(date, "year", 1).getFullYear()).toBe(10000);

			// `new Date(1, 0, 1)` would be misinterpreted as the year 1901 by the native
			// two-digit-year constructor quirk — build "year 1" via setFullYear instead.
			const dateAtOne = new Date(0);
			dateAtOne.setFullYear(1, 0, 1);
			expect(cycleField(dateAtOne, "year", -1).getFullYear()).toBe(0);
		});

		it("12-hour cycling never flips AM/PM", () => {
			// 11 AM -> +1 hour wraps within the AM half (0-11), never becomes PM.
			const am = new Date(2024, 0, 1, 11, 0, 0);
			const cycledAm = cycleField(am, "hour", 1, { hour12: true });
			expect(cycledAm.getHours()).toBeLessThan(12);

			// 11 PM (23:00) -> +1 hour wraps within the PM half (12-23), never becomes AM.
			const pm = new Date(2024, 0, 1, 23, 0, 0);
			const cycledPm = cycleField(pm, "hour", 1, { hour12: true });
			expect(cycledPm.getHours()).toBeGreaterThanOrEqual(12);
		});

		it("24-hour cycling wraps across the full 0-23 range", () => {
			const date = new Date(2024, 0, 1, 23, 0, 0);
			expect(cycleField(date, "hour", 1, { hour12: false }).getHours()).toBe(0);
		});

		it("minute/second wrap at 0/59", () => {
			expect(
				cycleField(new Date(2024, 0, 1, 0, 59, 0), "minute", 1).getMinutes(),
			).toBe(0);
			expect(
				cycleField(new Date(2024, 0, 1, 0, 0, 59), "second", 1).getSeconds(),
			).toBe(0);
		});
	});

	describe("toLocalISOString / parseLocalISOString round trip", () => {
		it("round-trips day granularity", () => {
			const date = new Date(2024, 0, 15);
			const str = toLocalISOString(date, "day");
			expect(str).toBe("2024-01-15");
			expect(isSameDay(parseLocalISOString(str)!, date)).toBe(true);
		});

		it("round-trips minute granularity", () => {
			const date = new Date(2024, 0, 15, 14, 30);
			const str = toLocalISOString(date, "minute");
			expect(str).toBe("2024-01-15T14:30");
			const parsed = parseLocalISOString(str)!;
			expect(parsed.getHours()).toBe(14);
			expect(parsed.getMinutes()).toBe(30);
		});

		it("round-trips second granularity", () => {
			const date = new Date(2024, 0, 15, 14, 30, 45);
			const str = toLocalISOString(date, "second");
			expect(str).toBe("2024-01-15T14:30:45");
			const parsed = parseLocalISOString(str)!;
			expect(parsed.getSeconds()).toBe(45);
		});

		it("never emits a trailing Z/offset", () => {
			expect(
				toLocalISOString(new Date(2024, 0, 15, 14, 30, 45), "second"),
			).not.toMatch(/Z|[+-]\d{2}:\d{2}$/);
		});

		it("returns undefined for garbage input", () => {
			expect(parseLocalISOString("not a date")).toBeUndefined();
		});
	});
});
