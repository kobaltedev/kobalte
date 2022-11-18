/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/2bcc2f0b45ea8b20621458a93f1804a3f9df9ac4/packages/@react-aria/interactions/test/useFocusVisible.test.js
 */

import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { createRoot } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createFocusVisible, createFocusVisibleListener } from "./create-focus-visible";

function Example(props: any) {
  const { isFocusVisible } = createFocusVisible(props);

  return <div id={props.id}>example{isFocusVisible() && "-focusVisible"}</div>;
}

function toggleBrowserTabs() {
  // this describes Chrome behaviour only, for other browsers visibilitychange fires after all focus events.
  // leave tab
  const lastActiveElement = document.activeElement;
  fireEvent(lastActiveElement!, new Event("blur"));
  fireEvent(window, new Event("blur"));

  Object.defineProperty(document, "visibilityState", {
    value: "hidden",
    writable: true,
  });

  Object.defineProperty(document, "hidden", { value: true, writable: true });
  fireEvent(document, new Event("visibilitychange"));

  // return to tab
  Object.defineProperty(document, "visibilityState", {
    value: "visible",
    writable: true,
  });

  Object.defineProperty(document, "hidden", { value: false, writable: true });
  fireEvent(document, new Event("visibilitychange"));
  //eslint-disable-next-line
  //@ts-ignore
  fireEvent(window, new Event("focus", { target: window }));
  fireEvent(lastActiveElement!, new Event("focus"));
}

function toggleBrowserWindow() {
  //eslint-disable-next-line
  //@ts-ignore
  fireEvent(window, new Event("blur", { target: window }));

  //eslint-disable-next-line
  //@ts-ignore
  fireEvent(window, new Event("focus", { target: window }));
}

describe("createFocusVisible", () => {
  installPointerEvent();

  beforeEach(() => {
    fireEvent.focus(document.body);
  });

  it("returns positive isFocusVisible result after toggling browser tabs after keyboard navigation", async () => {
    render(() => <Example />);

    const el = screen.getByText("example-focusVisible");

    fireEvent.keyDown(el, { key: "Tab" });
    toggleBrowserTabs();

    expect(el.textContent).toBe("example-focusVisible");
  });

  it("returns negative isFocusVisible result after toggling browser tabs without prior keyboard navigation", async () => {
    render(() => <Example />);

    const el = screen.getByText("example-focusVisible");

    fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
    toggleBrowserTabs();

    expect(el.textContent).toBe("example");
  });

  it("returns positive isFocusVisible result after toggling browser window after keyboard navigation", async () => {
    render(() => <Example />);

    const el = screen.getByText("example-focusVisible");

    fireEvent.keyDown(el, { key: "Tab" });
    toggleBrowserWindow();

    expect(el.textContent).toBe("example-focusVisible");
  });

  it("returns negative isFocusVisible result after toggling browser window without prior keyboard navigation", async () => {
    render(() => <Example />);

    const el = screen.getByText("example-focusVisible");

    fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
    toggleBrowserWindow();

    expect(el.textContent).toBe("example");
  });
});

describe("createFocusVisibleListener", function () {
  installPointerEvent();

  it("emits on modality change (non-text input)", async () => {
    await createRoot(async dispose => {
      const fnMock = jest.fn();

      createFocusVisibleListener(fnMock, [], () => false);
      await Promise.resolve();

      expect(fnMock).toHaveBeenCalledTimes(0);

      fireEvent.keyDown(document.body, { key: "a" });
      await Promise.resolve();

      fireEvent.keyUp(document.body, { key: "a" });
      await Promise.resolve();

      fireEvent.keyDown(document.body, { key: "Escape" });
      await Promise.resolve();

      fireEvent.keyUp(document.body, { key: "Escape" });
      await Promise.resolve();

      fireEvent(
        document.body,
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      // does not trigger change handlers (but included for completeness)
      fireEvent(
        document.body,
        createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      expect(fnMock).toHaveBeenCalledTimes(5);
      expect(fnMock.mock.calls).toEqual([[true], [true], [true], [true], [false]]);

      dispose();
    });
  });

  it("emits on modality change (text input)", async () => {
    await createRoot(async dispose => {
      const fnMock = jest.fn();

      createFocusVisibleListener(fnMock, [], () => true);
      await Promise.resolve();

      expect(fnMock).toHaveBeenCalledTimes(0);

      fireEvent.keyDown(document.body, { key: "a" });
      await Promise.resolve();

      fireEvent.keyUp(document.body, { key: "a" });
      await Promise.resolve();

      fireEvent.keyDown(document.body, { key: "Escape" });
      await Promise.resolve();

      fireEvent.keyUp(document.body, { key: "Escape" });
      await Promise.resolve();

      fireEvent(
        document.body,
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      // does not trigger change handlers (but included for completeness)
      fireEvent(
        document.body,
        createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      expect(fnMock).toHaveBeenCalledTimes(3);
      expect(fnMock.mock.calls).toEqual([[true], [true], [false]]);

      dispose();
    });
  });
});
