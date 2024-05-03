/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/progress/test/useProgressBar.test.js
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-spectrum/progress/test/ProgressBar.test.js
 */

import { render } from "@solidjs/testing-library";

import * as Progress from ".";

describe("Progress", () => {
	it("handles defaults", () => {
		const { getByRole, getByTestId } = render(() => (
			<Progress.Root>
				<Progress.Label>Progress Bar</Progress.Label>
				<Progress.ValueLabel data-testid="value-label" />
				<Progress.Track>
					<Progress.Fill />
				</Progress.Track>
			</Progress.Root>
		));

		const progressBar = getByRole("progressbar");
		expect(progressBar).toHaveAttribute("aria-valuemin", "0");
		expect(progressBar).toHaveAttribute("aria-valuemax", "100");
		expect(progressBar).toHaveAttribute("aria-valuenow", "0");
		expect(progressBar).toHaveAttribute("aria-valuetext", "0%");

		const valueLabel = getByTestId("value-label");
		expect(valueLabel).toHaveTextContent("0%");

		const labelId = progressBar.getAttribute("aria-labelledby");
		expect(labelId).toBeDefined();

		const label = document.getElementById(labelId!);
		expect(label).toHaveTextContent("Progress Bar");
	});

	it("supports custom value label", () => {
		const { getByRole, getByTestId } = render(() => (
			<Progress.Root
				value={3}
				minValue={0}
				maxValue={10}
				getValueLabel={({ value, max }) => `${value} of ${max} completed`}
			>
				<Progress.Label>Progress Bar</Progress.Label>
				<Progress.ValueLabel data-testid="value-label" />
				<Progress.Track>
					<Progress.Fill />
				</Progress.Track>
			</Progress.Root>
		));

		const progressBar = getByRole("progressbar");
		expect(progressBar).toHaveAttribute("aria-valuetext", "3 of 10 completed");

		const valueLabel = getByTestId("value-label");
		expect(valueLabel).toHaveTextContent("3 of 10 completed");
	});

	it("should update all fields by value", () => {
		const { getByRole } = render(() => (
			<Progress.Root value={30}>
				<Progress.Label>Progress Bar</Progress.Label>
				<Progress.ValueLabel />
				<Progress.Track>
					<Progress.Fill />
				</Progress.Track>
			</Progress.Root>
		));

		const progressBar = getByRole("progressbar");

		expect(progressBar).toHaveAttribute("aria-valuemin", "0");
		expect(progressBar).toHaveAttribute("aria-valuemax", "100");
		expect(progressBar).toHaveAttribute("aria-valuenow", "30");
		expect(progressBar).toHaveAttribute("aria-valuetext", "30%");
	});

	it("should clamps values to 'minValue'", () => {
		const { getByRole } = render(() => (
			<Progress.Root value={-1} minValue={0}>
				<Progress.Label>Progress Bar</Progress.Label>
				<Progress.ValueLabel />
				<Progress.Track>
					<Progress.Fill />
				</Progress.Track>
			</Progress.Root>
		));

		const progressBar = getByRole("progressbar");
		expect(progressBar).toHaveAttribute("aria-valuenow", "0");
		expect(progressBar).toHaveAttribute("aria-valuetext", "0%");
	});

	it("should clamps values to 'maxValue'", () => {
		const { getByRole } = render(() => (
			<Progress.Root value={200} maxValue={100}>
				<Progress.Label>Progress Bar</Progress.Label>
				<Progress.ValueLabel />
				<Progress.Track>
					<Progress.Fill />
				</Progress.Track>
			</Progress.Root>
		));

		const progressBar = getByRole("progressbar");
		expect(progressBar).toHaveAttribute("aria-valuenow", "100");
		expect(progressBar).toHaveAttribute("aria-valuetext", "100%");
	});

	it("supports negative values", () => {
		const { getByRole } = render(() => (
			<Progress.Root value={0} minValue={-5} maxValue={5}>
				<Progress.Label>Progress Bar</Progress.Label>
				<Progress.ValueLabel />
				<Progress.Track>
					<Progress.Fill />
				</Progress.Track>
			</Progress.Root>
		));

		const progressBar = getByRole("progressbar");
		expect(progressBar).toHaveAttribute("aria-valuenow", "0");
		expect(progressBar).toHaveAttribute("aria-valuetext", "50%");
	});

	it("supports indeterminate state", () => {
		const { getByRole, getByTestId } = render(() => (
			<Progress.Root indeterminate>
				<Progress.Label>Progress Bar</Progress.Label>
				<Progress.ValueLabel data-testid="value-label" />
				<Progress.Track>
					<Progress.Fill />
				</Progress.Track>
			</Progress.Root>
		));

		const progressBar = getByRole("progressbar");
		expect(progressBar).toHaveAttribute("aria-valuemin", "0");
		expect(progressBar).toHaveAttribute("aria-valuemax", "100");
		expect(progressBar).not.toHaveAttribute("aria-valuenow");
		expect(progressBar).not.toHaveAttribute("aria-valuetext");

		const valueLabel = getByTestId("value-label");
		expect(valueLabel).toBeEmptyDOMElement();
	});

	describe("data-attributes", () => {
		it("should have 'data-progress=loading' attribute when the progress is not complete", () => {
			const { getAllByTestId } = render(() => (
				<Progress.Root
					value={30}
					minValue={0}
					maxValue={100}
					data-testid="progress-root"
				>
					<Progress.Label data-testid="progress-label">
						Progress Bar
					</Progress.Label>
					<Progress.ValueLabel data-testid="progress-value-label" />
					<Progress.Track data-testid="progress-track">
						<Progress.Fill data-testid="progress-fill" />
					</Progress.Track>
				</Progress.Root>
			));

			const elements = getAllByTestId(/^progress/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-progress", "loading");
			}
		});

		it("should have 'data-progress=complete' attribute when the progress is complete", () => {
			const { getAllByTestId } = render(() => (
				<Progress.Root
					value={100}
					minValue={0}
					maxValue={100}
					data-testid="progress-root"
				>
					<Progress.Label data-testid="progress-label">
						Progress Bar
					</Progress.Label>
					<Progress.ValueLabel data-testid="progress-value-label" />
					<Progress.Track data-testid="progress-track">
						<Progress.Fill data-testid="progress-fill" />
					</Progress.Track>
				</Progress.Root>
			));

			const elements = getAllByTestId(/^progress/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-progress", "complete");
			}
		});

		it("should not have 'data-indeterminate' attribute by default", () => {
			const { getAllByTestId } = render(() => (
				<Progress.Root data-testid="progress-root">
					<Progress.Label data-testid="progress-label">
						Progress Bar
					</Progress.Label>
					<Progress.ValueLabel data-testid="progress-value-label" />
					<Progress.Track data-testid="progress-track">
						<Progress.Fill data-testid="progress-fill" />
					</Progress.Track>
				</Progress.Root>
			));

			const elements = getAllByTestId(/^progress/);

			for (const el of elements) {
				expect(el).not.toHaveAttribute("data-indeterminate");
			}
		});

		it("should have 'data-indeterminate' attribute when indeterminate", () => {
			const { getAllByTestId } = render(() => (
				<Progress.Root indeterminate data-testid="progress-root">
					<Progress.Label data-testid="progress-label">
						Progress Bar
					</Progress.Label>
					<Progress.ValueLabel data-testid="progress-value-label" />
					<Progress.Track data-testid="progress-track">
						<Progress.Fill data-testid="progress-fill" />
					</Progress.Track>
				</Progress.Root>
			));

			const elements = getAllByTestId(/^progress/);

			for (const el of elements) {
				expect(el).toHaveAttribute("data-indeterminate");
			}
		});
	});
});
