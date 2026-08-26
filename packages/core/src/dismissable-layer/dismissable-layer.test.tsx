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
	});
});
