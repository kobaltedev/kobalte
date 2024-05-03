/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/spinbutton/test/useSpinButton.test.js
 */
import { fireEvent, render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as SpinButton from ".";

describe("SpinButton", () => {
	it('should have role="spinbutton" and aria props', () => {
		const { getByTestId } = render(() => (
			<SpinButton.Root
				data-testid="test"
				value={2}
				textValue="2 items"
				minValue={1}
				maxValue={3}
			/>
		));
		const el = getByTestId("test");
		expect(el).toHaveAttribute("role", "spinbutton");
		expect(el).toHaveAttribute("aria-valuenow", "2");
		expect(el).toHaveAttribute("aria-valuemin", "1");
		expect(el).toHaveAttribute("aria-valuemax", "3");
		expect(el).toHaveAttribute("aria-valuetext", "2 items");
		expect(el).not.toHaveAttribute("aria-disabled");
		expect(el).not.toHaveAttribute("aria-readonly");
	});

	it("should have aria-disabled if isDisabled is set", () => {
		const { getByTestId } = render(() => (
			<SpinButton.Root
				data-testid="test"
				value={2}
				textValue="2 items"
				minValue={1}
				maxValue={3}
				disabled
			/>
		));
		const el = getByTestId("test");
		expect(el).toHaveAttribute("aria-disabled", "true");
	});

	it("should have aria-readonly if isReadOnly is set", () => {
		const { getByTestId } = render(() => (
			<SpinButton.Root
				data-testid="test"
				value={2}
				textValue="2 items"
				minValue={1}
				maxValue={3}
				readOnly
			/>
		));
		const el = getByTestId("test");
		expect(el).toHaveAttribute("aria-readonly", "true");
	});

	it("should trigger onIncrement on arrow up", () => {
		const onIncrement = vi.fn();
		const { getByTestId } = render(() => (
			<SpinButton.Root data-testid="test" value={2} onIncrement={onIncrement} />
		));
		const el = getByTestId("test");

		fireEvent.keyDown(el, { key: "ArrowUp" });
		expect(onIncrement).toHaveBeenCalledTimes(1);
	});

	it("should trigger onDecrement on arrow down", () => {
		const onDecrement = vi.fn();
		const { getByTestId } = render(() => (
			<SpinButton.Root data-testid="test" value={2} onDecrement={onDecrement} />
		));
		const el = getByTestId("test");

		fireEvent.keyDown(el, { key: "ArrowDown" });
		expect(onDecrement).toHaveBeenCalledTimes(1);
	});

	it("should trigger onIncrementPage on page up", () => {
		const onIncrementPage = vi.fn();
		const { getByTestId } = render(() => (
			<SpinButton.Root
				data-testid="test"
				value={2}
				onIncrementPage={onIncrementPage}
			/>
		));
		const el = getByTestId("test");

		fireEvent.keyDown(el, { key: "PageUp" });
		expect(onIncrementPage).toHaveBeenCalledTimes(1);
	});

	it("should fall back to onIncrement on page up if onIncrementPage is not available", () => {
		const onIncrement = vi.fn();
		const { getByTestId } = render(() => (
			<SpinButton.Root data-testid="test" value={2} onIncrement={onIncrement} />
		));
		const el = getByTestId("test");

		fireEvent.keyDown(el, { key: "PageUp" });
		expect(onIncrement).toHaveBeenCalledTimes(1);
	});

	it("should trigger onDecrementPage on page up", () => {
		const onDecrementPage = vi.fn();
		const { getByTestId } = render(() => (
			<SpinButton.Root
				data-testid="test"
				value={2}
				onDecrementPage={onDecrementPage}
			/>
		));
		const el = getByTestId("test");

		fireEvent.keyDown(el, { key: "PageDown" });
		expect(onDecrementPage).toHaveBeenCalledTimes(1);
	});

	it("should fall back to onDecrement on page up if onDecrementPage is not available", () => {
		const onDecrement = vi.fn();
		const { getByTestId } = render(() => (
			<SpinButton.Root data-testid="test" value={2} onDecrement={onDecrement} />
		));
		const el = getByTestId("test");

		fireEvent.keyDown(el, { key: "PageDown" });
		expect(onDecrement).toHaveBeenCalledTimes(1);
	});

	it("should trigger onDecrementToMin on home key", () => {
		const onDecrementToMin = vi.fn();
		const { getByTestId } = render(() => (
			<SpinButton.Root
				data-testid="test"
				value={2}
				onDecrementToMin={onDecrementToMin}
				minValue={1}
			/>
		));
		const el = getByTestId("test");

		fireEvent.keyDown(el, { key: "Home" });
		expect(onDecrementToMin).toHaveBeenCalledTimes(1);
	});

	it("should trigger onIncrementToMax on end key", () => {
		const onIncrementToMax = vi.fn();
		const { getByTestId } = render(() => (
			<SpinButton.Root
				data-testid="test"
				value={2}
				onIncrementToMax={onIncrementToMax}
				maxValue={1}
			/>
		));
		const el = getByTestId("test");

		fireEvent.keyDown(el, { key: "End" });
		expect(onIncrementToMax).toHaveBeenCalledTimes(1);
	});

	it("should substitute a minus sign for hyphen in the textValue for negative values", () => {
		const { getByTestId } = render(() => (
			<SpinButton.Root data-testid="test" value={-2} textValue="-2 items" />
		));
		const el = getByTestId("test");

		expect(el).toHaveAttribute("aria-valuenow", "-2");
		expect(el).toHaveAttribute("aria-valuetext", "\u22122 items");
	});

	it("should work with string values", () => {
		const { getByTestId } = render(() => (
			<SpinButton.Root data-testid="test" value={"1,402"} />
		));
		const el = getByTestId("test");

		expect(el).toHaveAttribute("aria-valuenow", "1,402");
	});
});
