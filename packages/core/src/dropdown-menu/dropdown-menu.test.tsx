import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";

import * as DropdownMenu from ".";

// The vitest config runs test files with `isolate: false`, so the shared module cache makes
// `@solidjs/testing-library`'s automatic cleanup register only in the first file that imports
// it. Register it here too, otherwise renders accumulate in `document.body` across tests in a
// full-suite run and `screen.*` queries find duplicates.
afterEach(cleanup);

// jsdom may not ship PointerEvent; dispatch the right event type with `pointerType: "mouse"` either way,
// since the menu's pointer handlers ignore non-mouse pointers.
function firePointer(target: Element, type: "pointermove" | "pointerleave") {
	const init: PointerEventInit = {
		bubbles: type === "pointermove",
		cancelable: true,
		pointerType: "mouse",
	};

	const event =
		typeof PointerEvent === "function"
			? new PointerEvent(type, init)
			: Object.assign(new MouseEvent(type, init), { pointerType: "mouse" });

	fireEvent(target, event);
}

function MenuWithSearch(props: { onItemASelect?: () => void }) {
	return (
		<DropdownMenu.Root defaultOpen>
			<DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content>
					<input data-testid="search" />
					<DropdownMenu.Item
						data-testid="item-a"
						onSelect={props.onItemASelect}
					>
						A
					</DropdownMenu.Item>
					<DropdownMenu.Item data-testid="item-b">B</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger data-testid="sub-trigger">
							More
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent>
								<DropdownMenu.Item data-testid="item-c">C</DropdownMenu.Item>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

/**
 * Mount the menu and focus the in-menu search input.
 *
 * This deliberately never awaits timers (`findBy*`/`waitFor` poll with `setTimeout`, and in
 * this suite's shared-worker runs another file can leave those frozen, hanging every await
 * until the 5s test timeout). Microtask flushes are enough: the menu's own autofocus is
 * deferred behind `setTimeout(0)` and can only run at an event-loop turn, while the focus
 * guards keep every in-test focus operation synchronous — so the deferred autofocus neither
 * needs to have run, nor gets a chance to run, before the assertions.
 */
async function renderWithFocusedSearch(onItemASelect?: () => void) {
	render(() => <MenuWithSearch onItemASelect={onItemASelect} />);

	// Flush mount microtasks only; never yield to the timer queue.
	await Promise.resolve();

	const search = screen.getByTestId("search");
	search.focus();
	expect(document.activeElement).toBe(search);

	return { search };
}

describe("hovering menu items with a search input focused", () => {
	it("keeps focus on the search input while the pointer moves over an item", async () => {
		const { search } = await renderWithFocusedSearch();
		const item = screen.getByTestId("item-a");

		firePointer(item, "pointermove");

		expect(document.activeElement).toBe(search);
		// Only the DOM focus call is skipped: the selection manager must still mark the
		// hovered row as the focused key, so `data-highlighted` keeps working.
		expect(item).toHaveAttribute("data-highlighted");
	});

	it("keeps focus on the search input when the pointer leaves an item", async () => {
		const { search } = await renderWithFocusedSearch();
		const item = screen.getByTestId("item-a");

		firePointer(item, "pointerleave");

		expect(document.activeElement).toBe(search);
	});

	it("keeps focus on the search input while the pointer moves over a sub trigger", async () => {
		const { search } = await renderWithFocusedSearch();
		const subTrigger = screen.getByTestId("sub-trigger");

		firePointer(subTrigger, "pointermove");

		expect(document.activeElement).toBe(search);
		expect(subTrigger).toHaveAttribute("data-highlighted");
	});

	it("still lets Enter select the hovered row while the search input is focused", async () => {
		const onItemASelect = vi.fn();
		const { search } = await renderWithFocusedSearch(onItemASelect);
		const item = screen.getByTestId("item-a");

		firePointer(item, "pointermove");

		expect(document.activeElement).toBe(search);
		expect(item).toHaveAttribute("data-highlighted");

		// Kobalte has no content-level Enter handler; a consumer keeping DOM focus in the
		// search field forwards Enter to the hovered row itself. The row's own key handler
		// must still select it (selection manager state untouched by the focus guards).
		fireEvent.keyDown(item, { key: "Enter" });

		expect(onItemASelect).toHaveBeenCalled();
	});
});

describe("hovering menu items without an editable focused", () => {
	it("focuses the item the pointer moves over", async () => {
		const onItemASelect = vi.fn();
		render(() => <MenuWithSearch onItemASelect={onItemASelect} />);
		await Promise.resolve();
		const item = screen.getByTestId("item-a");

		expect(document.activeElement).not.toBe(item);

		firePointer(item, "pointermove");

		expect(document.activeElement).toBe(item);

		// Native behavior: with focus on the row itself, Enter selects through the row's
		// key handler.
		fireEvent.keyDown(item, { key: "Enter" });

		expect(onItemASelect).toHaveBeenCalled();
	});
});
