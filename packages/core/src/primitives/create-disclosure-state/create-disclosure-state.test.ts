import { createRoot } from "solid-js";
import { vi } from "vitest";

import { createDisclosureState } from "./create-disclosure-state";

describe("createDisclosureState", () => {
	it("can be default 'open' (uncontrolled)", () => {
		createRoot((dispose) => {
			const state = createDisclosureState({
				defaultOpen: true,
			});

			expect(state.isOpen()).toBeTruthy();

			dispose();
		});
	});

	it("can be controlled", () => {
		createRoot((dispose) => {
			const onChangeSpy = vi.fn();

			const state = createDisclosureState({
				open: true,
				onOpenChange: onChangeSpy,
			});

			expect(state.isOpen()).toBeTruthy();

			state.toggle();

			expect(state.isOpen()).toBeTruthy();
			expect(onChangeSpy).toHaveBeenCalledTimes(1);
			expect(onChangeSpy).toHaveBeenCalledWith(false);

			dispose();
		});
	});

	it("should set 'isOpen' state with the value from 'setIsOpen'", () =>
		createRoot(async (dispose) => {
			const state = createDisclosureState({ defaultOpen: false });

			expect(state.isOpen()).toBeFalsy();

			state.setIsOpen(true);
			await Promise.resolve();

			expect(state.isOpen()).toBeTruthy();

			state.setIsOpen(false);
			await Promise.resolve();

			expect(state.isOpen()).toBeFalsy();

			dispose();
		}));

	it("should set 'isOpen' state to true when calling 'open'", () =>
		createRoot(async (dispose) => {
			const state = createDisclosureState({ defaultOpen: false });

			expect(state.isOpen()).toBeFalsy();

			state.open();
			await Promise.resolve();

			expect(state.isOpen()).toBeTruthy();

			dispose();
		}));

	it("should set 'isOpen' state to false when calling 'close'", () =>
		createRoot(async (dispose) => {
			const state = createDisclosureState({ defaultOpen: true });

			expect(state.isOpen()).toBeTruthy();

			state.close();
			await Promise.resolve();

			expect(state.isOpen()).toBeFalsy();

			dispose();
		}));

	it("should toggle 'isOpen' state when calling 'toggle'", () =>
		createRoot(async (dispose) => {
			const state = createDisclosureState({ defaultOpen: false });

			expect(state.isOpen()).toBeFalsy();

			state.toggle();
			await Promise.resolve();

			expect(state.isOpen()).toBeTruthy();

			state.toggle();
			await Promise.resolve();

			expect(state.isOpen()).toBeFalsy();

			dispose();
		}));
});
