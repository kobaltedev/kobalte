/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/test/useDismissableLayer.test.js
 */

import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { ComponentProps, splitProps } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createDismissableLayer, CreateDismissableLayerProps } from "./create-dismissable-layer";

export function DismissableLayer(props: ComponentProps<"div"> & CreateDismissableLayerProps) {
  let ref: HTMLDivElement | undefined;

  const [local, others] = splitProps(props, [
    "isOpen",
    "onClose",
    "isModal",
    "closeOnEsc",
    "closeOnInteractOutside",
    "shouldCloseOnInteractOutside",
  ]);

  createDismissableLayer(local, () => ref);

  return <div ref={ref} {...others} />;
}

describe("createDismissableLayer", () => {
  installPointerEvent();

  it("should hide the overlay when clicking outside if 'closeOnInteractOutside' is true", async () => {
    const onClose = jest.fn();

    render(() => <DismissableLayer isOpen onClose={onClose} closeOnInteractOutside />);

    fireEvent(document.body, createPointerEvent("pointerdown", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(document.body, createPointerEvent("pointerup", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not hide the overlay when clicking outside if 'closeOnInteractOutside' is false", async () => {
    const onClose = jest.fn();

    render(() => <DismissableLayer isOpen onClose={onClose} closeOnInteractOutside={false} />);

    fireEvent(document.body, createPointerEvent("pointerdown", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(document.body, createPointerEvent("pointerup", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("should hide the overlay when clicking outside if 'shouldCloseOnInteractOutside' returns true", async () => {
    const onClose = jest.fn();

    render(() => (
      <DismissableLayer
        isOpen
        onClose={onClose}
        closeOnInteractOutside
        shouldCloseOnInteractOutside={target => target === document.body}
      />
    ));

    fireEvent(document.body, createPointerEvent("pointerdown", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(document.body, createPointerEvent("pointerup", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not hide the overlay when clicking outside if 'shouldCloseOnInteractOutside' returns false", async () => {
    const onClose = jest.fn();

    render(() => (
      <DismissableLayer
        isOpen
        onClose={onClose}
        closeOnInteractOutside
        shouldCloseOnInteractOutside={target => target !== document.body}
      />
    ));

    fireEvent(document.body, createPointerEvent("pointerdown", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(document.body, createPointerEvent("pointerup", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("should only hide the top-most overlay", async () => {
    const onCloseFirst = jest.fn();
    const onCloseSecond = jest.fn();

    render(() => <DismissableLayer isOpen onClose={onCloseFirst} closeOnInteractOutside />);
    const second = render(() => (
      <DismissableLayer isOpen onClose={onCloseSecond} closeOnInteractOutside />
    ));

    fireEvent(document.body, createPointerEvent("pointerdown", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(document.body, createPointerEvent("pointerup", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(onCloseSecond).toHaveBeenCalledTimes(1);
    expect(onCloseFirst).not.toHaveBeenCalled();

    second.unmount();

    fireEvent(document.body, createPointerEvent("pointerdown", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(document.body, createPointerEvent("pointerup", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(onCloseFirst).toHaveBeenCalledTimes(1);
  });

  it("should hide the overlay when pressing the escape key when 'closeOnEsc' is true", async () => {
    const onClose = jest.fn();

    render(() => <DismissableLayer data-testid="test" isOpen onClose={onClose} closeOnEsc />);

    const el = screen.getByTestId("test");

    fireEvent.keyDown(el, { key: "Escape" });
    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should still hide the overlay when pressing the escape key when 'closeOnEsc' is true and 'closeOnInteractOutside' is false", async () => {
    const onClose = jest.fn();

    render(() => (
      <DismissableLayer
        data-testid="test"
        isOpen
        onClose={onClose}
        closeOnInteractOutside={false}
        closeOnEsc
      />
    ));

    const el = screen.getByTestId("test");

    fireEvent.keyDown(el, { key: "Escape" });
    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
