import { fireEvent, render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as DateField from ".";

function DateFieldExample(props: DateField.DateFieldRootOptions) {
	return (
		<DateField.Root {...props}>
			<DateField.Label>Date</DateField.Label>
			<DateField.Input>
				{(segment) => <DateField.Segment segment={segment()} />}
			</DateField.Input>
		</DateField.Root>
	);
}

describe("DateField", () => {
	it("renders a segment per date part for the default granularity", () => {
		const { getAllByRole } = render(() => <DateFieldExample />);

		const segments = getAllByRole("spinbutton");

		// month, day, year (default granularity is "day", maxGranularity "year").
		expect(segments).toHaveLength(3);
	});

	it("renders the segments for a default value", () => {
		const { getByText } = render(() => (
			// January 15, 2024 (native Date months are 0-indexed).
			<DateFieldExample defaultValue={new Date(2024, 0, 15)} />
		));

		expect(getByText("1")).toBeInTheDocument();
		expect(getByText("15")).toBeInTheDocument();
		expect(getByText("2024")).toBeInTheDocument();
	});

	it("increments a segment on ArrowUp and commits the change", () => {
		const onChangeSpy = vi.fn();

		const { getAllByRole } = render(() => (
			<DateFieldExample
				defaultValue={new Date(2024, 0, 15)}
				onChange={onChangeSpy}
			/>
		));

		const [, daySegment] = getAllByRole("spinbutton");

		fireEvent.keyDown(daySegment!, { key: "ArrowUp" });

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect((onChangeSpy.mock.calls[0]![0] as Date).getDate()).toBe(16);
	});

	it("does not commit a value until all segments are filled in (uncontrolled)", () => {
		const onChangeSpy = vi.fn();

		const { getAllByRole } = render(() => (
			<DateFieldExample onChange={onChangeSpy} />
		));

		const [monthSegment] = getAllByRole("spinbutton");

		// Only the month segment has been touched, day/year are still placeholders.
		fireEvent.keyDown(monthSegment!, { key: "ArrowUp" });

		expect(onChangeSpy).not.toHaveBeenCalled();
	});

	it("reflects disabled state on segments", () => {
		const { getAllByRole } = render(() => <DateFieldExample disabled />);

		for (const segment of getAllByRole("spinbutton")) {
			expect(segment).toHaveAttribute("aria-disabled", "true");
		}
	});

	it("has 'invalid' validation state when value is outside min/max", () => {
		const { getByRole } = render(() => (
			<DateFieldExample
				value={new Date(2024, 0, 1)}
				minValue={new Date(2024, 5, 1)}
			/>
		));

		expect(getByRole("group")).toHaveAttribute("aria-invalid", "true");
	});
});
