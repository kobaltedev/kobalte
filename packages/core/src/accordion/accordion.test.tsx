/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/accordion/src/Accordion.test.tsx
 */

import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, within } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { type ComponentProps, For } from "solid-js";
import { vi } from "vitest";

import * as Accordion from ".";

function AccordionTest(props: ComponentProps<typeof Accordion.Root>) {
	return (
		<Accordion.Root data-testid="container" {...props}>
			<For each={["one", "two", "three"]}>
				{(val) => (
					<Accordion.Item value={val} data-testid={`item-${val}`}>
						<Accordion.Header data-testid={`header-${val}`}>
							<Accordion.Trigger>Trigger {val}</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content>Content {val}</Accordion.Content>
					</Accordion.Item>
				)}
			</For>
		</Accordion.Root>
	);
}

describe.skipIf(process.env.GITHUB_ACTIONS)("Accordion", () => {
	installPointerEvent();

	it("renders properly", () => {
		const { getAllByRole } = render(() => (
			<AccordionTest defaultValue={["one"]} />
		));

		const items = getAllByRole("heading");
		expect(items.length).toBe(3);

		for (const item of items) {
			const button = within(item).getByRole("button");
			expect(button).toHaveAttribute("aria-expanded");

			if (button.getAttribute("aria-expanded") === "true") {
				expect(button).toHaveAttribute("aria-controls");

				const region = document.getElementById(
					button.getAttribute("aria-controls")!,
				);
				expect(region).toBeTruthy();
				expect(region).toHaveAttribute("aria-labelledby", button.id);
				expect(region).toHaveAttribute("role", "region");
				expect(region).toHaveTextContent("Content one");
			}
		}
	});

	it("can have default expanded value", async () => {
		const { getAllByRole, getByText } = render(() => (
			<AccordionTest defaultValue={["one"]} />
		));

		const buttons = getAllByRole("button");
		const [firstItem] = buttons;
		const contentOne = getByText("Content one");

		expect(firstItem).toHaveAttribute("aria-expanded", "true");
		expect(contentOne).toBeVisible();
	});

	it("can be controlled", async () => {
		const onChangeSpy = vi.fn();

		const { getAllByRole, getByText } = render(() => (
			<AccordionTest value={["one"]} onChange={onChangeSpy} />
		));

		const buttons = getAllByRole("button");
		const [firstItem, secondItem] = buttons;
		const contentOne = getByText("Content one");

		expect(firstItem).toHaveAttribute("aria-expanded", "true");
		expect(contentOne).toBeVisible();
		expect(secondItem).toHaveAttribute("aria-expanded", "false");

		await userEvent.click(secondItem);
		expect(onChangeSpy).toHaveBeenCalledWith(["two"]);
		expect(onChangeSpy).toHaveBeenCalledTimes(1);

		// First item is still expanded because Accordion is controlled.
		expect(firstItem).toHaveAttribute("aria-expanded", "true");
		expect(contentOne).toBeVisible();
		expect(secondItem).toHaveAttribute("aria-expanded", "false");
	});

	// TODO: use solid-list
	it.skip("allows users to navigate accordion headers through arrow keys", async () => {
		const { getAllByRole } = render(() => <AccordionTest />);

		const buttons = getAllByRole("button");
		const [firstItem, secondItem, thirdItem] = buttons;

		firstItem.focus();
		expect(document.activeElement).toBe(firstItem);

		fireEvent.keyDown(firstItem, { key: "ArrowUp" });
		await Promise.resolve();
		expect(document.activeElement).toBe(thirdItem);

		fireEvent.keyDown(thirdItem, { key: "ArrowDown" });
		await Promise.resolve();
		expect(document.activeElement).toBe(firstItem);

		fireEvent.keyDown(firstItem, { key: "ArrowDown" });
		await Promise.resolve();
		expect(document.activeElement).toBe(secondItem);

		fireEvent.keyDown(secondItem, { key: "ArrowDown" });
		await Promise.resolve();
		expect(document.activeElement).toBe(thirdItem);

		fireEvent.keyDown(thirdItem, { key: "ArrowUp" });
		await Promise.resolve();
		expect(document.activeElement).toBe(secondItem);
	});

	// TODO: use solid-list
	it.skip("should not wrap focus when navigating accordion headers through arrow keys if 'shouldFocusWrap=false'", async () => {
		const { getAllByRole } = render(() => (
			<AccordionTest shouldFocusWrap={false} />
		));

		const buttons = getAllByRole("button");
		const [firstItem, secondItem, thirdItem] = buttons;

		firstItem.focus();
		expect(document.activeElement).toBe(firstItem);

		fireEvent.keyDown(firstItem, { key: "ArrowUp" });
		await Promise.resolve();
		expect(document.activeElement).toBe(firstItem);

		fireEvent.keyDown(firstItem, { key: "ArrowDown" });
		await Promise.resolve();
		expect(document.activeElement).toBe(secondItem);

		fireEvent.keyDown(secondItem, { key: "ArrowDown" });
		await Promise.resolve();
		expect(document.activeElement).toBe(thirdItem);

		fireEvent.keyDown(thirdItem, { key: "ArrowDown" });
		await Promise.resolve();
		expect(document.activeElement).toBe(thirdItem);

		fireEvent.keyDown(thirdItem, { key: "ArrowUp" });
		await Promise.resolve();
		expect(document.activeElement).toBe(secondItem);
	});

	// TODO: use solid-list
	it.skip("allows users to navigate to first/last accordion headers through 'Home/End' keys", async () => {
		const { getAllByRole } = render(() => <AccordionTest />);

		const buttons = getAllByRole("button");
		const [firstItem, _, thirdItem] = buttons;

		firstItem.focus();
		expect(document.activeElement).toBe(firstItem);

		fireEvent.keyDown(firstItem, { key: "End" });
		await Promise.resolve();
		expect(document.activeElement).toBe(thirdItem);

		fireEvent.keyDown(thirdItem, { key: "Home" });
		await Promise.resolve();
		expect(document.activeElement).toBe(firstItem);
	});

	it("allows users to navigate accordion headers through the tab key", async () => {
		const { getAllByRole } = render(() => <AccordionTest />);

		const buttons = getAllByRole("button");
		const [firstItem, secondItem, thirdItem] = buttons;

		firstItem.focus();
		expect(document.activeElement).toBe(firstItem);

		await userEvent.tab();
		expect(document.activeElement).toBe(secondItem);

		await userEvent.tab({ shift: true });
		expect(document.activeElement).toBe(firstItem);

		await userEvent.tab();
		expect(document.activeElement).toBe(secondItem);

		await userEvent.tab();
		expect(document.activeElement).toBe(thirdItem);

		await userEvent.tab();
		expect(document.activeElement).not.toBe(firstItem);
		expect(document.activeElement).not.toBe(secondItem);
		expect(document.activeElement).not.toBe(thirdItem);

		await userEvent.tab({ shift: true });
		expect(document.activeElement).toBe(thirdItem);
	});

	it("should toggle between different accordion items when clicking a trigger", async () => {
		const { getAllByRole, getByText } = render(() => <AccordionTest />);

		const buttons = getAllByRole("button");
		const [firstItem, secondItem] = buttons;

		await userEvent.click(firstItem);
		const contentOne = getByText("Content one");
		expect(firstItem).toHaveAttribute("aria-expanded", "true");
		expect(contentOne).toBeVisible();

		await userEvent.click(secondItem);
		expect(firstItem).toHaveAttribute("aria-expanded", "false");
		//		expect(contentOne).not.toBeVisible(); // TODO: fix solid-presence vitest

		const contentTwo = getByText("Content two");
		expect(secondItem).toHaveAttribute("aria-expanded", "true");
		expect(contentTwo).toBeVisible();
	});

	it("should no toggle the same accordion item when clicking its trigger by default", async () => {
		const { getAllByRole, getByText } = render(() => <AccordionTest />);

		const buttons = getAllByRole("button");
		const [firstItem] = buttons;

		await userEvent.click(firstItem);
		const contentOne = getByText("Content one");
		expect(firstItem).toHaveAttribute("aria-expanded", "true");
		expect(contentOne).toBeVisible();

		await userEvent.click(firstItem);

		// Stay expanded because Accordion is not `multiple` or `collapsible`.
		expect(firstItem).toHaveAttribute("aria-expanded", "true");
		expect(contentOne).toBeVisible();
	});

	it("should call 'onChange' when clicking a trigger", async () => {
		const onChangeSpy = vi.fn();

		const { getAllByRole } = render(() => (
			<AccordionTest onChange={onChangeSpy} />
		));

		const buttons = getAllByRole("button");
		const [firstItem, secondItem] = buttons;

		await userEvent.click(firstItem);
		expect(onChangeSpy).toHaveBeenCalledWith(["one"]);

		await userEvent.click(firstItem);

		// Called once because Accordion is not `multiple` or `collapsible`.
		expect(onChangeSpy).toHaveBeenCalledTimes(1);

		await userEvent.click(secondItem);
		expect(onChangeSpy).toHaveBeenCalledWith(["two"]);
		expect(onChangeSpy).toHaveBeenCalledTimes(2);
	});

	describe("collapsible", () => {
		it("should toggle the same accordion item when clicking its trigger if collapsible", async () => {
			const { getAllByRole, getByText, queryByText } = render(() => (
				<AccordionTest collapsible defaultValue={["one"]} />
			));

			const buttons = getAllByRole("button");
			const [firstItem] = buttons;

			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(getByText("Content one")).toBeVisible();

			await userEvent.click(firstItem);
			expect(firstItem).toHaveAttribute("aria-expanded", "false");
			//			expect(queryByText("Content one")).not.toBeInTheDocument(); // TODO: fix solid-presence vitest

			await userEvent.click(firstItem);
			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(getByText("Content one")).toBeVisible();
		});

		it("should allows users to open and close accordion item with enter / space key when collapsible", async () => {
			const { getAllByRole, getByText, queryByText } = render(() => (
				<AccordionTest collapsible defaultValue={["one"]} />
			));

			const buttons = getAllByRole("button");
			const [firstItem] = buttons;

			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(getByText("Content one")).toBeVisible();

			firstItem.focus();
			expect(document.activeElement).toBe(firstItem);

			fireEvent.keyDown(firstItem, { key: "Enter" });
			fireEvent.keyUp(firstItem, { key: "Enter" });
			await Promise.resolve();

			expect(firstItem).toHaveAttribute("aria-expanded", "false");
			//			expect(queryByText("Content one")).not.toBeInTheDocument(); // TODO: fix solid-presence vitest

			fireEvent.keyDown(firstItem, { key: "Enter" });
			fireEvent.keyUp(firstItem, { key: "Enter" });
			await Promise.resolve();

			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(getByText("Content one")).toBeVisible();
		});
	});

	describe("multiple", () => {
		it("should expand multiple accordion items when clicking triggers", async () => {
			const { getAllByRole, getByText } = render(() => (
				<AccordionTest multiple />
			));

			const buttons = getAllByRole("button");
			const [firstItem, secondItem] = buttons;

			await userEvent.click(firstItem);
			const contentOne = getByText("Content one");
			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(contentOne).toBeVisible();

			await userEvent.click(secondItem);
			const contentTwo = getByText("Content two");
			expect(secondItem).toHaveAttribute("aria-expanded", "true");
			expect(contentTwo).toBeVisible();

			// Content one stay expanded
			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(contentOne).toBeVisible();
		});

		it("should toggle the same accordion item when clicking its trigger if multiple", async () => {
			const { getAllByRole, getByText, queryByText } = render(() => (
				<AccordionTest multiple defaultValue={["one"]} />
			));

			const buttons = getAllByRole("button");
			const [firstItem] = buttons;

			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(getByText("Content one")).toBeVisible();

			await userEvent.click(firstItem);
			expect(firstItem).toHaveAttribute("aria-expanded", "false");
			//			expect(queryByText("Content one")).not.toBeInTheDocument(); // TODO: fix solid-presence vitest

			await userEvent.click(firstItem);
			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(getByText("Content one")).toBeVisible();
		});

		it("should allows users to open and close accordion item with enter / space key when multiple", async () => {
			const { getAllByRole, getByText, queryByText } = render(() => (
				<AccordionTest multiple defaultValue={["one"]} />
			));

			const buttons = getAllByRole("button");
			const [firstItem] = buttons;

			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(getByText("Content one")).toBeVisible();

			firstItem.focus();
			expect(document.activeElement).toBe(firstItem);

			fireEvent.keyDown(firstItem, { key: "Enter" });
			fireEvent.keyUp(firstItem, { key: "Enter" });
			await Promise.resolve();

			expect(firstItem).toHaveAttribute("aria-expanded", "false");
			//			expect(queryByText("Content one")).not.toBeInTheDocument(); // TODO: fix solid-presence vitest

			fireEvent.keyDown(firstItem, { key: "Enter" });
			fireEvent.keyUp(firstItem, { key: "Enter" });
			await Promise.resolve();

			expect(firstItem).toHaveAttribute("aria-expanded", "true");
			expect(getByText("Content one")).toBeVisible();
		});

		it("should call 'onChange' when clicking triggers", async () => {
			const onChangeSpy = vi.fn();

			const { getAllByRole } = render(() => (
				<AccordionTest multiple onChange={onChangeSpy} />
			));

			const buttons = getAllByRole("button");
			const [firstItem, secondItem] = buttons;

			await userEvent.click(firstItem);
			expect(onChangeSpy).toHaveBeenCalledWith(["one"]);

			await userEvent.click(secondItem);
			expect(onChangeSpy).toHaveBeenCalledWith(["one", "two"]);

			expect(onChangeSpy).toHaveBeenCalledTimes(2);
		});
	});
});
