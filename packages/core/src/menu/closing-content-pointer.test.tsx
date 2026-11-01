import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { vi } from "vitest";

import * as DropdownMenu from "../dropdown-menu";

// Closed content stays mounted until its exit animation ends. The content here keeps the
// animation name "enter" while it is open and "exit" once it closes, as an exit animation does.
let animationName = "enter";

function mockExitAnimation() {
	const getStyles = window.getComputedStyle.bind(window);

	vi.spyOn(globalThis, "getComputedStyle").mockImplementation(
		(element, pseudoElement) =>
			new Proxy(getStyles(element, pseudoElement), {
				get(styles, property) {
					if (property === "animationName") {
						return animationName;
					}

					const value = Reflect.get(styles, property);

					return typeof value === "function" ? value.bind(styles) : value;
				},
			}),
	);
}

const firePointer = (element: Element, type: string) =>
	fireEvent(
		element,
		createPointerEvent(type, {
			pointerId: 1,
			pointerType: "mouse",
			clientX: 0,
			clientY: 0,
		}),
	);

function renderMenu() {
	const [open, setOpen] = createSignal(true);

	render(() => (
		<>
			<button type="button" data-testid="outside">
				Outside
			</button>
			<DropdownMenu.Root modal={false} open={open()} onOpenChange={setOpen}>
				<DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content data-testid="content">
						<DropdownMenu.Item data-testid="item">One</DropdownMenu.Item>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger data-testid="sub-trigger">
								More
							</DropdownMenu.SubTrigger>
						</DropdownMenu.Sub>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</>
	));

	vi.runAllTimers();

	return {
		outside: document.querySelector<HTMLElement>("[data-testid=outside]")!,
		startClosing: () => {
			animationName = "exit";
			setOpen(false);
		},
	};
}

const ITEMS = [
	["an item", "[data-testid=item]"],
	["a sub trigger", "[data-testid=sub-trigger]"],
];

const inContent = (selector: string) =>
	document.querySelector<HTMLElement>(`[data-testid=content] ${selector}`)!;

describe("Pointer events on closing menu content", () => {
	installPointerEvent();

	beforeEach(() => {
		animationName = "enter";
		vi.useFakeTimers();
		mockExitAnimation();
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it.each(ITEMS)("%s takes the focus while open", (_name, selector) => {
		renderMenu();
		const element = inContent(selector);

		firePointer(element, "pointermove");

		expect(document.activeElement).toBe(element);
	});

	it.each(ITEMS)("%s leaves the focus alone once closed", (_name, selector) => {
		const { outside, startClosing } = renderMenu();
		const element = inContent(selector);

		startClosing();
		vi.runAllTimers();
		expect(element.isConnected).toBe(true);
		outside.focus();

		firePointer(element, "pointermove");
		firePointer(element, "pointerleave");

		expect(document.activeElement).toBe(outside);
	});

	it("a sub trigger still cancels its pending open once closed", () => {
		const { startClosing } = renderMenu();
		const subTrigger = inContent("[data-testid=sub-trigger]");

		firePointer(subTrigger, "pointermove");
		startClosing();
		firePointer(subTrigger, "pointerleave");
		vi.runAllTimers();

		expect(subTrigger.isConnected).toBe(true);
		expect(subTrigger).not.toHaveAttribute("aria-expanded", "true");
	});
});
