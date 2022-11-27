import { createRoot } from "solid-js";

import { createDisclosure } from "./create-disclosure";

describe("createDisclosure", () => {
  it("can be default 'open' (uncontrolled)", () => {
    createRoot(dispose => {
      const state = createDisclosure({
        defaultIsOpen: true,
      });

      expect(state.isOpen()).toBeTruthy();

      dispose();
    });
  });

  it("can be controlled", () => {
    createRoot(dispose => {
      const onChangeSpy = jest.fn();

      const state = createDisclosure({
        isOpen: true,
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

  it("should set 'isOpen' state to true when calling 'onOpen'", () => {
    createRoot(dispose => {
      const state = createDisclosure({ defaultIsOpen: false });

      expect(state.isOpen()).toBeFalsy();

      state.open();

      expect(state.isOpen()).toBeTruthy();

      dispose();
    });
  });

  it("should set 'isOpen' state to false when calling 'onClose'", () => {
    createRoot(dispose => {
      const state = createDisclosure({ defaultIsOpen: true });

      expect(state.isOpen()).toBeTruthy();

      state.close();

      expect(state.isOpen()).toBeFalsy();

      dispose();
    });
  });

  it("should toggle 'isOpen' state when calling 'onToggle'", () => {
    createRoot(dispose => {
      const state = createDisclosure({ defaultIsOpen: false });

      expect(state.isOpen()).toBeFalsy();

      state.toggle();

      expect(state.isOpen()).toBeTruthy();

      state.toggle();

      expect(state.isOpen()).toBeFalsy();

      dispose();
    });
  });
});
