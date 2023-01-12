/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/6b51339cca0b8344507d3c8e81e7ad05d6e75f9b/packages/@react-aria/interactions/test/useLongPress.test.js
 */

import { installPointerEvent } from "@kobalte/tests";
import { composeEventHandlers } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { fireEvent, render, screen } from "solid-testing-library";

import { createPress, PRESS_HANDLERS_PROP_NAMES } from "../create-press";
import { createLongPress } from "./create-long-press";

function Example(props: any) {
  const [local, others] = splitProps(props, ["elementType"]);

  const { longPressHandlers } = createLongPress(others);

  return (
    <Dynamic component={local.elementType ?? "div"} {...longPressHandlers} tabIndex="0">
      test
    </Dynamic>
  );
}

function ExampleWithPress(props: any) {
  const [local, others] = splitProps(props, [
    "elementType",
    "onPress",
    "onPressStart",
    "onPressEnd",
    ...PRESS_HANDLERS_PROP_NAMES,
  ]);

  const { longPressHandlers } = createLongPress(others);

  const { pressHandlers } = createPress(local);

  return (
    <Dynamic
      component={local.elementType ?? "div"}
      tabIndex="0"
      onKeyDown={composeEventHandlers([
        local.onKeyDown,
        longPressHandlers.onKeyDown,
        pressHandlers.onKeyDown,
      ])}
      onKeyUp={composeEventHandlers([
        local.onKeyUp,
        longPressHandlers.onKeyUp,
        pressHandlers.onKeyUp,
      ])}
      onClick={composeEventHandlers([
        local.onClick,
        longPressHandlers.onClick,
        pressHandlers.onClick,
      ])}
      onPointerDown={composeEventHandlers([
        local.onPointerDown,
        longPressHandlers.onPointerDown,
        pressHandlers.onPointerDown,
      ])}
      onPointerUp={composeEventHandlers([
        local.onPointerUp,
        longPressHandlers.onPointerUp,
        pressHandlers.onPointerUp,
      ])}
      onMouseDown={composeEventHandlers([
        local.onMouseDown,
        longPressHandlers.onMouseDown,
        pressHandlers.onMouseDown,
      ])}
      onDragStart={composeEventHandlers([
        local.onDragStart,
        longPressHandlers.onDragStart,
        pressHandlers.onDragStart,
      ])}
      {...others}
    >
      test
    </Dynamic>
  );
}

describe("createLongPress", function () {
  beforeAll(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  installPointerEvent();

  it("should perform a long press", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <Example onLongPressStart={addEvent} onLongPressEnd={addEvent} onLongPress={addEvent} />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
    ]);

    jest.advanceTimersByTime(400);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
    ]);

    jest.advanceTimersByTime(200);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpress",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
    ]);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpress",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
    ]);
  });

  it("should cancel if pointer ends before timeout", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <Example onLongPressStart={addEvent} onLongPressEnd={addEvent} onLongPress={addEvent} />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(200);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(800);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
    ]);
  });

  it("should cancel other press events", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <ExampleWithPress
        onLongPressStart={addEvent}
        onLongPressEnd={addEvent}
        onLongPress={addEvent}
        onPressStart={addEvent}
        onPressEnd={addEvent}
        onPress={addEvent}
      />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(600);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "pressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "pressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpress",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
    ]);
  });

  it("should not cancel press events if pointer ends before timer", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <ExampleWithPress
        onLongPressStart={addEvent}
        onLongPressEnd={addEvent}
        onLongPress={addEvent}
        onPressStart={addEvent}
        onPressEnd={addEvent}
        onPress={addEvent}
      />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(300);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "pressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "pressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "press",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
    ]);
  });

  it("allows changing the threshold", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <Example
        onLongPressStart={addEvent}
        onLongPressEnd={addEvent}
        onLongPress={addEvent}
        threshold={800}
      />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(600);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
    ]);

    jest.advanceTimersByTime(800);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
      {
        type: "longpress",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      },
    ]);
  });

  it("prevents context menu events on touch", async () => {
    render(() => (
      <Example
        onLongPress={() => {
          return;
        }}
      />
    ));

    const el = screen.getByText("test");
    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(600);

    const performDefault = fireEvent.contextMenu(el);
    expect(performDefault).toBe(false);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();
  });

  it("should not fire any events for keyboard interactions", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <Example
        onLongPressStart={addEvent}
        onLongPressEnd={addEvent}
        onLongPress={addEvent}
        threshold={800}
      />
    ));

    const el = screen.getByText("test");

    fireEvent.keyDown(el, { key: " " });
    await Promise.resolve();

    jest.advanceTimersByTime(600);

    fireEvent.keyUp(el, { key: " " });
    await Promise.resolve();

    expect(events).toHaveLength(0);
  });
});
