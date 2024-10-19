import { render } from "@solidjs/testing-library";
import * as Badge from ".";

describe("Badge", () => {
	it("badge with textValue", () => {
		const { getByRole } = render(() => (
			<Badge.Root textValue="Online">Online</Badge.Root>
		));

		const badge = getByRole("status");
		expect(badge).toHaveTextContent("Online");
	});

	it("badge with defined aria-label", () => {
		const { getByText } = render(() => (
			<Badge.Root textValue="Online" aria-label="User is online">
				Online
			</Badge.Root>
		));

		const badge = getByText("Online");
		expect(badge).toHaveAttribute("aria-label", "User is online");
	});

	it("badge with default aria-label as textValue", () => {
		const { getByRole } = render(() => (
			<Badge.Root textValue="Online">Online</Badge.Root>
		));

		const badge = getByRole("status");
		expect(badge).toHaveAttribute("aria-label", "Online");
	});
});
