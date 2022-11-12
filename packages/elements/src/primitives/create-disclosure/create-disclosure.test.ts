import { createRoot } from "solid-js";

import { createDisclosure } from "./create-disclosure";

describe("createDisclosure", () => {
  it("can be default 'open' (uncontrolled)", () => {
    createRoot(dispose => {
      const state = createDisclosure({
        defaultOpen: true,
      });

      expect(state.open()).toBeTruthy();

      dispose();
    });
  });

  it("can be controlled", () => {
    createRoot(dispose => {
      const onChangeSpy = jest.fn();

      const state = createDisclosure({
        open: true,
        onOpenChange: onChangeSpy,
      });

      expect(state.open()).toBeTruthy();

      state.onToggle();

      expect(state.open()).toBeTruthy();
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);

      dispose();
    });
  });

  it("should set 'open' state to true when calling 'onOpen'", () => {
    createRoot(dispose => {
      const state = createDisclosure({ defaultOpen: false });

      expect(state.open()).toBeFalsy();

      state.onOpen();

      expect(state.open()).toBeTruthy();

      dispose();
    });
  });

  it("should set 'open' state to false when calling 'onClose'", () => {
    createRoot(dispose => {
      const state = createDisclosure({ defaultOpen: true });

      expect(state.open()).toBeTruthy();

      state.onClose();

      expect(state.open()).toBeFalsy();

      dispose();
    });
  });

  it("should toggle 'open' state when calling 'onToggle'", () => {
    createRoot(dispose => {
      const state = createDisclosure({ defaultOpen: false });

      expect(state.open()).toBeFalsy();

      state.onToggle();

      expect(state.open()).toBeTruthy();

      state.onToggle();

      expect(state.open()).toBeFalsy();

      dispose();
    });
  });
});
