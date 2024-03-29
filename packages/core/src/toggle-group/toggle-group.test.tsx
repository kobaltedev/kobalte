import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, within } from "@solidjs/testing-library";
import { vi } from "vitest";

import userEvent from "@testing-library/user-event";
import * as ToggleGroup from ".";

describe("ToggleGroup", () => {
	const user = userEvent.setup({ delay: null });

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.clearAllTimers();
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	installPointerEvent();

	it("can have a default value", async () => {
		const onChangeSpy = vi.fn();

		const { getByRole, getAllByTestId, getByText } = render(() => (
			<ToggleGroup.Root defaultValue="cats" onChange={onChangeSpy}>
				<ToggleGroup.Item data-testid="item" value="dogs">
					Dogs
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="cats">
					Cats
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="dragons">
					Dragons
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		));

		const toggleGroup = getByRole("group");
		const buttons = getAllByTestId("item") as HTMLButtonElement[];

		expect(toggleGroup).toBeTruthy();
		expect(buttons.length).toBe(3);
		expect(onChangeSpy).not.toHaveBeenCalled();

		expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
		expect(buttons[1]).toHaveAttribute("aria-pressed", "true");
		expect(buttons[2]).toHaveAttribute("aria-pressed", "false");

		const dragons = getByText("Dragons");

		fireEvent.click(dragons);
		await Promise.resolve();

		expect(onChangeSpy).toHaveBeenCalledTimes(1);
		expect(onChangeSpy).toHaveBeenCalledWith("dragons");

		expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
		expect(buttons[1]).toHaveAttribute("aria-pressed", "false");
		expect(buttons[2]).toHaveAttribute("aria-pressed", "true");
	});

	it("allows user to change toggle item via left/right arrow keys with horizontal group", async () => {
		const { getByRole } = render(() => (
			<ToggleGroup.Root>
				<ToggleGroup.Item data-testid="item" value="dogs">
					Dogs
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="cats">
					Cats
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="dragons">
					Dragons
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		));

		const toggleGroup = getByRole("group");
		const toggles = within(toggleGroup).getAllByTestId("item");
		const selectedItem = toggles[0];

		expect(toggleGroup).toHaveAttribute("data-orientation", "horizontal");

		expect(selectedItem).toHaveAttribute("tabindex", "-1");
		selectedItem.focus();

		fireEvent.keyDown(selectedItem, {
			key: "ArrowRight",
			code: 39,
			charCode: 39,
		});
		await Promise.resolve();

		const nextSelectedItem = toggles[1];
		expect(nextSelectedItem).toHaveAttribute("tabindex", "0");

		fireEvent.keyDown(nextSelectedItem, {
			key: "ArrowLeft",
			code: 37,
			charCode: 37,
		});
		await Promise.resolve();

		expect(selectedItem).toHaveAttribute("tabindex", "0");

		/** Doesn't change selection because its horizontal group. */
		fireEvent.keyDown(selectedItem, { key: "ArrowUp", code: 38, charCode: 38 });
		await Promise.resolve();

		expect(selectedItem).toHaveAttribute("tabindex", "0");

		fireEvent.keyDown(selectedItem, {
			key: "ArrowDown",
			code: 40,
			charCode: 40,
		});
		await Promise.resolve();

		expect(selectedItem).toHaveAttribute("tabindex", "0");
	});

	it("allows user to change toggle item via up/down arrow keys with vertical group", async () => {
		const { getByRole } = render(() => (
			<ToggleGroup.Root orientation="vertical">
				<ToggleGroup.Item data-testid="item" value="dogs">
					Dogs
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="cats">
					Cats
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="dragons">
					Dragons
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		));

		const toggleGroup = getByRole("group");
		const toggles = within(toggleGroup).getAllByTestId("item");
		const selectedItem = toggles[0];

		expect(toggleGroup).toHaveAttribute("data-orientation", "vertical");

		expect(selectedItem).toHaveAttribute("tabindex", "-1");
		selectedItem.focus();

		fireEvent.keyDown(selectedItem, {
			key: "ArrowDown",
			code: 40,
			charCode: 40,
		});
		await Promise.resolve();

		const nextSelectedItem = toggles[1];
		expect(nextSelectedItem).toHaveAttribute("tabindex", "0");

		fireEvent.keyDown(selectedItem, {
			key: "ArrowUp",
			code: 38,
			charCode: 38,
		});
		await Promise.resolve();

		expect(selectedItem).toHaveAttribute("tabindex", "0");

		/** Doesn't change selection because its vertical group. */
		fireEvent.keyDown(selectedItem, {
			key: "ArrowRight",
			code: 39,
			charCode: 39,
		});
		await Promise.resolve();

		expect(selectedItem).toHaveAttribute("tabindex", "0");

		fireEvent.keyDown(nextSelectedItem, {
			key: "ArrowLeft",
			code: 37,
			charCode: 37,
		});
		await Promise.resolve();

		expect(selectedItem).toHaveAttribute("tabindex", "0");
	});

	it("select last item via end key / select first item via home key", async () => {
		const { getByRole } = render(() => (
			<ToggleGroup.Root>
				<ToggleGroup.Item data-testid="item" value="dogs">
					Dogs
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="cats">
					Cats
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="dragons">
					Dragons
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		));

		const toggleGroup = getByRole("group");
		const toggles = within(toggleGroup).getAllByTestId("item");
		const firstItem = toggles[0];

		firstItem.focus();

		expect(toggleGroup).toHaveAttribute("data-orientation", "horizontal");

		expect(firstItem).toHaveAttribute("tabindex", "0");

		fireEvent.keyDown(firstItem, { key: "End", code: 35, charCode: 35 });
		await Promise.resolve();

		const lastItem = toggles[toggles.length - 1];

		expect(lastItem).toHaveAttribute("tabindex", "0");

		fireEvent.keyDown(lastItem, { key: "Home", code: 36, charCode: 36 });
		await Promise.resolve();

		expect(firstItem).toHaveAttribute("tabindex", "0");
	});

	it("supports using click to change state", async () => {
		const { getByRole } = render(() => (
			<ToggleGroup.Root>
				<ToggleGroup.Item data-testid="item" value="dogs">
					Dogs
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="cats">
					Cats
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="dragons">
					Dragons
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		));

		const toggleGroup = getByRole("group");
		const toggles = within(toggleGroup).getAllByTestId("item");
		const [firstItem, secondItem] = toggles;

		expect(firstItem).toHaveAttribute("aria-pressed", "false");

		fireEvent(
			secondItem,
			createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }),
		);
		await Promise.resolve();

		expect(secondItem).toHaveAttribute("aria-pressed", "true");

		fireEvent(
			firstItem,
			createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }),
		);
		await Promise.resolve();

		expect(firstItem).toHaveAttribute("aria-pressed", "true");
		expect(secondItem).toHaveAttribute("aria-pressed", "false");
	});

	it("multi-select", async () => {
		const { getByRole } = render(() => (
			<ToggleGroup.Root multiple>
				<ToggleGroup.Item data-testid="item" value="dogs">
					Dogs
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="cats">
					Cats
				</ToggleGroup.Item>
				<ToggleGroup.Item data-testid="item" value="dragons">
					Dragons
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		));

		const toggleGroup = getByRole("group");
		const toggles = within(toggleGroup).getAllByTestId("item");
		const [firstItem, secondItem] = toggles;

		expect(firstItem).toHaveAttribute("aria-pressed", "false");

		fireEvent(
			secondItem,
			createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }),
		);
		await Promise.resolve();

		fireEvent(
			firstItem,
			createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }),
		);
		await Promise.resolve();

		expect(firstItem).toHaveAttribute("aria-pressed", "true");
		expect(secondItem).toHaveAttribute("aria-pressed", "true");
	});

	it.skipIf(process.env.GITHUB_ACTIONS)(
		"should focus the selected item when tabbing in for the first time",
		async () => {
			const { getByRole } = render(() => (
				<ToggleGroup.Root defaultValue="dragons">
					<ToggleGroup.Item data-testid="item" value="dogs">
						Dogs
					</ToggleGroup.Item>
					<ToggleGroup.Item data-testid="item" value="cats">
						Cats
					</ToggleGroup.Item>
					<ToggleGroup.Item data-testid="item" value="dragons">
						Dragons
					</ToggleGroup.Item>
				</ToggleGroup.Root>
			));

			await user.tab();

			const toggleGroup = getByRole("group");
			const toggles = within(toggleGroup).getAllByTestId("item");

			expect(document.activeElement).toBe(toggles[2]);
		},
	);

	it.skipIf(process.env.GITHUB_ACTIONS)(
		"should not focus if group is disabled",
		async () => {
			const { getByTestId } = render(() => (
				<>
					<ToggleGroup.Root disabled>
						<ToggleGroup.Item value="dogs">Dogs</ToggleGroup.Item>
						<ToggleGroup.Item value="cats">Cats</ToggleGroup.Item>
						<ToggleGroup.Item value="dragons">Dragons</ToggleGroup.Item>
					</ToggleGroup.Root>
					<button data-testid="focus-btn" type="button">
						hi
					</button>
				</>
			));

			await user.tab();

			const button = getByTestId("focus-btn");

			expect(document.activeElement).toBe(button);
		},
	);

	it.skipIf(process.env.GITHUB_ACTIONS)(
		"disabled item should be be pressed",
		async () => {
			const onValueChangeSpy = vi.fn();

			const { getByRole } = render(() => (
				<ToggleGroup.Root>
					<ToggleGroup.Item data-testid="item" value="dogs">
						Dogs
					</ToggleGroup.Item>
					<ToggleGroup.Item data-testid="item" value="cats" disabled>
						Cats
					</ToggleGroup.Item>
					<ToggleGroup.Item data-testid="item" value="dragons">
						Dragons
					</ToggleGroup.Item>
				</ToggleGroup.Root>
			));

			await user.tab();

			const toggleGroup = getByRole("group");
			const toggles = within(toggleGroup).getAllByTestId("item");

			expect(document.activeElement).toBe(toggles[0]);

			await user.click(toggles[1]);

			expect(onValueChangeSpy).not.toBeCalled();
		},
	);
});
