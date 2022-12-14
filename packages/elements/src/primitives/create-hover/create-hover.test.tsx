/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/2bcc2f0b45ea8b20621458a93f1804a3f9df9ac4/packages/@react-aria/interactions/test/useHover.test.js
 */

import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { createSignal } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createHover } from "./create-hover";
import { CreateHoverProps } from "./types";

function Example(props: CreateHoverProps) {
  const { hoverHandlers, isHovered } = createHover(props);

  return (
    <div {...hoverHandlers}>
      test{isHovered() && "-hovered"}
      <div data-testid="inner-target" />
    </div>
  );
}

describe("createHover", () => {
  installPointerEvent();

  beforeAll(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  it("does not handle hover events if disabled", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push(e);

    render(() => (
      <Example
        isDisabled
        onHoverEnd={addEvent}
        onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
        onHoverStart={addEvent}
      />
    ));

    const el = screen.getByText("test");

    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(events).toEqual([]);
  });

  it("should fire hover events based on pointer events", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push(e);

    render(() => (
      <Example
        onHoverStart={addEvent}
        onHoverEnd={addEvent}
        onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
      />
    ));

    const el = screen.getByText("test");

    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "hoverstart",
        target: el,
        pointerType: "mouse",
      },
      {
        type: "hoverchange",
        isHovering: true,
      },
      {
        type: "hoverend",
        target: el,
        pointerType: "mouse",
      },
      {
        type: "hoverchange",
        isHovering: false,
      },
    ]);
  });

  it("hover event target should be the same element we attached listeners to even if we hover over inner elements", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push(e);

    render(() => (
      <Example
        onHoverStart={addEvent}
        onHoverEnd={addEvent}
        onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
      />
    ));

    const el = screen.getByText("test");
    const inner = screen.getByTestId("inner-target");

    fireEvent(inner, createPointerEvent("pointerenter", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(inner, createPointerEvent("pointerleave", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "hoverstart",
        target: el,
        pointerType: "mouse",
      },
      {
        type: "hoverchange",
        isHovering: true,
      },
      {
        type: "hoverend",
        target: el,
        pointerType: "mouse",
      },
      {
        type: "hoverchange",
        isHovering: false,
      },
    ]);
  });

  it("should not fire hover events when pointerType is touch", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push(e);

    render(() => (
      <Example
        onHoverStart={addEvent}
        onHoverEnd={addEvent}
        onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
      />
    ));

    const el = screen.getByText("test");

    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "touch" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "touch" }));
    await Promise.resolve();

    expect(events).toEqual([]);
  });

  it("ignores emulated mouse events following touch events", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push(e);

    render(() => (
      <Example
        onHoverStart={addEvent}
        onHoverEnd={addEvent}
        onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
      />
    ));

    const el = screen.getByText("test");

    fireEvent(el, createPointerEvent("pointerdown", { pointerType: "touch" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "touch" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "touch" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerup", { pointerType: "touch" }));
    await Promise.resolve();

    // Safari on iOS has a bug that fires a pointer event with pointerType="mouse" on focus.
    // See https://bugs.webkit.org/show_bug.cgi?id=214609.
    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(events).toEqual([]);
  });

  it("ignores supports mouse events following touch events after a delay", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push(e);

    render(() => (
      <Example
        onHoverStart={addEvent}
        onHoverEnd={addEvent}
        onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
      />
    ));

    const el = screen.getByText("test");

    fireEvent(el, createPointerEvent("pointerdown", { pointerType: "touch" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "touch" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "touch" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerup", { pointerType: "touch" }));
    await Promise.resolve();

    jest.advanceTimersByTime(100);

    // Safari on iOS has a bug that fires a pointer event with pointerType="mouse" on focus.
    // See https://bugs.webkit.org/show_bug.cgi?id=214609.
    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "mouse" }));
    await Promise.resolve();

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "hoverstart",
        target: el,
        pointerType: "mouse",
      },
      {
        type: "hoverchange",
        isHovering: true,
      },
      {
        type: "hoverend",
        target: el,
        pointerType: "mouse",
      },
      {
        type: "hoverchange",
        isHovering: false,
      },
    ]);
  });

  it("should visually change component with pointer events", async () => {
    render(() => <Example />);

    const el = screen.getByText("test");

    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(el.textContent).toBe("test-hovered");

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(el.textContent).toBe("test");
  });

  it("should not visually change component when pointerType is touch", async () => {
    render(() => <Example />);

    const el = screen.getByText("test");

    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "touch" }));
    await Promise.resolve();

    expect(el.textContent).toBe("test");

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "touch" }));
    await Promise.resolve();

    expect(el.textContent).toBe("test");
  });

  it("should end hover when disabled", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push(e);

    function Example(props: CreateHoverProps) {
      const { hoverHandlers, isHovered } = createHover(props);
      return (
        <div {...hoverHandlers}>
          test{isHovered() && "-hovered"}
          <div data-testid="inner-target" />
        </div>
      );
    }

    function Wrapper() {
      const [isDisabled, setIsDisabled] = createSignal(false);
      return (
        <div>
          <Example
            isDisabled={isDisabled()}
            onHoverStart={addEvent}
            onHoverEnd={addEvent}
            onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
          />
          <button data-testid="disable-button" onClick={() => setIsDisabled(true)}>
            Disable
          </button>
        </div>
      );
    }

    render(() => <Wrapper />);

    let el = screen.getByText("test");

    fireEvent(el, createPointerEvent("pointerenter", { pointerType: "mouse" }));
    await Promise.resolve();

    expect(el.textContent).toBe("test-hovered");
    expect(events).toEqual([
      {
        type: "hoverstart",
        target: el,
        pointerType: "mouse",
      },
      {
        type: "hoverchange",
        isHovering: true,
      },
    ]);
    events.pop();
    events.pop();

    const disableButton = screen.getByTestId("disable-button");

    fireEvent.click(disableButton);
    await Promise.resolve();

    el = screen.getByText("test");

    expect(el.textContent).toBe("test");
    expect(events).toEqual([
      {
        type: "hoverend",
        target: el,
        pointerType: "mouse",
      },
      {
        type: "hoverchange",
        isHovering: false,
      },
    ]);

    fireEvent(el, createPointerEvent("pointerleave", { pointerType: "mouse" }));
    await Promise.resolve();
  });
});
