import {
  itIsPolymorphic,
  itRendersChildren,
  itSupportsClass,
  itSupportsRef,
  itSupportsStyle,
} from "@kobalte/tests";
import userEvent from "@testing-library/user-event";
import { createSignal, Show } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { FocusTrapRegion, FocusTrapRegionProps } from "./focus-trap-region";

const defaultProps: FocusTrapRegionProps = {};

describe("FocusTrapRegion", () => {
  itIsPolymorphic(
    FocusTrapRegion as any,
    { "data-testid": "focus-trap" },
    "[data-testid='focus-trap']"
  );
  itRendersChildren(FocusTrapRegion as any, defaultProps);
  itSupportsClass(FocusTrapRegion as any, defaultProps);
  itSupportsRef(FocusTrapRegion as any, defaultProps, HTMLDivElement);
  itSupportsStyle(
    FocusTrapRegion as any,
    { "data-testid": "focus-trap" },
    "[data-testid='focus-trap']"
  );

  it("should focus element with default 'initialFocusSelector' on mount", () => {
    render(() => (
      <FocusTrapRegion>
        <button>Button 1</button>
        <button data-autofocus>Button 2</button>
      </FocusTrapRegion>
    ));

    expect(screen.getByText("Button 2")).toHaveFocus();
  });

  it("should focus element with custom 'initialFocusSelector' on mount", () => {
    render(() => (
      <FocusTrapRegion initialFocusSelector="#first">
        <button>Button 1</button>
        <button id="first">Button 2</button>
      </FocusTrapRegion>
    ));

    expect(screen.getByText("Button 2")).toHaveFocus();
  });

  it("should focus first focusable element on mount when 'autoFocus' is true", async () => {
    render(() => (
      <FocusTrapRegion autoFocus>
        <button>Button</button>
      </FocusTrapRegion>
    ));

    expect(screen.getByText("Button")).toHaveFocus();
  });

  it("should fallbacks to container focus if no focusable elements are found", async () => {
    render(() => (
      <>
        <button>Before</button>
        <FocusTrapRegion data-testid="focus-trap" />
        <button>After</button>
      </>
    ));

    await userEvent.tab();
    expect(screen.getByText("Before")).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId("focus-trap")).toHaveFocus();

    // focus remains on the focus trap container
    await userEvent.tab();
    expect(screen.getByTestId("focus-trap")).toHaveFocus();
  });

  it("can be disabled", async () => {
    render(() => (
      <>
        <button>Before</button>
        <FocusTrapRegion trapFocus={false}>
          <button>Button</button>
        </FocusTrapRegion>
        <button>After</button>
      </>
    ));

    await userEvent.tab();
    expect(screen.getByText("Before")).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByText("Button")).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByText("After")).toHaveFocus();
  });

  it("should focus element with 'restoreFocusSelector' on unmount", async () => {
    const Example = () => {
      const [isOpen, setIsOpen] = createSignal(false);

      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <Show when={isOpen()}>
            <FocusTrapRegion restoreFocusSelector="#last" data-testid="focus-trap">
              <button onClick={() => setIsOpen(false)}>Close</button>
            </FocusTrapRegion>
          </Show>
          <button id="last">Last</button>
        </>
      );
    };

    render(() => <Example />);

    expect(screen.queryByTestId("focus-trap")).toBeNull();

    const openButton = screen.getByText("Open") as HTMLButtonElement;

    await userEvent.tab();
    expect(openButton).toHaveFocus();

    fireEvent.click(openButton);
    await Promise.resolve();

    const focusTrap = screen.getByTestId("focus-trap");
    expect(focusTrap).toBeInTheDocument();

    const closeButton = screen.getByText("Close") as HTMLButtonElement;

    await userEvent.tab();
    expect(closeButton).toHaveFocus();

    fireEvent.click(closeButton);
    await Promise.resolve();

    expect(screen.queryByText("Last")).toHaveFocus();
  });

  it("should focus previous active element on unmount when 'restoreFocus' is true", async () => {
    const Example = () => {
      const [isOpen, setIsOpen] = createSignal(false);

      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <Show when={isOpen()}>
            <FocusTrapRegion restoreFocus data-testid="focus-trap">
              <button onClick={() => setIsOpen(false)}>Close</button>
            </FocusTrapRegion>
          </Show>
        </>
      );
    };

    render(() => <Example />);

    expect(screen.queryByTestId("focus-trap")).toBeNull();

    const openButton = screen.getByText("Open") as HTMLButtonElement;

    await userEvent.tab();
    expect(openButton).toHaveFocus();

    fireEvent.click(openButton);
    await Promise.resolve();

    const focusTrap = screen.getByTestId("focus-trap");
    expect(focusTrap).toBeInTheDocument();

    const closeButton = screen.getByText("Close") as HTMLButtonElement;

    await userEvent.tab();
    expect(closeButton).toHaveFocus();

    fireEvent.click(closeButton);
    await Promise.resolve();

    expect(openButton).toHaveFocus();
  });

  it("should ignore 'restoreFocus' when 'restoreFocusSelector' is set", async () => {
    const Example = () => {
      const [isOpen, setIsOpen] = createSignal(false);

      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <Show when={isOpen()}>
            <FocusTrapRegion restoreFocus restoreFocusSelector="#last" data-testid="focus-trap">
              <button onClick={() => setIsOpen(false)}>Close</button>
            </FocusTrapRegion>
          </Show>
          <button id="last">Last</button>
        </>
      );
    };

    render(() => <Example />);

    expect(screen.queryByTestId("focus-trap")).toBeNull();

    const openButton = screen.getByText("Open") as HTMLButtonElement;

    await userEvent.tab();
    expect(openButton).toHaveFocus();

    fireEvent.click(openButton);
    await Promise.resolve();

    const focusTrap = screen.getByTestId("focus-trap");
    expect(focusTrap).toBeInTheDocument();

    const closeButton = screen.getByText("Close") as HTMLButtonElement;

    await userEvent.tab();
    expect(closeButton).toHaveFocus();

    fireEvent.click(closeButton);
    await Promise.resolve();

    expect(screen.queryByText("Last")).toHaveFocus();
  });
});
