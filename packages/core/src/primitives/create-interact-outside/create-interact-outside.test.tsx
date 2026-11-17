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
		const setupShadowTest = (
			extraProps: Partial<CreateInteractOutsideProps> = {},
		) => {
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
					{
						onFocusOutside,
						onPointerDownOutside,
						onInteractOutside,
						...extraProps,
					},
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

		/**
		 * A touch defers the outside check to the following `click` (see `onPointerDown`). By then
		 * the pointerdown has finished dispatching and its `composedPath()` is empty, so only the
		 * retargeted `event.target` — the shadow host — is left to resolve the target from.
		 */
		const touchDown = (target: Element) => {
			fireEvent(
				target,
				createPointerEvent("pointerdown", {
					bubbles: true,
					composed: true,
					pointerType: "touch",
				}),
			);
			fireEvent(
				target,
				new MouseEvent("click", { bubbles: true, composed: true }),
			);
		};

		const mouseDown = (target: Element) =>
			fireEvent(
				target,
				createPointerEvent("pointerdown", { bubbles: true, composed: true }),
			);

		it("should NOT trigger on a touch on the layer's own content inside a shadow root", () => {
			const { mocks, elements } = setupShadowTest();

			touchDown(elements.insideChild);

			expect(mocks.onPointerDownOutside).not.toHaveBeenCalled();
			expect(mocks.onInteractOutside).not.toHaveBeenCalled();
		});

		it("should still trigger on a touch on a sibling inside the same shadow root", () => {
			const seen: Element[] = [];
			// Read during dispatch: an event dispatched inside a shadow tree has its `target`
			// cleared once dispatch ends.
			const dispatchedOn: (EventTarget | null)[] = [];
			const { mocks, elements } = setupShadowTest({
				shouldExcludeElement: (element) => {
					seen.push(element);
					return false;
				},
				onPointerDownOutside: (e) => dispatchedOn.push(e.target),
			});

			touchDown(elements.outside);

			expect(seen).toEqual([elements.outside]);
			expect(dispatchedOn).toEqual([elements.outside]);
			expect(mocks.onInteractOutside).toHaveBeenCalledTimes(1);
		});

		it("should NOT trigger on content slotted into the layer", () => {
			// Slotted nodes stay in the light tree, so no ancestor walk from them reaches the
			// layer — but they render inside it, and the event's composed path says so.
			const onPointerDownOutside = vi.fn();
			const host = document.createElement("div");
			const slotted = document.createElement("p");
			host.appendChild(slotted);
			document.body.appendChild(host);
			const inside = document.createElement("div");
			inside.appendChild(document.createElement("slot"));
			host.attachShadow({ mode: "open" }).appendChild(inside);

			const dispose = createRoot((disposer) => {
				createInteractOutside({ onPointerDownOutside }, () => inside);
				return disposer;
			});
			vi.runAllTimers();
			onTestFinished(() => {
				dispose();
				host.remove();
			});

			mouseDown(slotted);
			touchDown(slotted);

			expect(onPointerDownOutside).not.toHaveBeenCalled();
		});

		/**
		 * A layer in the light DOM next to a *foreign* web component — e.g. a trigger rendered by a
		 * custom element with its own shadow root. Its internals are encapsulated: the layer must
		 * see the component's host, exactly as it did before shadow-aware target resolution.
		 */
		const setupForeignComponentTest = (
			extraProps: Partial<CreateInteractOutsideProps> = {},
		) => {
			const onPointerDownOutside = vi.fn();

			const inside = document.createElement("div");
			const component = document.createElement("div");
			const componentInner = document.createElement("button");
			component.attachShadow({ mode: "open" }).appendChild(componentInner);
			document.body.append(inside, component);

			const dispose = createRoot((disposer) => {
				createInteractOutside(
					{ onPointerDownOutside, ...extraProps },
					() => inside,
				);
				return disposer;
			});
			vi.runAllTimers();
			onTestFinished(() => {
				dispose();
				inside.remove();
				component.remove();
			});

			return { onPointerDownOutside, component, componentInner };
		};

		it("should report an interaction inside a foreign component as that component's host", () => {
			const seen: Element[] = [];
			const dispatchedOn: (EventTarget | null)[] = [];
			const { component, componentInner } = setupForeignComponentTest({
				shouldExcludeElement: (element) => {
					seen.push(element);
					return false;
				},
				onPointerDownOutside: (e) => dispatchedOn.push(e.target),
			});

			mouseDown(componentInner);

			// The host first — what the layer's tree sees — then the element itself.
			expect(seen).toEqual([component, componentInner]);
			expect(dispatchedOn).toEqual([component]);
		});

		it("should let shouldExcludeElement exempt a web-component trigger via contains", () => {
			// `contains` can't see into a shadow root, so this stops matching if the callback is
			// handed the component's internal element — the trigger then dismisses the layer and the
			// same click reopens it.
			const triggerRef: { current?: Element } = {};
			const { onPointerDownOutside, component, componentInner } =
				setupForeignComponentTest({
					shouldExcludeElement: (element) =>
						!!triggerRef.current?.contains(element),
				});
			triggerRef.current = component;

			mouseDown(componentInner);
			touchDown(componentInner);

			expect(onPointerDownOutside).not.toHaveBeenCalled();
		});

		it("should report a component nested in the layer's shadow root as its host", () => {
			// Retargeting is relative to the layer's own tree: siblings in its shadow root are
			// themselves, but a component nested in that root stays encapsulated behind its host.
			const seen: Element[] = [];
			const host = document.createElement("div");
			document.body.appendChild(host);
			const shadowRoot = host.attachShadow({ mode: "open" });
			const inside = document.createElement("div");
			const nested = document.createElement("div");
			const nestedInner = document.createElement("button");
			nested.attachShadow({ mode: "open" }).appendChild(nestedInner);
			shadowRoot.append(inside, nested);

			const dispose = createRoot((disposer) => {
				createInteractOutside(
					{
						shouldExcludeElement: (element) => {
							seen.push(element);
							return false;
						},
					},
					() => inside,
				);
				return disposer;
			});
			vi.runAllTimers();
			onTestFinished(() => {
				dispose();
				host.remove();
			});

			mouseDown(nestedInner);

			expect(seen).toEqual([nested, nestedInner]);
		});

		it("should let shouldExcludeElement exempt a trigger in a different shadow root than the layer", () => {
			// An app rendered in one shadow root that portals its layers into a second
			// one. Seen from the layer's tree, the trigger is just the app root's host,
			// so exclusion must also be asked of the trigger itself.
			const appHost = document.createElement("div");
			const portalHost = document.createElement("div");
			document.body.append(appHost, portalHost);
			const trigger = document.createElement("button");
			const outside = document.createElement("button");
			appHost.attachShadow({ mode: "open" }).append(trigger, outside);
			const inside = document.createElement("div");
			portalHost.attachShadow({ mode: "open" }).appendChild(inside);

			const dispatchedOn: (EventTarget | null)[] = [];
			const dispose = createRoot((disposer) => {
				createInteractOutside(
					{
						shouldExcludeElement: (element) => trigger.contains(element),
						onPointerDownOutside: (e) => dispatchedOn.push(e.target),
					},
					() => inside,
				);
				return disposer;
			});
			vi.runAllTimers();
			onTestFinished(() => {
				dispose();
				appHost.remove();
				portalHost.remove();
			});

			mouseDown(trigger);
			touchDown(trigger);
			expect(dispatchedOn).toEqual([]);

			// Genuinely outside: reported as the layer's tree sees it, i.e. the app host.
			mouseDown(outside);
			expect(dispatchedOn).toEqual([appHost]);
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
