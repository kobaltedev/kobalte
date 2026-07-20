/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/test/ariaHideOutside.test.js
 */

import { fireEvent, render, waitFor } from "@solidjs/testing-library";
import { createSignal, onMount } from "solid-js";

import { ariaHideOutside } from "./create-hide-outside";

// aria-hidden is applied/removed on the next frame (see create-hide-outside).
// Flush that boundary before asserting the attribute.
const flush = () =>
	new Promise<void>((resolve) =>
		setTimeout(() => requestAnimationFrame(() => resolve())),
	);

describe("ariaHideOutside", () => {
	it("should hide everything except the provided element [button]", async () => {
		const { getByRole, getAllByRole } = render(() => (
			<>
				<input type="checkbox" />
				<button type="button">Button</button>
				<input type="checkbox" />
			</>
		));

		const checkboxes = getAllByRole("checkbox");
		const button = getByRole("button");

		const revert = ariaHideOutside([button]);
		await flush();

		expect(checkboxes[0]).toHaveAttribute("aria-hidden", "true");
		expect(checkboxes[1]).toHaveAttribute("aria-hidden", "true");
		expect(button).not.toHaveAttribute("aria-hidden");

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getByRole("button")).not.toThrow();

		revert();
		await flush();

		expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
		expect(checkboxes[1]).not.toHaveAttribute("aria-hidden");
		expect(button).not.toHaveAttribute("aria-hidden");

		expect(() => getAllByRole("checkbox")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();
	});

	it("should hide everything except multiple elements", async () => {
		const { getByRole, getAllByRole, queryByRole, queryAllByRole } = render(
			() => (
				<>
					<input type="checkbox" />
					<button type="button">Button</button>
					<input type="checkbox" />
				</>
			),
		);

		const checkboxes = getAllByRole("checkbox");
		const button = getByRole("button");

		const revert = ariaHideOutside(checkboxes);
		await flush();

		expect(checkboxes[0]).not.toHaveAttribute("aria-hidden", "true");
		expect(checkboxes[1]).not.toHaveAttribute("aria-hidden", "true");
		expect(button).toHaveAttribute("aria-hidden");

		expect(queryAllByRole("checkbox")).not.toBeNull();
		expect(queryByRole("button")).toBeNull();

		revert();
		await flush();

		expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
		expect(checkboxes[1]).not.toHaveAttribute("aria-hidden");
		expect(button).not.toHaveAttribute("aria-hidden");

		expect(() => getAllByRole("checkbox")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();
	});

	it("should not traverse into an already hidden container", async () => {
		const { getByRole, getAllByRole } = render(() => (
			<>
				<div>
					<input type="checkbox" />
				</div>
				<button type="button">Button</button>
				<input type="checkbox" />
			</>
		));

		const checkboxes = getAllByRole("checkbox");
		const button = getByRole("button");

		const revert = ariaHideOutside([button]);
		await flush();

		expect(checkboxes[0].parentElement).toHaveAttribute("aria-hidden", "true");
		expect(checkboxes[1]).toHaveAttribute("aria-hidden", "true");
		expect(button).not.toHaveAttribute("aria-hidden");

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getByRole("button")).not.toThrow();

		revert();
		await flush();

		expect(checkboxes[0].parentElement).not.toHaveAttribute("aria-hidden");
		expect(checkboxes[1]).not.toHaveAttribute("aria-hidden");
		expect(button).not.toHaveAttribute("aria-hidden");

		expect(() => getAllByRole("checkbox")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();
	});

	it("should not overwrite an existing aria-hidden prop", async () => {
		const { getByRole, getAllByRole } = render(() => (
			<>
				{/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: test */}
				<input type="checkbox" aria-hidden="true" />
				<button type="button">Button</button>
				<input type="checkbox" />
			</>
		));

		let checkboxes = getAllByRole("checkbox");
		const button = getByRole("button");

		const revert = ariaHideOutside([button]);
		await flush();

		expect(checkboxes).toHaveLength(1);
		expect(checkboxes[0]).toHaveAttribute("aria-hidden", "true");
		expect(button).not.toHaveAttribute("aria-hidden");

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getByRole("button")).not.toThrow();

		revert();
		await flush();

		checkboxes = getAllByRole("checkbox");
		expect(checkboxes).toHaveLength(1);
		expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
		expect(button).not.toHaveAttribute("aria-hidden");

		expect(() => getAllByRole("checkbox")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();
	});

	it("should handle when a new element is added outside while active", async () => {
		const Test = () => {
			let toggleRef: any;
			let revertRef: any;

			const [show, setShow] = createSignal(false);
			let revert: () => void;

			onMount(() => {
				revert = ariaHideOutside([toggleRef, revertRef]);
			});

			return (
				<>
					{show() && <input type="checkbox" />}
					<button
						type="button"
						data-testid="toggle"
						ref={toggleRef}
						onClick={() => setShow(true)}
					>
						Toggle
					</button>
					<button
						type="button"
						data-testid="revert"
						ref={revertRef}
						onClick={() => revert()}
					>
						Revert
					</button>
					{show() && <input type="checkbox" />}
				</>
			);
		};

		const { getByTestId, getAllByRole } = render(() => <Test />);

		const toggle = getByTestId("toggle");
		const revert = getByTestId("revert");
		expect(() => getAllByRole("checkbox")).toThrow();

		// Toggle the show state
		fireEvent.click(toggle);
		await Promise.resolve();

		// MutationObserver is async, hiding is deferred a frame
		await waitFor(() => expect(() => getAllByRole("checkbox")).toThrow());
		expect(() => getAllByRole("button")).not.toThrow();

		// revert the 'ariaHideOutside'
		fireEvent.click(revert);
		await flush();

		expect(getAllByRole("checkbox")).toHaveLength(2);
	});

	it("should handle when a new element is added to an already hidden container", async () => {
		const Test = () => {
			const [show, setShow] = createSignal(false);

			return (
				<>
					<div data-testid="test">{show() && <input type="checkbox" />}</div>
					<button type="button" onClick={() => setShow(true)}>
						Button
					</button>
					{show() && <input type="checkbox" />}
				</>
			);
		};

		const { getByRole, getAllByRole, getByTestId } = render(() => <Test />);

		const button = getByRole("button");
		const test = getByTestId("test");
		expect(() => getAllByRole("checkbox")).toThrow();

		const revert = ariaHideOutside([button]);
		await flush();

		expect(test).toHaveAttribute("aria-hidden");

		// Toggle the show state
		fireEvent.click(button);
		await Promise.resolve();

		// MutationObserver is async, hiding is deferred a frame
		await waitFor(() => expect(() => getAllByRole("checkbox")).toThrow());
		expect(() => getByRole("button")).not.toThrow();

		const checkboxes = getAllByRole("checkbox", { hidden: true });
		expect(test).toHaveAttribute("aria-hidden");
		expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
		expect(checkboxes[1]).toHaveAttribute("aria-hidden", "true");

		revert();
		await flush();

		expect(getAllByRole("checkbox")).toHaveLength(2);
	});

	it("should handle when a new element is added inside a target element", async () => {
		const Test = () => {
			const [show, setShow] = createSignal(false);

			return (
				<>
					<input type="checkbox" />
					<div data-testid="test">
						<button type="button" onClick={() => setShow(true)}>
							Button
						</button>
						{show() && <input type="radio" />}
					</div>
					<input type="checkbox" />
				</>
			);
		};

		const {
			getByRole,
			getAllByRole,
			getByTestId,
			queryByRole,
			queryAllByRole,
		} = render(() => <Test />);

		const button = getByRole("button");
		const test = getByTestId("test");
		const revert = ariaHideOutside([test]);
		await flush();

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(queryByRole("radio")).toBeNull();
		expect(queryByRole("button")).not.toBeNull();
		expect(() => getByTestId("test")).not.toThrow();

		// Toggle the show state
		fireEvent.click(button);
		await Promise.resolve();

		// Wait for mutation observer tick
		await Promise.resolve();
		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getByRole("radio")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();
		expect(() => getByTestId("test")).not.toThrow();

		revert();
		await flush();

		expect(() => getAllByRole("checkbox")).not.toThrow();
		expect(() => getByRole("radio")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();
		expect(() => getByTestId("test")).not.toThrow();
	});

	it("work when called multiple times", async () => {
		const { getByRole, getAllByRole, getByTestId } = render(() => (
			<>
				<input type="checkbox" />
				<input type="radio" />
				<button type="button">Button</button>
				<input type="radio" />
				<input type="checkbox" />
			</>
		));

		const radios = getAllByRole("radio");
		const button = getByRole("button");

		const revert1 = ariaHideOutside([button, ...radios]);
		await flush();

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getAllByRole("radio")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();

		const revert2 = ariaHideOutside([button]);
		await flush();

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getAllByRole("radio")).toThrow();
		expect(() => getByRole("button")).not.toThrow();

		revert2();
		await flush();

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getAllByRole("radio")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();

		revert1();
		await flush();

		expect(() => getAllByRole("checkbox")).not.toThrow();
		expect(() => getAllByRole("radio")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();
	});

	it("work when called multiple times and restored out of order", async () => {
		const { getByRole, getAllByRole } = render(() => (
			<>
				<input type="checkbox" />
				<input type="radio" />
				<button type="button">Button</button>
				<input type="radio" />
				<input type="checkbox" />
			</>
		));

		const radios = getAllByRole("radio");
		const button = getByRole("button");

		const revert1 = ariaHideOutside([button, ...radios]);
		await flush();

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getAllByRole("radio")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();

		const revert2 = ariaHideOutside([button]);
		await flush();

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getAllByRole("radio")).toThrow();
		expect(() => getByRole("button")).not.toThrow();

		revert1();
		await flush();

		expect(() => getAllByRole("checkbox")).toThrow();
		expect(() => getAllByRole("radio")).toThrow();
		expect(() => getByRole("button")).not.toThrow();

		revert2();
		await flush();

		expect(() => getAllByRole("checkbox")).not.toThrow();
		expect(() => getAllByRole("radio")).not.toThrow();
		expect(() => getByRole("button")).not.toThrow();
	});

	it("should hide everything except the provided element [row]", async () => {
		const { getAllByRole } = render(() => (
			<div role="grid">
				<div role="row">
					<div role="gridcell">Cell 1</div>
				</div>
				<div role="row">
					<div role="gridcell">Cell 2</div>
				</div>
			</div>
		));

		const cells = getAllByRole("gridcell");
		const rows = getAllByRole("row");

		const revert = ariaHideOutside([rows[1]]);
		await flush();

		// Applies aria-hidden to the row and cell despite recursive nature of aria-hidden
		// for https://bugs.webkit.org/show_bug.cgi?id=222623
		expect(rows[0]).toHaveAttribute("aria-hidden", "true");
		expect(cells[0]).toHaveAttribute("aria-hidden", "true");
		expect(rows[1]).not.toHaveAttribute("aria-hidden", "true");
		expect(cells[1]).not.toHaveAttribute("aria-hidden", "true");

		revert();
		await flush();

		expect(rows[0]).not.toHaveAttribute("aria-hidden", "true");
		expect(cells[0]).not.toHaveAttribute("aria-hidden", "true");
		expect(rows[1]).not.toHaveAttribute("aria-hidden", "true");
		expect(cells[1]).not.toHaveAttribute("aria-hidden", "true");
	});
});
