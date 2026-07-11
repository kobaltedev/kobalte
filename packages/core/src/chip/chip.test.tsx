import { fireEvent, render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as Chip from ".";

describe("Chip", () => {
	it("renders as a static, non-interactive span by default", () => {
		const { getByTestId } = render(() => (
			<Chip.Root data-testid="chip">Default</Chip.Root>
		));

		const chip = getByTestId("chip");

		expect(chip.tagName).toBe("SPAN");
		expect(chip).not.toHaveAttribute("role");
		expect(chip).not.toHaveAttribute("tabindex");
		expect(chip).not.toHaveAttribute("data-clickable");
	});

	it("becomes keyboard-operable when 'onClick' is provided", () => {
		const onClickSpy = vi.fn();

		const { getByTestId } = render(() => (
			<Chip.Root data-testid="chip" onClick={onClickSpy}>
				Clickable
			</Chip.Root>
		));

		const chip = getByTestId("chip");

		expect(chip).toHaveAttribute("role", "button");
		expect(chip).toHaveAttribute("tabindex", "0");
		expect(chip).toHaveAttribute("data-clickable");

		fireEvent.click(chip);
		expect(onClickSpy).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(chip, { key: "Enter" });
		expect(onClickSpy).toHaveBeenCalledTimes(2);

		fireEvent.keyDown(chip, { key: " " });
		expect(onClickSpy).toHaveBeenCalledTimes(3);
	});

	it("does not add synthetic 'role=button' when rendered as a native button", () => {
		const { getByTestId } = render(() => (
			<Chip.Root data-testid="chip" as="button" onClick={() => {}}>
				Clickable
			</Chip.Root>
		));

		const chip = getByTestId("chip");

		expect(chip).not.toHaveAttribute("role");
		expect(chip).not.toHaveAttribute("tabindex");
	});

	it("does not fire 'onClick' and removes tabindex when disabled", () => {
		const onClickSpy = vi.fn();

		const { getByTestId } = render(() => (
			<Chip.Root data-testid="chip" disabled onClick={onClickSpy}>
				Clickable
			</Chip.Root>
		));

		const chip = getByTestId("chip");

		expect(chip).not.toHaveAttribute("tabindex");
		expect(chip).toHaveAttribute("aria-disabled", "true");
		expect(chip).toHaveAttribute("data-disabled");

		fireEvent.click(chip);
		expect(onClickSpy).not.toHaveBeenCalled();
	});

	it("forwards the native 'disabled' attribute when rendered as a native button", () => {
		const { getByTestId } = render(() => (
			<Chip.Root data-testid="chip" as="button" disabled onClick={() => {}}>
				Clickable
			</Chip.Root>
		));

		const chip = getByTestId("chip");

		expect(chip).toHaveAttribute("disabled");
		expect(chip).not.toHaveAttribute("aria-disabled");
	});

	describe("Chip.Delete", () => {
		it("has a default 'aria-label' from translations", () => {
			const { getByRole } = render(() => (
				<Chip.Root>
					Tag
					<Chip.Delete />
				</Chip.Root>
			));

			expect(getByRole("button")).toHaveAttribute("aria-label", "Remove");
		});

		it("supports a custom 'aria-label'", () => {
			const { getByRole } = render(() => (
				<Chip.Root>
					Tag
					<Chip.Delete aria-label="Remove tag" />
				</Chip.Root>
			));

			expect(getByRole("button")).toHaveAttribute("aria-label", "Remove tag");
		});

		it("calls 'onClick' without triggering the chip's own 'onClick'", () => {
			const onChipClickSpy = vi.fn();
			const onDeleteClickSpy = vi.fn();

			const { getByTestId } = render(() => (
				<Chip.Root data-testid="chip" onClick={onChipClickSpy}>
					Tag
					<Chip.Delete data-testid="delete" onClick={onDeleteClickSpy} />
				</Chip.Root>
			));

			fireEvent.click(getByTestId("delete"));

			expect(onDeleteClickSpy).toHaveBeenCalledTimes(1);
			expect(onChipClickSpy).not.toHaveBeenCalled();
		});

		it("is disabled when the parent 'Chip.Root' is disabled", () => {
			const { getByRole } = render(() => (
				<Chip.Root disabled>
					Tag
					<Chip.Delete />
				</Chip.Root>
			));

			expect(getByRole("button")).toHaveAttribute("disabled");
		});
	});
});
