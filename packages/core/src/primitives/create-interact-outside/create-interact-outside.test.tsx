import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render } from "@solidjs/testing-library";
import type { JSX } from "solid-js";

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
