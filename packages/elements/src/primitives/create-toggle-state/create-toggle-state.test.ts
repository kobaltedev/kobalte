import { createRoot } from "solid-js";

import { createToggleState } from "./create-toggle-state";

describe("createToggleState", () => {
  it("can be default selected (uncontrolled)", () => {
    createRoot(dispose => {
      const state = createToggleState({
        defaultSelected: true,
      });

      expect(state.selected()).toBeTruthy();

      dispose();
    });
  });

  it("can be controlled", () => {
    createRoot(dispose => {
      const onChangeSpy = jest.fn();

      const state = createToggleState({
        selected: true,
        onSelectedChange: onChangeSpy,
      });

      expect(state.selected()).toBeTruthy();

      state.toggle();

      expect(state.selected()).toBeTruthy();
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);

      dispose();
    });
  });

  it("should setSelected with the given value", () => {
    createRoot(dispose => {
      const state = createToggleState({ defaultSelected: false });

      expect(state.selected()).toBeFalsy();

      state.setSelected(true);

      expect(state.selected()).toBeTruthy();

      state.setSelected(false);

      expect(state.selected()).toBeFalsy();

      dispose();
    });
  });

  it("should not setSelected with the given value when is read only", () => {
    createRoot(dispose => {
      const state = createToggleState({
        defaultSelected: false,
        readOnly: true,
      });

      expect(state.selected()).toBeFalsy();

      state.setSelected(true);

      expect(state.selected()).toBeFalsy();

      dispose();
    });
  });

  it("should toggle selected state", () => {
    createRoot(dispose => {
      const state = createToggleState({ defaultSelected: false });

      expect(state.selected()).toBeFalsy();

      state.toggle();

      expect(state.selected()).toBeTruthy();

      state.toggle();

      expect(state.selected()).toBeFalsy();

      dispose();
    });
  });

  it("should not toggle selected state when is read only", () => {
    createRoot(dispose => {
      const state = createToggleState({
        defaultSelected: false,
        readOnly: true,
      });

      expect(state.selected()).toBeFalsy();

      state.toggle();

      expect(state.selected()).toBeFalsy();

      dispose();
    });
  });
});
