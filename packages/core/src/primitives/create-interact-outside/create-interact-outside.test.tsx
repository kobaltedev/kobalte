import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render } from "@solidjs/testing-library";
import { type JSX, createRoot } from "solid-js";

import {
	type CreateInteractOutsideProps,
	createInteractOutside,
} from "./create-interact-outside";

describe("createInteractOutside", () => {
	installPointerEvent();

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	type TestComponent = (props: { ref: (el: Element) => void }) => JSX.Element;
	// Helper function to set up test with all common mocks and elements
	const setupTest = (
		Component: TestComponent,
		props: Partial<CreateInteractOutsideProps> = {},
	) => {
		const onFocusOutside = vi.fn();
		const onPointerDownOutside = vi.fn();
		const onInteractOutside = vi.fn();

		const TestComponentWithHook = () => {
			let ref: Element | undefined;

			createInteractOutside(
				{
					onFocusOutside,
					onPointerDownOutside,
					onInteractOutside,
					...props,
				},
				() => ref,
			);

			return <Component ref={(el) => (ref = el)} />;
		};

		const { getByTestId } = render(() => <TestComponentWithHook />);

		// Advance timers to allow pointer event registration
		vi.runAllTimers();

		return {
			mocks: {
				onFocusOutside,
				onPointerDownOutside,
				onInteractOutside,
			},
			elements: {
				inside: getByTestId("inside"),
				outside: getByTestId("outside"),
			},
		};
	};

	// Test configurations for different element combinations
	const testConfigurations: {
		name: string;
		component: TestComponent;
	}[] = [
		{
			name: "HTML ref with HTML outside",
			component: (props) => (
				<>
					<div ref={props.ref} data-testid="inside" tabIndex={0}>
						Inside Content
					</div>
					<div data-testid="outside" tabIndex={0}>
						Outside Element
					</div>
				</>
			),
		},
		{
			name: "SVG ref with HTML outside",
			component: (props) => (
				<>
					<svg
						ref={props.ref}
						data-testid="inside"
						width="100"
						height="100"
						tabIndex={0}
						role="img"
						aria-label="Inside SVG"
					>
						<circle cx="50" cy="50" r="40" fill="blue" />
					</svg>
					<div data-testid="outside" tabIndex={0}>
						Outside Element
					</div>
				</>
			),
		},
		{
			name: "HTML ref with SVG outside",
			component: (props) => (
				<>
					<div ref={props.ref} data-testid="inside" tabIndex={0}>
						Inside Content
					</div>
					<svg
						data-testid="outside"
						width="100"
						height="100"
						tabIndex={0}
						role="img"
						aria-label="Outside SVG"
					>
						<circle cx="50" cy="50" r="40" fill="red" />
					</svg>
				</>
			),
		},
		{
			name: "SVG ref with SVG outside",
			component: (props) => (
				<>
					<svg
						ref={props.ref}
						data-testid="inside"
						width="100"
						height="100"
						tabIndex={0}
						role="img"
						aria-label="Inside SVG"
					>
						<circle cx="50" cy="50" r="40" fill="blue" />
					</svg>
					<svg
						data-testid="outside"
						width="100"
						height="100"
						tabIndex={0}
						role="img"
						aria-label="Outside SVG"
					>
						<circle cx="50" cy="50" r="40" fill="red" />
					</svg>
				</>
			),
		},
	];

	describe.each(testConfigurations)("$name", ({ component }) => {
		describe("Focus Events", () => {
			it("should trigger when focusing outside", () => {
				const { mocks, elements } = setupTest(component);

				fireEvent.focusIn(elements.outside);

				expect(mocks.onFocusOutside).toHaveBeenCalledTimes(1);
				expect(mocks.onPointerDownOutside).not.toHaveBeenCalled();
				expect(mocks.onInteractOutside).toHaveBeenCalledTimes(1);
			});

			it("should NOT trigger when focusing inside", () => {
				const { mocks, elements } = setupTest(component);

				fireEvent.focusIn(elements.inside);

				expect(mocks.onFocusOutside).not.toHaveBeenCalled();
				expect(mocks.onPointerDownOutside).not.toHaveBeenCalled();
				expect(mocks.onInteractOutside).not.toHaveBeenCalled();
			});
		});

		describe("Pointer Events", () => {
			it("should trigger when clicking outside", async () => {
				const { mocks, elements } = setupTest(component);

				fireEvent(elements.outside, createPointerEvent("pointerdown", {}));

				expect(mocks.onFocusOutside).not.toHaveBeenCalled();
				expect(mocks.onPointerDownOutside).toHaveBeenCalledTimes(1);
				expect(mocks.onInteractOutside).toHaveBeenCalledTimes(1);
			});

			it("should NOT trigger when clicking inside", async () => {
				const { mocks, elements } = setupTest(component);

				fireEvent(elements.inside, createPointerEvent("pointerdown", {}));

				expect(mocks.onFocusOutside).not.toHaveBeenCalled();
				expect(mocks.onPointerDownOutside).not.toHaveBeenCalled();
				expect(mocks.onInteractOutside).not.toHaveBeenCalled();
			});
		});
	});

	describe("Shadow DOM", () => {
		/**
		 * A layer whose content lives inside a shadow root — what happens when a portal target is
		 * itself shadowed, rather than being in the light DOM.
		 *
		 * These listeners are on the document, so `event.target` is retargeted to the shadow host.
		 * The host is an *ancestor* of the layer, so `contains(layer, host)` is false and every
		 * interaction with the layer's own content read as "outside": the layer dismissed itself on
		 * pointerdown, the content unmounted, and pointerup never landed on anything. The symptom is
		 * a menu that closes when you click an item, without the item ever activating.
		 */
		const setupShadowTest = () => {
			const onFocusOutside = vi.fn();
			const onPointerDownOutside = vi.fn();
			const onInteractOutside = vi.fn();

			const host = document.createElement("div");
			document.body.appendChild(host);
			const shadowRoot = host.attachShadow({ mode: "open" });

			// The layer (what `ref()` returns) and a child of it — clicking the child is the case
			// that broke, since only the child is deep enough for retargeting to matter.
			const inside = document.createElement("div");
			const insideChild = document.createElement("span");
			inside.appendChild(insideChild);
			shadowRoot.appendChild(inside);

			// A sibling in the same shadow root: genuinely outside the layer, and must stay so.
			const outside = document.createElement("div");
			shadowRoot.appendChild(outside);

			const dispose = createRoot((disposer) => {
				createInteractOutside(
					{ onFocusOutside, onPointerDownOutside, onInteractOutside },
					() => inside,
				);

				return disposer;
			});

			vi.runAllTimers();

			onTestFinished(() => {
				dispose();
				host.remove();
			});

			return {
				mocks: { onFocusOutside, onPointerDownOutside, onInteractOutside },
				elements: { inside, insideChild, outside },
			};
		};

		it("should NOT trigger when clicking the layer's own content inside a shadow root", () => {
			const { mocks, elements } = setupShadowTest();

			fireEvent(
				elements.insideChild,
				createPointerEvent("pointerdown", { bubbles: true, composed: true }),
			);

			expect(mocks.onPointerDownOutside).not.toHaveBeenCalled();
			expect(mocks.onInteractOutside).not.toHaveBeenCalled();
		});

		it("should still trigger when clicking a sibling inside the same shadow root", () => {
			const { mocks, elements } = setupShadowTest();

			fireEvent(
				elements.outside,
				createPointerEvent("pointerdown", { bubbles: true, composed: true }),
			);

			expect(mocks.onPointerDownOutside).toHaveBeenCalledTimes(1);
			expect(mocks.onInteractOutside).toHaveBeenCalledTimes(1);
		});

		it("should NOT trigger when focus moves to the layer's own content inside a shadow root", () => {
			const { mocks, elements } = setupShadowTest();

			fireEvent.focusIn(elements.insideChild, { composed: true });

			expect(mocks.onFocusOutside).not.toHaveBeenCalled();
			expect(mocks.onInteractOutside).not.toHaveBeenCalled();
		});
	});

	describe("Configuration", () => {
		it("should respect isDisabled prop", () => {
			const { mocks, elements } = setupTest(testConfigurations[0].component, {
				isDisabled: true,
			});

			fireEvent.focusIn(elements.outside);

			expect(mocks.onFocusOutside).not.toHaveBeenCalled();
			expect(mocks.onPointerDownOutside).not.toHaveBeenCalled();
			expect(mocks.onInteractOutside).not.toHaveBeenCalled();
		});

		it("should not trigger when shouldExcludeElement returns true", () => {
			const shouldExcludeElement = vi.fn((element: Element) => {
				return element === elements.outside; // Exclude outside element
			});

			const { mocks, elements } = setupTest(testConfigurations[0].component, {
				shouldExcludeElement,
			});

			// This should NOT trigger because shouldExcludeElement returns true for outside element
			fireEvent.focusIn(elements.outside);

			expect(shouldExcludeElement).toHaveBeenCalledWith(elements.outside);
			expect(mocks.onInteractOutside).not.toHaveBeenCalled();
		});

		it("should trigger when shouldExcludeElement returns false", () => {
			const shouldExcludeElement = vi.fn((element: Element) => {
				return false; // Do not exclude any elements
			});

			const { mocks, elements } = setupTest(testConfigurations[0].component, {
				shouldExcludeElement,
			});

			// This should trigger because shouldExcludeElement returns false for outside element
			fireEvent.focusIn(elements.outside);

			expect(shouldExcludeElement).toHaveBeenCalledWith(elements.outside);
			expect(mocks.onInteractOutside).toHaveBeenCalledTimes(1);
		});
	});
});
