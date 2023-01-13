/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/interactions/test/usePress.test.js
 */

import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { composeEventHandlers } from "@kobalte/utils";
import { createSignal, JSX, mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { fireEvent, render, screen } from "solid-testing-library";

import { CREATE_PRESS_PROP_NAMES, createPress, PRESS_HANDLERS_PROP_NAMES } from "./create-press";
import { CreatePressProps } from "./types";

function Example(
  props: CreatePressProps &
    JSX.HTMLAttributes<any> & {
      elementType?: any;
      draggable?: boolean;
      href?: string;
      type?: string;
    }
) {
  const [local, createPressProps, others] = splitProps(
    props,
    ["elementType", ...PRESS_HANDLERS_PROP_NAMES],
    CREATE_PRESS_PROP_NAMES
  );

  const { pressHandlers } = createPress(createPressProps);

  return (
    <Dynamic
      component={local.elementType || "div"}
      tabIndex="0"
      onKeyDown={composeEventHandlers([local.onKeyDown, pressHandlers.onKeyDown])}
      onKeyUp={composeEventHandlers([local.onKeyUp, pressHandlers.onKeyUp])}
      onClick={composeEventHandlers([local.onClick, pressHandlers.onClick])}
      onPointerDown={composeEventHandlers([local.onPointerDown, pressHandlers.onPointerDown])}
      onPointerUp={composeEventHandlers([local.onPointerUp, pressHandlers.onPointerUp])}
      onMouseDown={composeEventHandlers([local.onMouseDown, pressHandlers.onMouseDown])}
      onDragStart={composeEventHandlers([local.onDragStart, pressHandlers.onDragStart])}
      {...others}
    >
      {local.elementType !== "input" ? "test" : undefined}
    </Dynamic>
  );
}

describe("createPress", () => {
  beforeAll(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => jest.runAllTimers());

  describe("pointer events", () => {
    // JSDOM doesn't yet support pointer events. Once they do, convert these tests.
    // https://github.com/jsdom/jsdom/issues/2527
    installPointerEvent();

    it("should fire press events based on pointer events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      // How else to get the DOM node it renders the hook to?
      // let el = events[0].target;
      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });

    it("should fire press change events when moving pointer outside target", async () => {
      let events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 100,
          clientY: 100,
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 100,
          clientY: 100,
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
      ]);

      events = [];

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 100,
          clientY: 100,
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });

    it("should handle pointer cancel events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(el, createPointerEvent("pointercancel", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
      ]);
    });

    it("should cancel press on dragstart", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        new MouseEvent("dragstart", { bubbles: true, cancelable: true, composed: true })
      );
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
      ]);
    });

    it("should cancel press when moving outside and the shouldCancelOnPointerExit option is set", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          cancelOnPointerExit
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 100,
          clientY: 100,
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
      ]);
    });

    it("should handle modifier keys", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(
        el,
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse", shiftKey: true })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          ctrlKey: true,
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      // How else to get the DOM node it renders the hook to?
      // let el = events[0].target;
      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: true,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "mouse",
          ctrlKey: true,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: true,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "mouse",
          ctrlKey: true,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });

    it("should only handle left clicks", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(
        el,
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse", button: 1 })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          button: 1,
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      expect(events).toEqual([]);
    });

    it("should not focus the target on click if preventFocusOnPress is true", async () => {
      render(() => <Example preventFocusOnPress />);

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      expect(document.activeElement).not.toBe(el);
    });

    it("should focus the target on click by default", async () => {
      render(() => <Example />);

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      expect(document.activeElement).toBe(el);
    });

    it("should prevent default on pointerdown and mousedown by default", async () => {
      render(() => <Example />);

      const el = screen.getByText("test");

      let allowDefault = fireEvent(
        el,
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      expect(allowDefault).toBe(false);

      allowDefault = fireEvent.mouseDown(el);
      await Promise.resolve();

      expect(allowDefault).toBe(false);
    });

    it("should still prevent default when pressing on a non draggable + pressable item in a draggable container", async () => {
      render(() => (
        <div draggable>
          <Example />
        </div>
      ));

      const el = screen.getByText("test");

      let allowDefault = fireEvent(
        el,
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      expect(allowDefault).toBe(false);

      allowDefault = fireEvent.mouseDown(el);
      await Promise.resolve();

      expect(allowDefault).toBe(false);
    });

    it("should not prevent default when pressing on a draggable item", async () => {
      render(() => <Example draggable />);

      const el = screen.getByText("test");
      let allowDefault = fireEvent(
        el,
        createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" })
      );
      await Promise.resolve();

      expect(allowDefault).toBe(true);

      allowDefault = fireEvent.mouseDown(el);
      await Promise.resolve();

      expect(allowDefault).toBe(true);
    });

    it("should ignore virtual pointer events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(
        el,
        createPointerEvent("pointerdown", {
          pointerId: 1,
          pointerType: "mouse",
          width: 0,
          height: 0,
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          width: 0,
          height: 0,
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      expect(events).toEqual([]);

      fireEvent.click(el);
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });

    it("should detect Android TalkBack double tap", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      // Android TalkBack will occasionally fire a pointer down event with "width: 1, height: 1" instead of "width: 0, height: 0".
      // Make sure we can still determine that this is a virtual event by checking the pressure, detail, and height/width.
      fireEvent(
        el,
        createPointerEvent("pointerdown", {
          pointerId: 1,
          width: 1,
          height: 1,
          pressure: 0,
          detail: 0,
          pointerType: "mouse",
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          width: 1,
          height: 1,
          pressure: 0,
          detail: 0,
          pointerType: "mouse",
        })
      );
      await Promise.resolve();

      expect(events).toEqual([]);

      // Virtual pointer event sets pointerType and onClick handles the rest
      fireEvent.click(el, { pointerType: "mouse", width: 1, height: 1, detail: 1 });
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });

    it("should not fire press events for disabled elements", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          isDisabled
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
        })
      );
      await Promise.resolve();

      expect(events).toEqual([]);
    });

    it("should fire press event when pointerup close to the target", async () => {
      const spy = jest.fn();
      render(() => <Example onPress={spy} />);

      const el = screen.getByText("test");
      fireEvent(
        el,
        createPointerEvent("pointerdown", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0,
          width: 20,
          height: 20,
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 10,
          clientY: 10,
          width: 20,
          height: 20,
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 10,
          clientY: 10,
          width: 20,
          height: 20,
        })
      );
      await Promise.resolve();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("keyboard events", () => {
    it("should fire press events when the element is not a link", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);
      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");
      fireEvent.keyDown(el, { key: " " });
      fireEvent.keyUp(el, { key: " " });

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });

    it("should fire press events when the element is a link", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          elementType="a"
          href="#"
          onClick={(e: any) => {
            e.preventDefault();
            addEvent({ type: "click" });
          }}
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent.keyDown(el, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(el, { key: " " });
      await Promise.resolve();

      // Space key handled should do nothing on a link
      expect(events).toEqual([]);

      fireEvent.keyDown(el, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(el, { key: "Enter" });
      await Promise.resolve();

      // Enter key should handle natively
      expect(events).toEqual([]);

      fireEvent.click(el);
      await Promise.resolve();

      // Click event, which is called when Enter key on a link is handled natively, should trigger a click.
      expect(events).toEqual([
        {
          type: "click",
        },
        {
          type: "pressstart",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });

    it("should fire press events on Enter when the element role is link", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          role="link"
          onClick={(e: any) => {
            e.preventDefault();
            addEvent({ type: "click" });
          }}
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent.keyDown(el, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(el, { key: " " });
      await Promise.resolve();

      // Space key should do nothing on an element with role="link"
      expect(events).toEqual([]);

      fireEvent.keyDown(el, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(el, { key: "Enter" });
      await Promise.resolve();

      // Enter key should trigger press events on element with role="link"
      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "click",
        },
      ]);
    });

    it('should explicitly call click method, but not fire press events, when Space key is triggered on a link with href and role="button"', async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          elementType="a"
          role="button"
          href="#"
          onClick={(e: any) => {
            e.preventDefault();
            addEvent({ type: "click" });
          }}
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      // Enter key should handled natively
      fireEvent.keyDown(el, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(el, { key: "Enter" });
      await Promise.resolve();

      expect(events).toEqual([]);

      // Space key handled by explicitly calling click
      fireEvent.keyDown(el, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(el, { key: " " });
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "click",
        },
      ]);
    });

    it("should handle modifier keys", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent.keyDown(el, { key: " ", shiftKey: true });
      await Promise.resolve();

      fireEvent.keyUp(el, { key: " ", ctrlKey: true });
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: true,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "keyboard",
          ctrlKey: true,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "keyboard",
          ctrlKey: true,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "keyboard",
          ctrlKey: true,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });

    it("should handle when focus moves between keydown and keyup", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent.keyDown(el, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(document.body, { key: " " });
      await Promise.resolve();

      fireEvent.keyDown(el, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(el, { key: " " });
      await Promise.resolve();

      expect(events).toEqual([
        // First sequence. Ensure the key up on the body causes a press end.
        {
          type: "pressstart",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },

        // Second sequence. Ensure `isPressed` is reset to false on key up.
        {
          type: "pressstart",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });

    it("should ignore repeating keyboard events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent.keyDown(el, { key: " ", repeat: true });
      await Promise.resolve();

      fireEvent.keyUp(document.body, { key: " " });
      await Promise.resolve();

      expect(events).toEqual([]);
    });

    it("should fire press events on checkboxes but not prevent default", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          elementType="input"
          type="checkbox"
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByRole("checkbox");

      fireEvent.keyDown(el, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(el, { key: "Enter" });
      await Promise.resolve();

      // Enter key handled should do nothing on a checkbox
      expect(events).toEqual([]);

      let allow = fireEvent.keyDown(el, { key: " " });
      await Promise.resolve();

      expect(allow).toBeTruthy();
      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
      ]);

      allow = fireEvent.keyUp(el, { key: " " });
      await Promise.resolve();

      expect(allow).toBeTruthy();
      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "keyboard",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });
  });

  describe("virtual click events", () => {
    it("should fire press events events for virtual click events from screen readers", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent.click(el);
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: true,
        },
        {
          type: "pressup",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "pressend",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
        {
          type: "presschange",
          pressed: false,
        },
        {
          type: "press",
          target: el,
          pointerType: "virtual",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false,
        },
      ]);
    });
  });

  it("should not focus the target if preventFocusOnPress is true", async () => {
    render(() => <Example preventFocusOnPress />);

    const el = screen.getByText("test");

    fireEvent.click(el);
    await Promise.resolve();

    expect(document.activeElement).not.toBe(el);
  });

  it("should focus the target on virtual click by default", async () => {
    render(() => <Example />);

    const el = screen.getByText("test");

    fireEvent.click(el);
    await Promise.resolve();

    expect(document.activeElement).toBe(el);
  });

  describe("disable text-selection when pressed", () => {
    installPointerEvent();

    const handler = jest.fn();
    const mockUserSelect = "contain";
    const oldUserSelect = document.documentElement.style.webkitUserSelect;
    let platformGetter: any;

    function TestStyleChange(props: CreatePressProps & { styleToApply?: any }) {
      const [local, others] = splitProps(props, ["styleToApply"]);

      const [show, setShow] = createSignal(false);

      const createPressProps = mergeProps(others, {
        onPressStart: () => setTimeout(() => setShow(true), 3000),
      });

      const { pressHandlers } = createPress<HTMLDivElement>(createPressProps);

      return (
        <div style={show() ? local.styleToApply : {}} {...pressHandlers}>
          test
        </div>
      );
    }

    beforeAll(() => {
      platformGetter = jest.spyOn(window.navigator, "platform", "get");
    });

    afterAll(() => {
      handler.mockClear();
      jest.restoreAllMocks();
    });

    beforeEach(() => {
      document.documentElement.style.webkitUserSelect = mockUserSelect;
      platformGetter.mockReturnValue("iPhone");
    });

    afterEach(() => {
      document.documentElement.style.webkitUserSelect = oldUserSelect;
    });

    it("should add user-select: none to the page on press start (iOS)", async () => {
      render(() => (
        <Example
          onPressStart={handler}
          onPressEnd={handler}
          onPressChange={handler}
          onPress={handler}
          onPressUp={handler}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(document.documentElement.style.webkitUserSelect).toBe("none");
      expect(el).not.toHaveStyle("user-select: none");

      fireEvent(el, createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();
    });

    it("should not add user-select: none to the page when press start (non-iOS)", async () => {
      platformGetter.mockReturnValue("Android");

      render(() => (
        <Example
          onPressStart={handler}
          onPressEnd={handler}
          onPressChange={handler}
          onPress={handler}
          onPressUp={handler}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(document.documentElement.style.webkitUserSelect).toBe(mockUserSelect);
      expect(el).toHaveStyle("user-select: none");
    });

    it("should remove user-select: none from the page when press end (iOS)", async () => {
      render(() => (
        <Example
          onPressStart={handler}
          onPressEnd={handler}
          onPressChange={handler}
          onPress={handler}
          onPressUp={handler}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      jest.advanceTimersByTime(300);

      expect(document.documentElement.style.webkitUserSelect).toBe(mockUserSelect);

      // Checkbox doesn't remove `user-select: none;` style from HTML Element issue
      // see https://github.com/adobe/react-spectrum/issues/862
      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "touch",
          clientX: 100,
          clientY: 100,
        })
      );
      await Promise.resolve();
      jest.advanceTimersByTime(300);

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "touch",
          clientX: 100,
          clientY: 100,
        })
      );
      await Promise.resolve();
      jest.advanceTimersByTime(300);

      expect(document.documentElement.style.webkitUserSelect).toBe(mockUserSelect);
    });

    it("should remove user-select: none from the element when press end (non-iOS)", async () => {
      platformGetter.mockReturnValue("Android");

      render(() => (
        <Example
          style={{ "user-select": "text" }}
          onPressStart={handler}
          onPressEnd={handler}
          onPressChange={handler}
          onPress={handler}
          onPressUp={handler}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(el).toHaveStyle("user-select: none");

      fireEvent(el, createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(el).toHaveStyle("user-select: text");

      // Checkbox doesn't remove `user-select: none;` style from HTML Element issue
      // see https://github.com/adobe/react-spectrum/issues/862
      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "touch",
          clientX: 100,
          clientY: 100,
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        createPointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "touch",
          clientX: 100,
          clientY: 100,
        })
      );
      await Promise.resolve();

      expect(el).toHaveStyle("user-select: text");
    });

    it("should not remove user-select: none when pressing two different elements quickly (iOS)", async () => {
      render(() => (
        <>
          <Example
            onPressStart={handler}
            onPressEnd={handler}
            onPressChange={handler}
            onPress={handler}
            onPressUp={handler}
          />
          <Example
            onPressStart={handler}
            onPressEnd={handler}
            onPressChange={handler}
            onPress={handler}
            onPressUp={handler}
          />
        </>
      ));

      const els = screen.getAllByText("test");

      fireEvent(els[0], createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(els[0], createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(document.documentElement.style.webkitUserSelect).toBe("none");

      fireEvent(els[1], createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();
      jest.advanceTimersByTime(300);

      expect(document.documentElement.style.webkitUserSelect).toBe("none");

      fireEvent(els[1], createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();
      jest.advanceTimersByTime(300);

      expect(document.documentElement.style.webkitUserSelect).toBe(mockUserSelect);
    });

    it("should clean up user-select: none when pressing and releasing two different elements (non-iOS)", async () => {
      platformGetter.mockReturnValue("Android");

      render(() => (
        <>
          <Example
            style={{ "user-select": "text" }}
            onPressStart={handler}
            onPressEnd={handler}
            onPressChange={handler}
            onPress={handler}
            onPressUp={handler}
          />
          <Example
            style={{ "user-select": "text" }}
            onPressStart={handler}
            onPressEnd={handler}
            onPressChange={handler}
            onPress={handler}
            onPressUp={handler}
          />
        </>
      ));

      const els = screen.getAllByText("test");

      fireEvent(els[0], createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(els[1], createPointerEvent("pointerdown", { pointerId: 2, pointerType: "touch" }));
      await Promise.resolve();

      expect(els[0]).toHaveStyle("user-select: none");
      expect(els[1]).toHaveStyle("user-select: none");

      fireEvent(els[0], createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(els[0]).toHaveStyle("user-select: text");
      expect(els[1]).toHaveStyle("user-select: none");

      fireEvent(els[1], createPointerEvent("pointerup", { pointerId: 2, pointerType: "touch" }));
      await Promise.resolve();

      expect(els[0]).toHaveStyle("user-select: text");
      expect(els[1]).toHaveStyle("user-select: text");
    });

    it("should remove user-select: none from the page if pressable component unmounts (iOS)", async () => {
      const { unmount } = render(() => (
        <Example
          onPressStart={handler}
          onPressEnd={handler}
          onPressChange={handler}
          onPress={handler}
          onPressUp={handler}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(document.documentElement.style.webkitUserSelect).toBe("none");

      unmount();
      await Promise.resolve();
      jest.advanceTimersByTime(300);

      expect(document.documentElement.style.webkitUserSelect).toBe(mockUserSelect);
    });

    it("non related style changes during press down shouldn't overwrite user-select on press end (non-iOS)", async () => {
      platformGetter.mockReturnValue("Android");

      render(() => (
        <TestStyleChange
          styleToApply={{ background: "red" }}
          onPressStart={handler}
          onPressEnd={handler}
          onPressChange={handler}
          onPress={handler}
          onPressUp={handler}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(el).toHaveStyle(`
        user-select: none;
      `);

      jest.runAllTimers();

      expect(el).toHaveStyle(`
        user-select: none;
        background: red;
      `);

      fireEvent(el, createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(el).toHaveStyle(`
        background: red;
      `);
    });

    it("changes to user-select during press down remain on press end (non-iOS)", async () => {
      platformGetter.mockReturnValue("Android");

      render(() => (
        <TestStyleChange
          styleToApply={{ background: "red", "user-select": "text" }}
          onPressStart={handler}
          onPressEnd={handler}
          onPressChange={handler}
          onPress={handler}
          onPressUp={handler}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, createPointerEvent("pointerdown", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(el).toHaveStyle(`
        user-select: none;
      `);

      jest.runAllTimers();

      expect(el).toHaveStyle(`
        user-select: text;
        background: red;
      `);

      fireEvent(el, createPointerEvent("pointerup", { pointerId: 1, pointerType: "touch" }));
      await Promise.resolve();

      expect(el).toHaveStyle(`
        user-select: text;
        background: red;
      `);
    });
  });
});
