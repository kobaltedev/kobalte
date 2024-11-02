/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/meter/src/useMeter.ts
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/meter/test/Meter.test.js 
 
*/

import { render } from "@solidjs/testing-library";

import * as Meter from ".";

describe("Meter", () => {
	it("handles defaults", () => {
		const { getByRole, getByTestId } = render(() => (
			<Meter.Root>
				<Meter.Label>Meter</Meter.Label>
				<Meter.ValueLabel data-testid="value-label" />
				<Meter.Track>
					<Meter.Fill />
				</Meter.Track>
			</Meter.Root>
		));

		const meter = getByRole("meter");
		expect(meter).toHaveAttribute("aria-valuemin", "0");
		expect(meter).toHaveAttribute("aria-valuemax", "100");
		expect(meter).toHaveAttribute("aria-valuenow", "0");
		expect(meter).toHaveAttribute("aria-valuetext", "0%");

		const valueLabel = getByTestId("value-label");
		expect(valueLabel).toHaveTextContent("0%");

		const labelId = meter.getAttribute("aria-labelledby");
		expect(labelId).toBeDefined();

		const label = document.getElementById(labelId!);
		expect(label).toHaveTextContent("Meter");
	});

	it("supports custom value label", () => {
		const { getByRole, getByTestId } = render(() => (
			<Meter.Root
				value={3}
				minValue={0}
				maxValue={10}
				getValueLabel={({ value, max }) => `${value} of ${max} completed`}
			>
				<Meter.Label>Meter</Meter.Label>
				<Meter.ValueLabel data-testid="value-label" />
				<Meter.Track>
					<Meter.Fill />
				</Meter.Track>
			</Meter.Root>
		));

		const meter = getByRole("meter");
		expect(meter).toHaveAttribute("aria-valuetext", "3 of 10 completed");

		const valueLabel = getByTestId("value-label");
		expect(valueLabel).toHaveTextContent("3 of 10 completed");
	});

	it("should update all fields by value", () => {
		const { getByRole } = render(() => (
			<Meter.Root value={30}>
				<Meter.Label>Meter</Meter.Label>
				<Meter.ValueLabel />
				<Meter.Track>
					<Meter.Fill />
				</Meter.Track>
			</Meter.Root>
		));

		const meter = getByRole("meter");

		expect(meter).toHaveAttribute("aria-valuemin", "0");
		expect(meter).toHaveAttribute("aria-valuemax", "100");
		expect(meter).toHaveAttribute("aria-valuenow", "30");
		expect(meter).toHaveAttribute("aria-valuetext", "30%");
	});

	it("should clamps values to 'minValue'", () => {
		const { getByRole } = render(() => (
			<Meter.Root value={-1} minValue={0}>
				<Meter.Label>Meter</Meter.Label>
				<Meter.ValueLabel />
				<Meter.Track>
					<Meter.Fill />
				</Meter.Track>
			</Meter.Root>
		));

		const meter = getByRole("meter");
		expect(meter).toHaveAttribute("aria-valuenow", "0");
		expect(meter).toHaveAttribute("aria-valuetext", "0%");
	});

	it("should clamps values to 'maxValue'", () => {
		const { getByRole } = render(() => (
			<Meter.Root value={200} maxValue={100}>
				<Meter.Label>Meter</Meter.Label>
				<Meter.ValueLabel />
				<Meter.Track>
					<Meter.Fill />
				</Meter.Track>
			</Meter.Root>
		));

		const meter = getByRole("meter");
		expect(meter).toHaveAttribute("aria-valuenow", "100");
		expect(meter).toHaveAttribute("aria-valuetext", "100%");
	});

	it("supports negative values", () => {
		const { getByRole } = render(() => (
			<Meter.Root value={0} minValue={-5} maxValue={5}>
				<Meter.Label>Meter</Meter.Label>
				<Meter.ValueLabel />
				<Meter.Track>
					<Meter.Fill />
				</Meter.Track>
			</Meter.Root>
		));

		const meter = getByRole("meter");
		expect(meter).toHaveAttribute("aria-valuenow", "0");
		expect(meter).toHaveAttribute("aria-valuetext", "50%");
	});
});
