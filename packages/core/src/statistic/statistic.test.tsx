import { render } from "@solidjs/testing-library";

import * as Statistic from ".";

describe("Statistic", () => {
	it("should render a 'div' by default", () => {
		const { container } = render(() => (
			<Statistic.Root>content</Statistic.Root>
		));

		expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
	});

	it("should wire 'aria-labelledby' to Statistic.Label's id", () => {
		const { container, getByText } = render(() => (
			<Statistic.Root>
				<Statistic.Label>Web traffic</Statistic.Label>
			</Statistic.Root>
		));

		const root = container.firstElementChild;
		const label = getByText("Web traffic");

		expect(root).toHaveAttribute("aria-labelledby", label.id);
	});

	it("should wire 'aria-describedby' to Statistic.Description's id", () => {
		const { container, getByText } = render(() => (
			<Statistic.Root>
				<Statistic.Description>vs. last 24 hours</Statistic.Description>
			</Statistic.Root>
		));

		const root = container.firstElementChild;
		const description = getByText("vs. last 24 hours");

		expect(root).toHaveAttribute("aria-describedby", description.id);
	});

	describe("Value", () => {
		it("should format 'value' for the current locale", () => {
			const { getByText } = render(() => (
				<Statistic.Root>
					<Statistic.Value
						value={255650}
						formatOptions={{ notation: "compact" }}
					/>
				</Statistic.Root>
			));

			expect(getByText("256K")).toBeInTheDocument();
		});

		it("should prefer explicit children over formatted 'value'", () => {
			const { getByText, queryByText } = render(() => (
				<Statistic.Root>
					<Statistic.Value value={12.4} formatOptions={{ notation: "compact" }}>
						12.4 ms
					</Statistic.Value>
				</Statistic.Root>
			));

			expect(getByText("12.4 ms")).toBeInTheDocument();
			expect(queryByText("12.4", { exact: false })?.textContent).toBe(
				"12.4 ms",
			);
		});

		it("should be a polite, atomic live region", () => {
			const { getByText } = render(() => (
				<Statistic.Root>
					<Statistic.Value value={40} />
				</Statistic.Root>
			));

			const value = getByText("40");

			expect(value).toHaveAttribute("aria-live", "polite");
			expect(value).toHaveAttribute("aria-atomic", "true");
		});
	});

	describe("Trend", () => {
		it("should set 'data-direction=increase' for a positive value", () => {
			const { container } = render(() => (
				<Statistic.Root>
					<Statistic.Trend value={0.025}>+2.5%</Statistic.Trend>
				</Statistic.Root>
			));

			expect(container.querySelector("[data-direction]")).toHaveAttribute(
				"data-direction",
				"increase",
			);
		});

		it("should set 'data-direction=decrease' for a negative value", () => {
			const { container } = render(() => (
				<Statistic.Root>
					<Statistic.Trend value={-0.025}>-2.5%</Statistic.Trend>
				</Statistic.Root>
			));

			expect(container.querySelector("[data-direction]")).toHaveAttribute(
				"data-direction",
				"decrease",
			);
		});

		it("should mark its children as 'aria-hidden'", () => {
			const { getByText } = render(() => (
				<Statistic.Root>
					<Statistic.Trend value={0.025}>+2.5%</Statistic.Trend>
				</Statistic.Root>
			));

			expect(getByText("+2.5%")).toHaveAttribute("aria-hidden", "true");
		});

		it("should generate accessible text describing the direction and magnitude", () => {
			const { container } = render(() => (
				<Statistic.Root>
					<Statistic.Trend
						value={0.025}
						formatOptions={{ style: "percent", maximumFractionDigits: 1 }}
					>
						+2.5%
					</Statistic.Trend>
				</Statistic.Root>
			));

			expect(container).toHaveTextContent("increased by 2.5%");
		});

		it("should use 'noChange' accessible text when value is 0", () => {
			const { container } = render(() => (
				<Statistic.Root>
					<Statistic.Trend value={0}>—</Statistic.Trend>
				</Statistic.Root>
			));

			expect(container).toHaveTextContent("unchanged");
		});
	});
});
