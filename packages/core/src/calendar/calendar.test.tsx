/*
 * Calendar logic ported from corvu/calendar (MIT) by Jasmin Noetzli.
 * State management based on React Spectrum (Apache 2.0, Adobe).
 */

import { CalendarDate, GregorianCalendar } from "@internationalized/date";
import { fireEvent, render } from "@solidjs/testing-library";
import type { ComponentProps } from "solid-js";
import { createSignal, flush, Show } from "solid-js";
import { vi } from "vitest";

import * as Calendar from ".";

const createGregorianCalendar = () => new GregorianCalendar();

// Pin to January 2024 for deterministic heading/cell assertions.
const JAN_2024 = new CalendarDate(2024, 1, 15);
const JAN_01_2024 = new CalendarDate(2024, 1, 1);
const JAN_10_2024 = new CalendarDate(2024, 1, 10);
const JAN_20_2024 = new CalendarDate(2024, 1, 20);

function CalendarExample(props: Partial<ComponentProps<typeof Calendar.Root>>) {
	return (
		<Calendar.Root
			createCalendar={createGregorianCalendar}
			selectionMode="single"
			defaultFocusedValue={JAN_2024}
			{...props}
		>
			<Calendar.Header>
				<Calendar.PrevTrigger data-testid="prev">‹</Calendar.PrevTrigger>
				<Calendar.Heading data-testid="heading" />
				<Calendar.NextTrigger data-testid="next">›</Calendar.NextTrigger>
			</Calendar.Header>
			<Calendar.Body>
				<Calendar.Grid>
					<Calendar.GridHeader>
						<Calendar.GridHeaderRow>
							{(day) => (
								<Calendar.GridHeaderCell>
									{day().slice(0, 2)}
								</Calendar.GridHeaderCell>
							)}
						</Calendar.GridHeaderRow>
					</Calendar.GridHeader>
					<Calendar.GridBody>
						{(weekIndex) => (
							<Calendar.GridBodyRow weekIndex={weekIndex()}>
								{(date) => (
									<Show when={date()} fallback={<td />}>
										{(d) => (
											<Calendar.GridBodyCell date={d()}>
												<Calendar.GridBodyCellTrigger />
											</Calendar.GridBodyCell>
										)}
									</Show>
								)}
							</Calendar.GridBodyRow>
						)}
					</Calendar.GridBody>
				</Calendar.Grid>
			</Calendar.Body>
		</Calendar.Root>
	);
}

describe("Calendar", () => {
	it("root has role='group'", () => {
		const { getByRole } = render(() => <CalendarExample />);
		expect(getByRole("group")).toBeInTheDocument();
	});

	it("heading shows the focused month and year", () => {
		const { getByTestId } = render(() => <CalendarExample />);
		expect(getByTestId("heading")).toHaveTextContent("January 2024");
	});

	it("next trigger advances to the following month", async () => {
		const { getByTestId } = render(() => <CalendarExample />);
		fireEvent.click(getByTestId("next"));
		flush();
		expect(getByTestId("heading")).toHaveTextContent("February 2024");
	});

	it("prev trigger moves back to the previous month", async () => {
		const { getByTestId } = render(() => <CalendarExample />);
		fireEvent.click(getByTestId("prev"));
		flush();
		expect(getByTestId("heading")).toHaveTextContent("December 2023");
	});

	it("clicking a date adds data-selected to its trigger", async () => {
		const { container } = render(() => <CalendarExample />);
		const cell = container.querySelector(
			'[data-value="2024-01-15"][data-type="day"]',
		) as HTMLElement;
		expect(cell).toBeInTheDocument();

		fireEvent.click(cell);
		flush();

		expect(cell).toHaveAttribute("data-selected");
	});

	it("fires onChange with the selected date", async () => {
		const onChange = vi.fn();
		const { container } = render(() => (
			<CalendarExample onChange={onChange} />
		));
		const cell = container.querySelector(
			'[data-value="2024-01-15"][data-type="day"]',
		) as HTMLElement;

		fireEvent.click(cell);
		flush();

		expect(onChange).toHaveBeenCalledOnce();
		const selected = onChange.mock.calls[0][0] as CalendarDate;
		expect(selected.toString()).toBe("2024-01-15");
	});

	it("clicking a selected date in multiple mode deselects it", async () => {
		const { container } = render(() => (
			<CalendarExample selectionMode="multiple" defaultValue={[JAN_2024]} />
		));
		const cell = container.querySelector(
			'[data-value="2024-01-15"][data-type="day"]',
		) as HTMLElement;
		expect(cell).toHaveAttribute("data-selected");

		fireEvent.click(cell);
		flush();

		expect(cell).not.toHaveAttribute("data-selected");
	});

	it("disabled calendar: cells carry data-disabled and onChange does not fire", async () => {
		const onChange = vi.fn();
		const { container } = render(() => (
			<CalendarExample disabled onChange={onChange} />
		));
		const cell = container.querySelector(
			'[data-value="2024-01-15"][data-type="day"]',
		) as HTMLElement;
		expect(cell).toHaveAttribute("data-disabled");

		fireEvent.click(cell);
		flush();

		expect(onChange).not.toHaveBeenCalled();
		expect(cell).not.toHaveAttribute("data-selected");
	});

	it("readOnly calendar: existing selection is shown but clicks are ignored", async () => {
		const onChange = vi.fn();
		const { container } = render(() => (
			<CalendarExample
				readOnly
				defaultValue={JAN_2024}
				onChange={onChange}
			/>
		));
		const selected = container.querySelector(
			'[data-value="2024-01-15"][data-type="day"]',
		) as HTMLElement;
		expect(selected).toHaveAttribute("data-selected");

		const other = container.querySelector(
			'[data-value="2024-01-10"][data-type="day"]',
		) as HTMLElement;
		fireEvent.click(other);
		flush();

		expect(onChange).not.toHaveBeenCalled();
		expect(selected).toHaveAttribute("data-selected");
		expect(other).not.toHaveAttribute("data-selected");
	});

	it("isDateUnavailable marks matching dates with data-unavailable", () => {
		const { container } = render(() => (
			<CalendarExample
				isDateUnavailable={(d) =>
					d.compare(JAN_10_2024) === 0
				}
			/>
		));
		const unavailable = container.querySelector(
			'[data-value="2024-01-10"][data-type="day"]',
		) as HTMLElement;
		expect(unavailable).toHaveAttribute("data-unavailable");
	});

	it("minValue disables dates before the minimum", () => {
		const { container } = render(() => (
			<CalendarExample minValue={JAN_10_2024} />
		));
		const beforeMin = container.querySelector(
			'[data-value="2024-01-01"][data-type="day"]',
		) as HTMLElement;
		expect(beforeMin).toHaveAttribute("data-disabled");
	});

	it("maxValue disables dates after the maximum", () => {
		const { container } = render(() => (
			<CalendarExample maxValue={JAN_10_2024} />
		));
		const afterMax = container.querySelector(
			'[data-value="2024-01-20"][data-type="day"]',
		) as HTMLElement;
		expect(afterMax).toHaveAttribute("data-disabled");
	});

	it("multiple selection: clicking two dates selects both", async () => {
		const { container } = render(() => (
			<CalendarExample selectionMode="multiple" />
		));
		const cell1 = container.querySelector(
			'[data-value="2024-01-10"][data-type="day"]',
		) as HTMLElement;
		const cell2 = container.querySelector(
			'[data-value="2024-01-20"][data-type="day"]',
		) as HTMLElement;

		fireEvent.click(cell1);
		flush();
		fireEvent.click(cell2);
		flush();

		expect(cell1).toHaveAttribute("data-selected");
		expect(cell2).toHaveAttribute("data-selected");
	});

	it("range selection: onChange fires with start and end after both are chosen", async () => {
		const onChange = vi.fn();
		const { container } = render(() => (
			<CalendarExample selectionMode="range" onChange={onChange} />
		));

		const start = container.querySelector(
			'[data-value="2024-01-10"][data-type="day"]',
		) as HTMLElement;
		const end = container.querySelector(
			'[data-value="2024-01-20"][data-type="day"]',
		) as HTMLElement;

		// Range selection uses pointer events, not click.
		// pointerDown on start sets the anchor; pointerUp on end commits the range.
		fireEvent.pointerDown(start, { pointerId: 1 });
		flush();
		fireEvent.pointerUp(start, { pointerId: 1 });
		flush();
		fireEvent.pointerDown(end, { pointerId: 1 });
		flush();
		fireEvent.pointerUp(end, { pointerId: 1 });
		flush();

		expect(onChange).toHaveBeenCalledOnce();
		const range = onChange.mock.calls[0][0] as {
			start: CalendarDate;
			end: CalendarDate;
		};
		expect(range.start.toString()).toBe("2024-01-10");
		expect(range.end.toString()).toBe("2024-01-20");
	});

	it("controlled value: externally changing value updates the selected date", async () => {
		const [value, setValue] = createSignal<CalendarDate | null>(null);
		const { container } = render(() => (
			<CalendarExample
				selectionMode="single"
				value={value()}
				onChange={(v) => setValue(v as CalendarDate)}
			/>
		));

		const cell = container.querySelector(
			'[data-value="2024-01-15"][data-type="day"]',
		) as HTMLElement;
		expect(cell).not.toHaveAttribute("data-selected");

		setValue(JAN_2024);
		flush();

		expect(cell).toHaveAttribute("data-selected");
	});
});
