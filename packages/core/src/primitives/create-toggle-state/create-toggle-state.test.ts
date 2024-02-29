import { createRoot } from "solid-js";
import { vi } from "vitest";

import { createToggleState } from "./create-toggle-state";

describe("createToggleState", () => {
	it("can be default selected (uncontrolled)", () => {
		createRoot((dispose) => {
			const state = createToggleState({
				defaultIsSelected: true,
			});

			expect(state.isSelected()).toBeTruthy();

			dispose();
		});
	});

	it("can be controlled", () => {
		createRoot((dispose) => {
			const onChangeSpy = vi.fn();

			const state = createToggleState({
				isSelected: true,
				onSelectedChange: onChangeSpy,
			});

			expect(state.isSelected()).toBeTruthy();

			state.toggle();

			expect(state.isSelected()).toBeTruthy();
			expect(onChangeSpy).toHaveBeenCalledTimes(1);
			expect(onChangeSpy).toHaveBeenCalledWith(false);

			dispose();
		});
	});

	it("should setSelected with the given value", () => {
		createRoot((dispose) => {
			const state = createToggleState({ defaultIsSelected: false });

			expect(state.isSelected()).toBeFalsy();

			state.setIsSelected(true);

			expect(state.isSelected()).toBeTruthy();

			state.setIsSelected(false);

			expect(state.isSelected()).toBeFalsy();

			dispose();
		});
	});

	it("should not setSelected with the given value when is read only", () => {
		createRoot((dispose) => {
			const state = createToggleState({
				defaultIsSelected: false,
				isReadOnly: true,
			});

			expect(state.isSelected()).toBeFalsy();

			state.setIsSelected(true);

			expect(state.isSelected()).toBeFalsy();

			dispose();
		});
	});

	it("should toggle selected state", () => {
		createRoot((dispose) => {
			const state = createToggleState({ defaultIsSelected: false });

			expect(state.isSelected()).toBeFalsy();

			state.toggle();

			expect(state.isSelected()).toBeTruthy();

			state.toggle();

			expect(state.isSelected()).toBeFalsy();

			dispose();
		});
	});

	it("should not toggle selected state when is read only", () => {
		createRoot((dispose) => {
			const state = createToggleState({
				defaultIsSelected: false,
				isReadOnly: true,
			});

			expect(state.isSelected()).toBeFalsy();

			state.toggle();

			expect(state.isSelected()).toBeFalsy();

			dispose();
		});
	});
});
