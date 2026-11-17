import { createPointerEvent } from "@kobalte/tests";
import { fireEvent } from "@solidjs/testing-library";
import { render } from "solid-js/web";
import { vi } from "vitest";

import { DismissableLayer } from "./dismissable-layer";

describe("DismissableLayer", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.clearAllTimers();
	});

	describe("Shadow DOM", () => {
		/**
		 * The shape of #445: a layer and its trigger both rendered inside a shadow root.
		 *
		 * `createInteractOutside` listens on the document, so `event.target` is retargeted to the
		 * shadow host. The host matches neither `excludedElements` nor the layer itself, so both the
		 * trigger and the layer's own content read as "outside" and the layer dismissed itself on
		 * pointerdown — which is what makes a `Select` trigger close and immediately reopen its
		 * dropdown, and what makes clicking an item dismiss the layer before the item can activate.
		 */
		const setupShadowTest = () => {
			const onDismiss = vi.fn();

			const host = document.createElement("div");
			document.body.appendChild(host);
			const shadowRoot = host.attachShadow({ mode: "open" });

			let trigger!: HTMLButtonElement;
			let content!: HTMLSpanElement;
			let outside!: HTMLButtonElement;

			const dispose = render(
				() => (
					<>
						<button ref={trigger} type="button">
							Trigger
						</button>
						<button ref={outside} type="button">
							Outside
						</button>
						<DismissableLayer
							excludedElements={[() => trigger]}
							onDismiss={onDismiss}
						>
							<span ref={content}>Content</span>
						</DismissableLayer>
					</>
				),
				shadowRoot,
			);

			// `createInteractOutside` defers registering its pointerdown listener by a tick.
			vi.runAllTimers();

			onTestFinished(() => {
				dispose();
				host.remove();
			});

			return { onDismiss, trigger, content, outside };
		};

		it("should not dismiss when interacting with an excluded trigger inside a shadow root", () => {
			const { onDismiss, trigger } = setupShadowTest();

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", { bubbles: true, composed: true }),
			);

			expect(onDismiss).not.toHaveBeenCalled();
		});

		it("should not dismiss when interacting with the layer's own content inside a shadow root", () => {
			const { onDismiss, content } = setupShadowTest();

			fireEvent(
				content,
				createPointerEvent("pointerdown", { bubbles: true, composed: true }),
			);

			expect(onDismiss).not.toHaveBeenCalled();
		});

		it("should still dismiss when interacting outside the layer inside a shadow root", () => {
			const { onDismiss, outside } = setupShadowTest();

			fireEvent(
				outside,
				createPointerEvent("pointerdown", { bubbles: true, composed: true }),
			);

			expect(onDismiss).toHaveBeenCalledTimes(1);
		});

		/**
		 * On touch the outside check waits for the following `click`, after the pointerdown has
		 * finished dispatching — so the target must be resolved while it is still dispatching.
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

		it("should not dismiss on a touch on the layer's own content inside a shadow root", () => {
			const { onDismiss, content } = setupShadowTest();

			touchDown(content);

			expect(onDismiss).not.toHaveBeenCalled();
		});

		it("should not dismiss on a touch on an excluded trigger inside a shadow root", () => {
			const { onDismiss, trigger } = setupShadowTest();

			touchDown(trigger);

			expect(onDismiss).not.toHaveBeenCalled();
		});

		it("should still dismiss on a touch outside the layer inside a shadow root", () => {
			const { onDismiss, outside } = setupShadowTest();

			touchDown(outside);

			expect(onDismiss).toHaveBeenCalledTimes(1);
		});

		it("should resolve touches across two shadow roots (trigger in one, portalled layer in another)", () => {
			// An app rendered in one shadow root that portals its layers into a second
			// one: a tap on the content retargets to the portal host, a tap on the
			// trigger to the app host — neither is the element that was touched.
			const onDismiss = vi.fn();
			const appHost = document.createElement("div");
			const portalHost = document.createElement("div");
			document.body.append(appHost, portalHost);
			const appRoot = appHost.attachShadow({ mode: "open" });
			const portalRoot = portalHost.attachShadow({ mode: "open" });

			const trigger = document.createElement("button");
			const outside = document.createElement("button");
			appRoot.append(trigger, outside);

			let content!: HTMLSpanElement;
			const dispose = render(
				() => (
					<DismissableLayer
						excludedElements={[() => trigger]}
						onDismiss={onDismiss}
					>
						<span ref={content}>Content</span>
					</DismissableLayer>
				),
				portalRoot,
			);
			vi.runAllTimers();
			onTestFinished(() => {
				dispose();
				appHost.remove();
				portalHost.remove();
			});

			const mouseDown = (target: Element) =>
				fireEvent(
					target,
					createPointerEvent("pointerdown", { bubbles: true, composed: true }),
				);

			mouseDown(content);
			mouseDown(trigger);
			touchDown(content);
			touchDown(trigger);
			expect(onDismiss).not.toHaveBeenCalled();

			touchDown(outside);
			expect(onDismiss).toHaveBeenCalledTimes(1);
		});

		it("should not dismiss when interacting with a web-component trigger in the light DOM", () => {
			// The trigger is a custom element with its own shadow root (e.g. a design-system
			// button), and the layer is in the light DOM. `excludedElements` is checked with
			// `contains`, which can't see into the trigger's shadow root, so the layer must be
			// handed the trigger's host — not its internal button — or it dismisses on the very
			// interaction that is meant to toggle it.
			const onDismiss = vi.fn();
			const trigger = document.createElement("div");
			const triggerInner = document.createElement("button");
			trigger.attachShadow({ mode: "open" }).appendChild(triggerInner);
			document.body.appendChild(trigger);

			const container = document.createElement("div");
			document.body.appendChild(container);
			const dispose = render(
				() => (
					<DismissableLayer
						excludedElements={[() => trigger]}
						onDismiss={onDismiss}
					>
						<span>Content</span>
					</DismissableLayer>
				),
				container,
			);
			vi.runAllTimers();
			onTestFinished(() => {
				dispose();
				container.remove();
				trigger.remove();
			});

			fireEvent(
				triggerInner,
				createPointerEvent("pointerdown", { bubbles: true, composed: true }),
			);
			touchDown(triggerInner);

			expect(onDismiss).not.toHaveBeenCalled();
		});
	});
});
