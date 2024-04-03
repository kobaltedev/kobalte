import { installPointerEvent } from "@kobalte/tests";
import { render } from "@solidjs/testing-library";

import * as Link from ".";

describe("Link", () => {
	installPointerEvent();

	it("should not have attribute 'role=link' when it's a native link", () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link">Link</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).not.toHaveAttribute("role", "link");
	});

	it("should have attribute 'role=link' when it's not a native link", () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link" as="div">
				Link
			</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).toHaveAttribute("role", "link");
	});

	it("should have attribute 'tabindex=0' when it's not a native link and is not disabled", () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link" as="div">
				Link
			</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).toHaveAttribute("tabindex", "0");
	});

	it("should not have attribute 'tabindex=0' when it's a native link ", () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link" href="https://kobalte.dev">
				Link
			</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).not.toHaveAttribute("tabindex", "0");
	});

	it("should not have attribute 'data-disabled' by default", async () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link">Link</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).not.toHaveAttribute("data-disabled");
	});

	it("should have attribute 'role=link' when disabled", () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link" href="https://kobalte.dev" disabled>
				Link
			</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).toHaveAttribute("role", "link");
	});

	it("should not have attribute 'href' when disabled", () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link" href="https://kobalte.dev" disabled>
				Link
			</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).not.toHaveAttribute("href");
	});

	it("should not have attribute 'tabindex=0' when it's disabled", () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link" disabled as="div">
				Link
			</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).not.toHaveAttribute("tabindex", "0");
	});

	it("should have attribute 'aria-disabled=true' when disabled", () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link" disabled>
				Link
			</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).toHaveAttribute("aria-disabled", "true");
	});

	it("should have attribute 'data-disabled' when disabled", () => {
		const { getByTestId } = render(() => (
			<Link.Root data-testid="link" disabled>
				Link
			</Link.Root>
		));

		const link = getByTestId("link");

		expect(link).toHaveAttribute("data-disabled");
	});
});
