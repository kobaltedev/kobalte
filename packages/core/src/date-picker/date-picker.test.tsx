import { CalendarDate } from "@internationalized/date";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as DatePicker from ".";

function DatePickerExample(props: any) {
	return (
		<DatePicker.Root {...props}>
			<DatePicker.Trigger>
				<DatePicker.Value>Pick a date</DatePicker.Value>
			</DatePicker.Trigger>
			<DatePicker.Portal>
				<DatePicker.Content>
					<DatePicker.Calendar>
						<DatePicker.CalendarHeader>
							<DatePicker.CalendarPrevTrigger>
								Previous
							</DatePicker.CalendarPrevTrigger>
							<DatePicker.CalendarHeading />
							<DatePicker.CalendarNextTrigger>
								Next
							</DatePicker.CalendarNextTrigger>
						</DatePicker.CalendarHeader>
						<DatePicker.CalendarBody>
							<DatePicker.CalendarGrid>
								<DatePicker.CalendarGridBody>
									{(weekIndex: any) => (
										<DatePicker.CalendarGridBodyRow weekIndex={weekIndex()}>
											{(date: any) => (
												<DatePicker.CalendarGridBodyCell date={date()!}>
													<DatePicker.CalendarGridBodyCellTrigger />
												</DatePicker.CalendarGridBodyCell>
											)}
										</DatePicker.CalendarGridBodyRow>
									)}
								</DatePicker.CalendarGridBody>
							</DatePicker.CalendarGrid>
						</DatePicker.CalendarBody>
					</DatePicker.Calendar>
				</DatePicker.Content>
			</DatePicker.Portal>
		</DatePicker.Root>
	);
}

// `DatePicker.Content` renders via `<Portal>`, moving it to `document.body`, outside the
// render's own local `container` — so queries for anything inside it (the calendar grid
// cells, the dialog itself) must use `screen` (bound to the whole document) rather than
// the `container`-scoped queries returned by `render()`.
function getCell(isoDate: string) {
	const el = document.body.querySelector<HTMLElement>(
		`[data-value="${isoDate}"][data-type="day"]`,
	);
	if (!el) {
		throw new Error(`No day cell trigger found for ${isoDate}`);
	}
	return el;
}

describe("DatePicker", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it("is closed by default", () => {
		render(() => <DatePickerExample selectionMode="single" />);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("opens on trigger click", async () => {
		render(() => <DatePickerExample selectionMode="single" />);

		fireEvent.click(screen.getByRole("button"));
		await Promise.resolve();

		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("commits a value and closes in 'single' selection mode when a date is clicked", async () => {
		const onChangeSpy = vi.fn();

		render(() => (
			<DatePickerExample
				selectionMode="single"
				defaultValue={new CalendarDate(2024, 1, 15)}
				onChange={onChangeSpy}
			/>
		));

		fireEvent.click(screen.getByRole("button"));
		await Promise.resolve();
		expect(screen.getByRole("dialog")).toBeInTheDocument();

		fireEvent.click(getCell("2024-01-20"));
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect((onChangeSpy.mock.calls[0]![0] as CalendarDate).day).toBe(20);

		// flush the exit transition timer and Solid's microtask scheduler
		vi.runAllTimers();
		await Promise.resolve();

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("commits a value and stays open in 'multiple' selection mode", async () => {
		const onChangeSpy = vi.fn();

		render(() => (
			<DatePickerExample
				selectionMode="multiple"
				defaultValue={[new CalendarDate(2024, 1, 15)]}
				onChange={onChangeSpy}
			/>
		));

		fireEvent.click(screen.getByRole("button"));
		await Promise.resolve();
		fireEvent.click(getCell("2024-01-20"));
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		const dates = onChangeSpy.mock.calls[0]![0] as CalendarDate[];
		expect(dates.map((d) => d.day).sort()).toEqual([15, 20]);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("commits a range and closes in 'range' selection mode", async () => {
		const onChangeSpy = vi.fn();

		render(() => (
			<DatePickerExample
				selectionMode="range"
				placeholderValue={new CalendarDate(2024, 1, 15)}
				onChange={onChangeSpy}
			/>
		));

		fireEvent.click(screen.getByRole("button"));
		await Promise.resolve();

		fireEvent.click(getCell("2024-01-10"));
		await Promise.resolve();

		expect(onChangeSpy).not.toHaveBeenCalled();

		fireEvent.click(getCell("2024-01-20"));
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		const range = onChangeSpy.mock.calls[0]![0] as {
			start: CalendarDate;
			end: CalendarDate;
		};
		expect(range.start.day).toBe(10);
		expect(range.end.day).toBe(20);
	});

	it("reflects invalid validation state on the input when value is outside min/max", () => {
		render(() => (
			<DatePickerExample
				selectionMode="single"
				value={new CalendarDate(2024, 1, 1)}
				minValue={new CalendarDate(2024, 6, 1)}
			/>
		));

		expect(document.querySelector('[aria-invalid="true"]')).not.toBeNull();
	});

	it("does not open when disabled", () => {
		render(() => <DatePickerExample selectionMode="single" disabled />);

		fireEvent.click(screen.getByRole("button"));

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});
