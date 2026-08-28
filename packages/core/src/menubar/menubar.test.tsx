import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, within } from "@solidjs/testing-library";

import * as Menubar from ".";

const commonUI = () => (
	<>
		<Menubar.Root>
			<Menubar.Menu value="test-1-menu">
				<Menubar.Trigger>Test 1</Menubar.Trigger>

				<Menubar.Portal>
					<Menubar.Content>
						<Menubar.Item>Item 1</Menubar.Item>

						<Menubar.Item>Item 2</Menubar.Item>

						<Menubar.Sub>
							<Menubar.SubTrigger>{"Sub 3 >"}</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent>
									<Menubar.Item>Item 4</Menubar.Item>

									<Menubar.Item>Item 5</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>

			<Menubar.Menu value="test-2-menu">
				<Menubar.Trigger>Test 2</Menubar.Trigger>

				<Menubar.Portal>
					<Menubar.Content>
						<Menubar.Item>Item A</Menubar.Item>

						<Menubar.Item>Item B</Menubar.Item>

						<Menubar.Sub>
							<Menubar.SubTrigger>{"Sub C >"}</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent>
									<Menubar.Item>Item D</Menubar.Item>

									<Menubar.Item>Item E</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>

			<Menubar.Menu value="test-3-menu">
				<Menubar.Trigger>Test 3</Menubar.Trigger>

				<Menubar.Portal>
					<Menubar.Content>
						<Menubar.Item>Item Z</Menubar.Item>

						<Menubar.Item>Item Y</Menubar.Item>

						<Menubar.Sub>
							<Menubar.SubTrigger>{"Sub X >"}</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent>
									<Menubar.Item>Item W</Menubar.Item>

									<Menubar.Item>Item V</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>
		</Menubar.Root>

		<span>External</span>
	</>
);

/**
 * Menu content is mounted/unmounted through `createPresence`, and item
 * autofocus is deferred via `setTimeout(fn, 0)` until the content has
 * settled. Solid's signal writes are batched to a microtask, so we must
 * flush once (`await Promise.resolve()`) to let pending mounts/unmounts
 * apply *before* running timers - otherwise a `setTimeout` registered by a
 * mount that hasn't happened yet would be missed - then flush again after
 * `vi.runAllTimers()` so the effects triggered by those timers apply too.
 */
async function flush() {
	await Promise.resolve();
	vi.runAllTimers();
	await Promise.resolve();
}

/**
 * Simulates a real mouse click: jsdom doesn't synthesize a "click" event
 * from a `PointerEvent` sequence, and menu trigger/item open logic is a mix
 * of "pointerdown"/"pointerup" (e.g. `Menu.Trigger`) and native "click"
 * (e.g. `Menu.SubTrigger`), just like in a real browser.
 */
async function pointerClick(element: Element) {
	fireEvent(
		element,
		createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }),
	);
	await Promise.resolve();

	fireEvent(
		element,
		createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
	);
	await Promise.resolve();

	fireEvent.click(element);
	await flush();
}

describe("Menubar", () => {
	installPointerEvent();

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it("renders correctly", async () => {
		const { getByText } = render(commonUI);

		expect(getByText("Test 1")).toBeVisible();
		expect(getByText("Test 2")).toBeVisible();
		expect(getByText("Test 3")).toBeVisible();

		await pointerClick(getByText("Test 1"));

		expect(getByText("Test 1")).toHaveAttribute("data-highlighted");

		expect(within(document.body).getByText("Item 1")).toBeVisible();
		expect(within(document.body).getByText("Item 2")).toBeVisible();
		expect(
			within(document.body).getByText("Sub 3", { exact: false }),
		).toBeVisible();

		await pointerClick(getByText("Test 2"));

		expect(getByText("Test 1")).not.toHaveAttribute("data-highlighted");
		expect(getByText("Test 2")).toHaveAttribute("data-highlighted");

		expect(within(document.body).queryByText("Item 1")).not.toBeInTheDocument();
		expect(within(document.body).queryByText("Item 2")).not.toBeInTheDocument();
		expect(
			within(document.body).queryByText("Sub 3", { exact: false }),
		).not.toBeInTheDocument();

		expect(within(document.body).getByText("Item A")).toBeVisible();
		expect(within(document.body).getByText("Item B")).toBeVisible();
		expect(
			within(document.body).getByText("Sub C", { exact: false }),
		).toBeVisible();

		await pointerClick(
			within(document.body).getByText("Sub C", { exact: false }),
		);

		expect(within(document.body).getByText("Item D")).toBeVisible();
		expect(within(document.body).getByText("Item E")).toBeVisible();

		await pointerClick(getByText("External"));

		expect(getByText("Test 2")).not.toHaveAttribute("data-highlighted");

		expect(within(document.body).queryByText("Item A")).not.toBeInTheDocument();
		expect(within(document.body).queryByText("Item B")).not.toBeInTheDocument();
		expect(
			within(document.body).queryByText("Sub C", { exact: false }),
		).not.toBeInTheDocument();
	});

	it("handles keyboard navigation correctly", async () => {
		const { getByText } = render(commonUI);

		expect(getByText("Test 1")).toHaveAttribute("tabindex", "0");
		expect(getByText("Test 2")).toHaveAttribute("tabindex", "-1");
		expect(getByText("Test 3")).toHaveAttribute("tabindex", "-1");

		expect(getByText("Test 1")).not.toHaveAttribute("data-highlighted");

		fireEvent.focus(getByText("Test 1"));
		await flush();

		expect(within(document.body).queryByText("Item 1")).not.toBeInTheDocument();

		expect(getByText("Test 1")).toHaveAttribute("data-highlighted");

		fireEvent.keyDown(getByText("Test 1"), {
			key: "ArrowRight",
			code: "ArrowRight",
		});
		await flush();

		expect(within(document.body).queryByText("Item A")).not.toBeInTheDocument();

		expect(getByText("Test 1")).not.toHaveAttribute("data-highlighted");
		expect(getByText("Test 2")).toHaveAttribute("data-highlighted");

		expect(getByText("Test 1")).toHaveAttribute("tabindex", "-1");
		expect(getByText("Test 2")).toHaveAttribute("tabindex", "0");

		expect(getByText("Test 2")).toHaveFocus();

		fireEvent.keyDown(getByText("Test 2"), {
			key: "ArrowRight",
			code: "ArrowRight",
		});
		await flush();

		expect(within(document.body).queryByText("Item Z")).not.toBeInTheDocument();

		expect(getByText("Test 2")).not.toHaveAttribute("data-highlighted");
		expect(getByText("Test 3")).toHaveAttribute("data-highlighted");

		expect(getByText("Test 2")).toHaveAttribute("tabindex", "-1");
		expect(getByText("Test 3")).toHaveAttribute("tabindex", "0");

		expect(getByText("Test 3")).toHaveFocus();

		fireEvent.keyDown(getByText("Test 3"), {
			key: "ArrowRight",
			code: "ArrowRight",
		});
		await flush();

		expect(getByText("Test 1")).toHaveFocus();

		fireEvent.keyDown(getByText("Test 1"), {
			key: "ArrowDown",
			code: "ArrowDown",
		});
		await flush();

		expect(within(document.body).getByText("Item 1")).toBeVisible();

		fireEvent.keyDown(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});
		await flush();

		// Navigating to the next menu while focus is already inside an open
		// menu's item list (as opposed to switching via the top-level trigger
		// itself) enters the new menu's item list directly, focusing its first
		// item, instead of merely opening the menu with focus left on its
		// trigger.
		expect(within(document.body).getByText("Item A")).toHaveFocus();

		fireEvent.keyDown(document.activeElement as Element, {
			key: "ArrowDown",
			code: "ArrowDown",
		});
		await flush();
		fireEvent.keyDown(document.activeElement as Element, {
			key: "ArrowDown",
			code: "ArrowDown",
		});
		await flush();

		expect(
			within(document.body).getByText("Sub C", { exact: false }),
		).toHaveFocus();

		fireEvent.keyDown(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});
		await flush();

		expect(within(document.body).getByText("Item D")).toHaveFocus();

		fireEvent.keyDown(document.activeElement as Element, {
			key: "ArrowLeft",
			code: "ArrowLeft",
		});
		await flush();

		expect(
			within(document.body).getByText("Sub C", { exact: false }),
		).toHaveFocus();

		fireEvent.keyDown(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});
		await flush();
		fireEvent.keyDown(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});
		await flush();

		expect(within(document.body).getByText("Item Z")).toBeVisible();
	});

	it("handles hover correctly", async () => {
		const { getByText } = render(commonUI);

		fireEvent.mouseEnter(getByText("Test 2"));
		await flush();

		expect(getByText("Test 1")).toHaveAttribute("tabindex", "0");

		expect(within(document.body).queryByText("Item A")).not.toBeInTheDocument();

		await pointerClick(getByText("Test 1"));

		expect(within(document.body).getByText("Item 1")).toBeVisible();

		await pointerClick(getByText("Test 2"));

		expect(within(document.body).queryByText("Item 1")).not.toBeInTheDocument();
		expect(within(document.body).getByText("Item A")).toBeVisible();
	});
});
