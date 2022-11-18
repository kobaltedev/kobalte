/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/interactions/test/useInteractOutside.test.js
 */

import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen } from "solid-testing-library";

import { createInteractOutside } from "./create-interact-outside";

function Example(props: any) {
  let ref: any;

  createInteractOutside(props, () => ref);

  return <div ref={ref}>test</div>;
}

function pointerEvent(type: any, opts?: any) {
  const evt = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(evt, opts);
  return evt;
}

describe("createInteractOutside", () => {
  // TODO: JSDOM doesn't yet support pointer events. Once they do, convert these tests.
  // https://github.com/jsdom/jsdom/issues/2527
  installPointerEvent();

  it("should fire interact outside events based on pointer events", async () => {
    const onInteractOutside = jest.fn();
    render(() => <Example onInteractOutside={onInteractOutside} />);

    const el = screen.getByText("test");

    fireEvent(el, pointerEvent("pointerdown"));
    await Promise.resolve();

    fireEvent(el, pointerEvent("pointerup"));
    await Promise.resolve();

    expect(onInteractOutside).not.toHaveBeenCalled();

    fireEvent(document.body, pointerEvent("pointerdown"));
    await Promise.resolve();

    fireEvent(document.body, pointerEvent("pointerup"));
    await Promise.resolve();

    expect(onInteractOutside).toHaveBeenCalledTimes(1);
  });

  it("should only listen for the left mouse button", async () => {
    const onInteractOutside = jest.fn();
    render(() => <Example onInteractOutside={onInteractOutside} />);

    fireEvent(document.body, pointerEvent("pointerdown", { button: 1 }));
    await Promise.resolve();

    fireEvent(document.body, pointerEvent("pointerup", { button: 1 }));
    await Promise.resolve();

    expect(onInteractOutside).not.toHaveBeenCalled();

    fireEvent(document.body, pointerEvent("pointerdown", { button: 0 }));
    await Promise.resolve();

    fireEvent(document.body, pointerEvent("pointerup", { button: 0 }));
    await Promise.resolve();

    expect(onInteractOutside).toHaveBeenCalledTimes(1);
  });

  it("should not fire interact outside if there is a pointer up event without a pointer down first", async () => {
    // Fire pointer down before component with useInteractOutside is mounted
    fireEvent(document.body, pointerEvent("pointerdown"));
    await Promise.resolve();

    const onInteractOutside = jest.fn();
    render(() => <Example onInteractOutside={onInteractOutside} />);

    fireEvent(document.body, pointerEvent("pointerup"));
    await Promise.resolve();

    expect(onInteractOutside).not.toHaveBeenCalled();
  });

  it("does not handle pointer events if disabled", async () => {
    const onInteractOutside = jest.fn();
    render(() => <Example isDisabled onInteractOutside={onInteractOutside} />);

    fireEvent(document.body, pointerEvent("mousedown"));
    await Promise.resolve();

    fireEvent(document.body, pointerEvent("mouseup"));
    await Promise.resolve();

    expect(onInteractOutside).not.toHaveBeenCalled();
  });
});
