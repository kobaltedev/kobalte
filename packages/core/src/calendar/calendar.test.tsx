import { fireEvent, render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as Calendar from ".";

function CalendarExample(props: any) {
	return (
		<Calendar.Root {...props}>
			<Calendar.Header>
				<Calendar.PrevTrigger>Previous</Calendar.PrevTrigger>
				<Calendar.Heading />
				<Calendar.NextTrigger>Next</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body>
				<Calendar.Grid>
					<Calendar.GridHeader>
						<Calendar.GridHeaderRow>
							{(weekDay) => (
								<Calendar.GridHeaderCell>{weekDay()}</Calendar.GridHeaderCell>
							)}
						</Calendar.GridHeaderRow>
					</Calendar.GridHeader>
					<Calendar.GridBody>
						{(weekIndex) => (
							<Calendar.GridBodyRow weekIndex={weekIndex()}>
								{(date) => (
									<Calendar.GridBodyCell date={date()!}>
										<Calendar.GridBodyCellTrigger />
									</Calendar.GridBodyCell>
								)}
							</Calendar.GridBodyRow>
						)}
					</Calendar.GridBody>
				</Calendar.Grid>
			</Calendar.Body>
		</Calendar.Root>
	);
}

function getCell(container: HTMLElement, isoDate: string) {
	const el = container.querySelector<HTMLElement>(
		`[data-value="${isoDate}"][data-type="day"]`,
	);
	if (!el) {
		throw new Error(`No day cell trigger found for ${isoDate}`);
	}
	return el;
}

describe("Calendar", () => {
	it("renders a grid of day cells for the visible month", () => {
		const { getByRole } = render(() => (
			<CalendarExample
				selectionMode="single"
				defaultFocusedValue={new Date(2024, 0, 15)}
			/>
		));

		expect(getByRole("grid")).toBeInTheDocument();

		// January 2024 has 31 days.
		const dayButtons = getByRole("grid").querySelectorAll('[data-type="day"]');
		expect(dayButtons.length).toBeGreaterThanOrEqual(31);
	});

	it("selects a date by click in 'single' selection mode", () => {
		const onChangeSpy = vi.fn();

		const { container } = render(() => (
			<CalendarExample
				selectionMode="single"
				defaultFocusedValue={new Date(2024, 0, 15)}
				onChange={onChangeSpy}
			/>
		));

		fireEvent.click(getCell(container, "2024-01-15"));

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect((onChangeSpy.mock.calls[0]![0] as Date).getDate()).toBe(15);
	});

	it("selects multiple dates by click in 'multiple' selection mode", () => {
		const onChangeSpy = vi.fn();

		const { container } = render(() => (
			<CalendarExample
				selectionMode="multiple"
				defaultFocusedValue={new Date(2024, 0, 15)}
				onChange={onChangeSpy}
			/>
		));

		fireEvent.click(getCell(container, "2024-01-15"));

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		const dates = onChangeSpy.mock.calls[0]![0] as Date[];
		expect(dates).toHaveLength(1);
		expect(dates[0]!.getDate()).toBe(15);
	});

	it("selects a range by clicking a start then an end date in 'range' selection mode", async () => {
		const onChangeSpy = vi.fn();

		const { container } = render(() => (
			<CalendarExample
				selectionMode="range"
				defaultFocusedValue={new Date(2024, 0, 15)}
				onChange={onChangeSpy}
			/>
		));

		fireEvent.click(getCell(container, "2024-01-10"));

		// Flush the microtask queue so the first click's state update (anchorDate)
		// is committed before the second, separate click reads it — mirrors how a
		// real browser yields between distinct click events.
		await Promise.resolve();

		expect(onChangeSpy).not.toHaveBeenCalled();

		fireEvent.click(getCell(container, "2024-01-20"));

		expect(onChangeSpy).toHaveBeenCalledTimes(1);

		const range = onChangeSpy.mock.calls[0]![0] as {
			start: Date;
			end: Date;
		};

		expect(range.start.getDate()).toBe(10);
		expect(range.end.getDate()).toBe(20);
	});

	it("moves focus with arrow keys", async () => {
		const { container, getByRole } = render(() => (
			<CalendarExample
				selectionMode="single"
				defaultFocusedValue={new Date(2024, 0, 15)}
			/>
		));

		const grid = getByRole("grid");

		fireEvent.keyDown(grid, { key: "ArrowRight" });
		await Promise.resolve();

		expect(getCell(container, "2024-01-16")).toHaveAttribute("tabindex", "0");
		expect(getCell(container, "2024-01-15")).toHaveAttribute("tabindex", "-1");
	});

	it("disables cells outside of min/max bounds", () => {
		const { container } = render(() => (
			<CalendarExample
				selectionMode="single"
				defaultFocusedValue={new Date(2024, 0, 15)}
				minValue={new Date(2024, 0, 10)}
				maxValue={new Date(2024, 0, 20)}
			/>
		));

		expect(getCell(container, "2024-01-05")).toHaveAttribute(
			"aria-disabled",
			"true",
		);
		expect(getCell(container, "2024-01-25")).toHaveAttribute(
			"aria-disabled",
			"true",
		);
		expect(getCell(container, "2024-01-15")).not.toHaveAttribute(
			"aria-disabled",
		);
	});

	it("reflects disabled state on the grid", () => {
		const { getByRole } = render(() => (
			<CalendarExample
				selectionMode="single"
				defaultFocusedValue={new Date(2024, 0, 15)}
				disabled
			/>
		));

		expect(getByRole("grid")).toHaveAttribute("aria-disabled", "true");
	});
});
