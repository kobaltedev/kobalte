import { installPointerEvent } from "@kobalte/tests";
import { render } from "@solidjs/testing-library";

import * as Button from ".";

describe("Button", () => {
	installPointerEvent();

	it("should have attribute 'type=button' by default", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button">Button</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).toHaveAttribute("type", "button");
	});

	it("should not have attribute 'type=button' by default when it's not a 'button' tag", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" as="div">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).not.toHaveAttribute("type", "button");
	});

	it("should keep attribute 'type' when provided and it's a native 'button' or 'input'", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" as="input" type="submit">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).toHaveAttribute("type", "submit");
	});

	it("should not have attribute 'role=button' when it's a native button", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button">Button</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).not.toHaveAttribute("role", "button");
	});

	it("should not have attribute 'role=button' when it's an 'a' tag with 'href'", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" as="a" href="https://kobalte.dev">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).not.toHaveAttribute("role", "button");
	});

	it("should have attribute 'role=button' when it's not a native button", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" as="div">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).toHaveAttribute("role", "button");
	});

	it("should have attribute 'role=button' when it's an 'a' tag without 'href'", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" as="a">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).toHaveAttribute("role", "button");
	});

	it("should have attribute 'tabindex=0' when it's not a native button", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" as="div">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).toHaveAttribute("tabindex", "0");
	});

	it("should not have attribute 'tabindex=0' when it's an 'a' tag with 'href'", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" as="a" href="https://kobalte.dev">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).not.toHaveAttribute("tabindex", "0");
	});

	it("should not have attribute 'tabindex=0' when it's disabled", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" disabled as="div">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).not.toHaveAttribute("tabindex", "0");
	});

	it("should have correct 'disabled' attribute when disabled and it's a native button", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" disabled>
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).toHaveAttribute("disabled");
		expect(button).not.toHaveAttribute("aria-disabled");
	});

	it("should have correct 'disabled' attribute when disabled and it's an input", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" disabled as="input">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).toHaveAttribute("disabled");
		expect(button).not.toHaveAttribute("aria-disabled");
	});

	it("should have correct 'disabled' attribute when disabled and it's not a native button nor input", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" disabled as="div">
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).not.toHaveAttribute("disabled");
		expect(button).toHaveAttribute("aria-disabled");
	});

	it("should not have attribute 'data-disabled'  by default", async () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button">Button</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).not.toHaveAttribute("data-disabled");
	});

	it("should have attribute 'data-disabled' when disabled", () => {
		const { getByTestId } = render(() => (
			<Button.Root data-testid="button" disabled>
				Button
			</Button.Root>
		));

		const button = getByTestId("button");

		expect(button).toHaveAttribute("data-disabled");
	});
});
