import { installPointerEvent, triggerPress } from "@kobalte/tests";
import userEvent from "@testing-library/user-event";
import { ComponentProps, createSignal, Show, splitProps } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createFocusScope, CreateFocusScopeProps } from "./create-focus-scope";

function FocusScope(
  props: ComponentProps<"div"> & CreateFocusScopeProps & { trapFocus?: boolean }
) {
  let containerRef: any;

  const [local, others] = splitProps(props, ["trapFocus", "autoFocus", "restoreFocus"]);

  const { FocusTrap } = createFocusScope(local, () => containerRef);

  return (
    <>
      <FocusTrap />
      <div ref={containerRef} {...others} />
      <FocusTrap />
    </>
  );
}

describe("createFocusScope", () => {
  installPointerEvent();

  it("should focus first focusable element on mount when 'autoFocus' is true", async () => {
    render(() => (
      <FocusScope autoFocus>
        <button>Button</button>
      </FocusScope>
    ));

    expect(screen.getByText("Button")).toHaveFocus();
  });

  it("should focus element targeted with 'autoFocus' on mount", () => {
    render(() => (
      <FocusScope autoFocus="#first">
        <button>Button 1</button>
        <button id="first">Button 2</button>
      </FocusScope>
    ));

    expect(screen.getByText("Button 2")).toHaveFocus();
  });

  it("should fallbacks to container focus if no focusable elements are found", async () => {
    render(() => (
      <>
        <button>Before</button>
        <FocusScope tabIndex={-1} data-testid="focus-trap" />
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
        <FocusScope trapFocus={false}>
          <button>Button</button>
        </FocusScope>
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

  it("should focus previous active element on unmount when 'restoreFocus' is true", async () => {
    const Example = () => {
      const [isOpen, setIsOpen] = createSignal(false);

      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <Show when={isOpen()}>
            <FocusScope restoreFocus data-testid="focus-trap">
              <button onClick={() => setIsOpen(false)}>Close</button>
            </FocusScope>
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

  it("should focus element targeted with 'restoreFocus' on unmount", async () => {
    const Example = () => {
      const [isOpen, setIsOpen] = createSignal(false);

      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <Show when={isOpen()}>
            <FocusScope restoreFocus="#last" data-testid="focus-trap">
              <button onClick={() => setIsOpen(false)}>Close</button>
            </FocusScope>
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

  it("should bring back focus in container when interacting outside", async () => {
    render(() => (
      <>
        <FocusScope>
          <button>Inside</button>
        </FocusScope>
        <button>Outside</button>
      </>
    ));

    await triggerPress(screen.getByText("Outside"));

    expect(screen.getByText("Inside")).toHaveFocus();
  });
});
