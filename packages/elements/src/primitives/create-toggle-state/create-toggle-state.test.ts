import { createRoot } from "solid-js";

import { createToggleState } from "./create-toggle-state";

describe("createToggleState", () => {
  it("can be default checked (uncontrolled)", () => {
    createRoot(dispose => {
      const state = createToggleState({
        defaultChecked: true,
      });

      expect(state.checked()).toBeTruthy();

      dispose();
    });
  });

  it("can be controlled", () => {
    createRoot(dispose => {
      const onChangeSpy = jest.fn();

      const state = createToggleState({
        checked: true,
        onCheckedChange: onChangeSpy,
      });

      expect(state.checked()).toBeTruthy();

      state.toggleChecked();

      expect(state.checked()).toBeTruthy();
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);

      dispose();
    });
  });

  it("should setChecked with the given value", () => {
    createRoot(dispose => {
      const state = createToggleState({ defaultChecked: false });

      expect(state.checked()).toBeFalsy();

      state.setChecked(true);

      expect(state.checked()).toBeTruthy();

      state.setChecked(false);

      expect(state.checked()).toBeFalsy();

      dispose();
    });
  });

  it("should not setChecked with the given value when is read only", () => {
    createRoot(dispose => {
      const state = createToggleState({
        defaultChecked: false,
        readOnly: true,
      });

      expect(state.checked()).toBeFalsy();

      state.setChecked(true);

      expect(state.checked()).toBeFalsy();

      dispose();
    });
  });

  it("should toggle checked state", () => {
    createRoot(dispose => {
      const state = createToggleState({ defaultChecked: false });

      expect(state.checked()).toBeFalsy();

      state.toggleChecked();

      expect(state.checked()).toBeTruthy();

      state.toggleChecked();

      expect(state.checked()).toBeFalsy();

      dispose();
    });
  });

  it("should not toggle checked state when is read only", () => {
    createRoot(dispose => {
      const state = createToggleState({
        defaultChecked: false,
        readOnly: true,
      });

      expect(state.checked()).toBeFalsy();

      state.toggleChecked();

      expect(state.checked()).toBeFalsy();

      dispose();
    });
  });
});
