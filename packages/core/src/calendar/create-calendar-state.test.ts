import {
	type Calendar,
	CalendarDate,
	createCalendar as createCalendarFn,
} from "@internationalized/date";
import { createRoot, flush } from "solid-js";
import { vi } from "vitest";

import { createCalendarState } from "./create-calendar-state.ts";

// `createCalendarFn`'s parameter is typed as the narrower `CalendarIdentifier`
// union rather than `string`; widen it once here to match `createCalendar`'s
// public `(name: string) => Calendar` contract.
const createCalendar = createCalendarFn as (name: string) => Calendar;

describe("createCalendarState", () => {
	it("defaults the focused date to `defaultFocusedValue` when provided", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				createCalendar,
				defaultFocusedValue: new CalendarDate(2024, 1, 15),
			});

			expect(state.focusedDate().toString()).toBe(
				new CalendarDate(2024, 1, 15).toString(),
			);

			dispose();
		});
	});

	it("focusNextDay/focusPreviousDay move the focused date by one day", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				createCalendar,
				defaultFocusedValue: new CalendarDate(2024, 1, 15),
			});

			state.focusNextDay();
			flush();
			expect(state.focusedDate().toString()).toBe(
				new CalendarDate(2024, 1, 16).toString(),
			);

			state.focusPreviousDay();
			flush();
			state.focusPreviousDay();
			flush();
			expect(state.focusedDate().toString()).toBe(
				new CalendarDate(2024, 1, 14).toString(),
			);

			dispose();
		});
	});

	it("focusNextRow/focusPreviousRow move the focused date by one week", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				createCalendar,
				defaultFocusedValue: new CalendarDate(2024, 1, 15),
			});

			state.focusNextRow();
			flush();
			expect(state.focusedDate().toString()).toBe(
				new CalendarDate(2024, 1, 22).toString(),
			);

			state.focusPreviousRow();
			flush();
			state.focusPreviousRow();
			flush();
			expect(state.focusedDate().toString()).toBe(
				new CalendarDate(2024, 1, 8).toString(),
			);

			dispose();
		});
	});

	it("focusNextPage/focusPreviousPage paginate by one month (default visibleDuration)", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				createCalendar,
				defaultFocusedValue: new CalendarDate(2024, 1, 15),
			});

			state.focusNextPage();
			flush();
			expect(state.focusedDate().month).toBe(2);
			expect(state.focusedDate().year).toBe(2024);

			state.focusPreviousPage();
			flush();
			state.focusPreviousPage();
			flush();
			expect(state.focusedDate().month).toBe(12);
			expect(state.focusedDate().year).toBe(2023);

			dispose();
		});
	});

	it("isCellSelected reflects the selected date in 'single' selection mode", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				createCalendar,
				selectionMode: "single",
				value: new CalendarDate(2024, 1, 15),
			});

			expect(state.isCellSelected(new CalendarDate(2024, 1, 15))).toBe(true);
			expect(state.isCellSelected(new CalendarDate(2024, 1, 16))).toBe(false);

			dispose();
		});
	});

	it("isCellSelected reflects the selected dates in 'multiple' selection mode", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				createCalendar,
				selectionMode: "multiple",
				value: [new CalendarDate(2024, 1, 15), new CalendarDate(2024, 1, 20)],
			});

			expect(state.isCellSelected(new CalendarDate(2024, 1, 15))).toBe(true);
			expect(state.isCellSelected(new CalendarDate(2024, 1, 20))).toBe(true);
			expect(state.isCellSelected(new CalendarDate(2024, 1, 16))).toBe(false);

			dispose();
		});
	});

	it("isCellSelected reflects the highlighted range in 'range' selection mode", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				createCalendar,
				selectionMode: "range",
				value: {
					start: new CalendarDate(2024, 1, 10),
					end: new CalendarDate(2024, 1, 20),
				},
			});

			expect(state.isCellSelected(new CalendarDate(2024, 1, 10))).toBe(true);
			expect(state.isCellSelected(new CalendarDate(2024, 1, 15))).toBe(true);
			expect(state.isCellSelected(new CalendarDate(2024, 1, 20))).toBe(true);
			expect(state.isCellSelected(new CalendarDate(2024, 1, 21))).toBe(false);
			expect(state.isCellSelected(new CalendarDate(2024, 1, 9))).toBe(false);

			dispose();
		});
	});

	it("isCellDisabled respects minValue/maxValue bounds", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				createCalendar,
				defaultFocusedValue: new CalendarDate(2024, 1, 15),
				minValue: new CalendarDate(2024, 1, 10),
				maxValue: new CalendarDate(2024, 1, 20),
			});

			expect(state.isCellDisabled(new CalendarDate(2024, 1, 9))).toBe(true);
			expect(state.isCellDisabled(new CalendarDate(2024, 1, 21))).toBe(true);
			expect(state.isCellDisabled(new CalendarDate(2024, 1, 15))).toBe(false);

			dispose();
		});
	});

	it("isCellUnavailable delegates to the `isDateUnavailable` callback", () => {
		createRoot((dispose) => {
			const isDateUnavailable = vi.fn((date: CalendarDate) => date.day === 13);

			const state = createCalendarState({
				createCalendar,
				defaultFocusedValue: new CalendarDate(2024, 1, 15),
				isDateUnavailable: isDateUnavailable as (date: any) => boolean,
			});

			expect(state.isCellUnavailable(new CalendarDate(2024, 1, 13))).toBe(true);
			expect(state.isCellUnavailable(new CalendarDate(2024, 1, 14))).toBe(
				false,
			);

			dispose();
		});
	});

	it("selectDate commits a value in 'single' selection mode", () => {
		createRoot((dispose) => {
			const onChangeSpy = vi.fn();

			const state = createCalendarState({
				createCalendar,
				selectionMode: "single",
				defaultFocusedValue: new CalendarDate(2024, 1, 15),
				onChange: onChangeSpy,
			});

			state.selectDate(new CalendarDate(2024, 1, 18));

			expect(onChangeSpy).toHaveBeenCalledTimes(1);
			expect((onChangeSpy.mock.calls[0]![0] as CalendarDate).toString()).toBe(
				new CalendarDate(2024, 1, 18).toString(),
			);

			dispose();
		});
	});

	it("selectDate toggles a value in 'multiple' selection mode", () => {
		createRoot((dispose) => {
			const onChangeSpy = vi.fn();

			const state = createCalendarState({
				createCalendar,
				selectionMode: "multiple",
				defaultFocusedValue: new CalendarDate(2024, 1, 15),
				onChange: onChangeSpy,
			});

			state.selectDate(new CalendarDate(2024, 1, 18));

			expect(onChangeSpy).toHaveBeenCalledTimes(1);
			const firstCall = onChangeSpy.mock.calls[0]![0] as CalendarDate[];
			expect(firstCall.map((d) => d.toString())).toEqual([
				new CalendarDate(2024, 1, 18).toString(),
			]);

			dispose();
		});
	});

	it("selectDate sets the anchor then commits a range in 'range' selection mode", () => {
		createRoot((dispose) => {
			const onChangeSpy = vi.fn();

			const state = createCalendarState({
				createCalendar,
				selectionMode: "range",
				defaultFocusedValue: new CalendarDate(2024, 1, 15),
				onChange: onChangeSpy,
			});

			state.selectDate(new CalendarDate(2024, 1, 10));
			flush();
			expect(onChangeSpy).not.toHaveBeenCalled();
			expect(state.anchorDate()?.toString()).toBe(
				new CalendarDate(2024, 1, 10).toString(),
			);

			state.selectDate(new CalendarDate(2024, 1, 20));
			flush();
			expect(onChangeSpy).toHaveBeenCalledTimes(1);

			const range = onChangeSpy.mock.calls[0]![0] as {
				start: CalendarDate;
				end: CalendarDate;
			};
			expect(range.start.toString()).toBe(
				new CalendarDate(2024, 1, 10).toString(),
			);
			expect(range.end.toString()).toBe(
				new CalendarDate(2024, 1, 20).toString(),
			);
			expect(state.anchorDate()).toBeUndefined();

			dispose();
		});
	});
});
