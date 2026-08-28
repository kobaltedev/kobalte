import { createRoot, flush } from "solid-js";
import { vi } from "vitest";

import { createCalendarState } from "./create-calendar-state.ts";
import { toLocalISOString } from "./date-math.ts";

describe("createCalendarState", () => {
	it("defaults the focused date to `defaultFocusedValue` when provided", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				defaultFocusedValue: new Date(2024, 0, 15),
			});

			expect(toLocalISOString(state.focusedDate(), "day")).toBe("2024-01-15");

			dispose();
		});
	});

	it("focusNextDay/focusPreviousDay move the focused date by one day", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				defaultFocusedValue: new Date(2024, 0, 15),
			});

			state.focusNextDay();
			flush();
			expect(toLocalISOString(state.focusedDate(), "day")).toBe("2024-01-16");

			state.focusPreviousDay();
			flush();
			state.focusPreviousDay();
			flush();
			expect(toLocalISOString(state.focusedDate(), "day")).toBe("2024-01-14");

			dispose();
		});
	});

	it("focusNextRow/focusPreviousRow move the focused date by one week", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				defaultFocusedValue: new Date(2024, 0, 15),
			});

			state.focusNextRow();
			flush();
			expect(toLocalISOString(state.focusedDate(), "day")).toBe("2024-01-22");

			state.focusPreviousRow();
			flush();
			state.focusPreviousRow();
			flush();
			expect(toLocalISOString(state.focusedDate(), "day")).toBe("2024-01-08");

			dispose();
		});
	});

	it("focusNextPage/focusPreviousPage paginate by one month (default visibleDuration)", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				defaultFocusedValue: new Date(2024, 0, 15),
			});

			state.focusNextPage();
			flush();
			expect(state.focusedDate().getMonth()).toBe(1);
			expect(state.focusedDate().getFullYear()).toBe(2024);

			state.focusPreviousPage();
			flush();
			state.focusPreviousPage();
			flush();
			expect(state.focusedDate().getMonth()).toBe(11);
			expect(state.focusedDate().getFullYear()).toBe(2023);

			dispose();
		});
	});

	it("isCellSelected reflects the selected date in 'single' selection mode", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				selectionMode: "single",
				value: new Date(2024, 0, 15),
			});

			expect(state.isCellSelected(new Date(2024, 0, 15))).toBe(true);
			expect(state.isCellSelected(new Date(2024, 0, 16))).toBe(false);

			dispose();
		});
	});

	it("isCellSelected reflects the selected dates in 'multiple' selection mode", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				selectionMode: "multiple",
				value: [new Date(2024, 0, 15), new Date(2024, 0, 20)],
			});

			expect(state.isCellSelected(new Date(2024, 0, 15))).toBe(true);
			expect(state.isCellSelected(new Date(2024, 0, 20))).toBe(true);
			expect(state.isCellSelected(new Date(2024, 0, 16))).toBe(false);

			dispose();
		});
	});

	it("isCellSelected reflects the highlighted range in 'range' selection mode", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				selectionMode: "range",
				value: {
					start: new Date(2024, 0, 10),
					end: new Date(2024, 0, 20),
				},
			});

			expect(state.isCellSelected(new Date(2024, 0, 10))).toBe(true);
			expect(state.isCellSelected(new Date(2024, 0, 15))).toBe(true);
			expect(state.isCellSelected(new Date(2024, 0, 20))).toBe(true);
			expect(state.isCellSelected(new Date(2024, 0, 21))).toBe(false);
			expect(state.isCellSelected(new Date(2024, 0, 9))).toBe(false);

			dispose();
		});
	});

	it("isCellDisabled respects minValue/maxValue bounds", () => {
		createRoot((dispose) => {
			const state = createCalendarState({
				defaultFocusedValue: new Date(2024, 0, 15),
				minValue: new Date(2024, 0, 10),
				maxValue: new Date(2024, 0, 20),
			});

			expect(state.isCellDisabled(new Date(2024, 0, 9))).toBe(true);
			expect(state.isCellDisabled(new Date(2024, 0, 21))).toBe(true);
			expect(state.isCellDisabled(new Date(2024, 0, 15))).toBe(false);

			dispose();
		});
	});

	it("isCellUnavailable delegates to the `isDateUnavailable` callback", () => {
		createRoot((dispose) => {
			const isDateUnavailable = vi.fn((date: Date) => date.getDate() === 13);

			const state = createCalendarState({
				defaultFocusedValue: new Date(2024, 0, 15),
				isDateUnavailable,
			});

			expect(state.isCellUnavailable(new Date(2024, 0, 13))).toBe(true);
			expect(state.isCellUnavailable(new Date(2024, 0, 14))).toBe(false);

			dispose();
		});
	});

	it("selectDate commits a value in 'single' selection mode", () => {
		createRoot((dispose) => {
			const onChangeSpy = vi.fn();

			const state = createCalendarState({
				selectionMode: "single",
				defaultFocusedValue: new Date(2024, 0, 15),
				onChange: onChangeSpy,
			});

			state.selectDate(new Date(2024, 0, 18));

			expect(onChangeSpy).toHaveBeenCalledTimes(1);
			expect(
				toLocalISOString(onChangeSpy.mock.calls[0]![0] as Date, "day"),
			).toBe("2024-01-18");

			dispose();
		});
	});

	it("selectDate toggles a value in 'multiple' selection mode", () => {
		createRoot((dispose) => {
			const onChangeSpy = vi.fn();

			const state = createCalendarState({
				selectionMode: "multiple",
				defaultFocusedValue: new Date(2024, 0, 15),
				onChange: onChangeSpy,
			});

			state.selectDate(new Date(2024, 0, 18));

			expect(onChangeSpy).toHaveBeenCalledTimes(1);
			const firstCall = onChangeSpy.mock.calls[0]![0] as Date[];
			expect(firstCall.map((d) => toLocalISOString(d, "day"))).toEqual([
				"2024-01-18",
			]);

			dispose();
		});
	});

	it("selectDate sets the anchor then commits a range in 'range' selection mode", () => {
		createRoot((dispose) => {
			const onChangeSpy = vi.fn();

			const state = createCalendarState({
				selectionMode: "range",
				defaultFocusedValue: new Date(2024, 0, 15),
				onChange: onChangeSpy,
			});

			state.selectDate(new Date(2024, 0, 10));
			flush();
			expect(onChangeSpy).not.toHaveBeenCalled();
			expect(toLocalISOString(state.anchorDate()!, "day")).toBe("2024-01-10");

			state.selectDate(new Date(2024, 0, 20));
			flush();
			expect(onChangeSpy).toHaveBeenCalledTimes(1);

			const range = onChangeSpy.mock.calls[0]![0] as {
				start: Date;
				end: Date;
			};
			expect(toLocalISOString(range.start, "day")).toBe("2024-01-10");
			expect(toLocalISOString(range.end, "day")).toBe("2024-01-20");
			expect(state.anchorDate()).toBeUndefined();

			dispose();
		});
	});
});
