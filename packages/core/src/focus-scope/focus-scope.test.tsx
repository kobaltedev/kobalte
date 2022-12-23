import { installPointerEvent, triggerPress } from "@kobalte/tests";
import userEvent from "@testing-library/user-event";
import { createSignal, Show } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { FocusScope } from "./focus-scope";

describe("createFocusScope", () => {
  installPointerEvent();

  it("should focus first focusable element on mount when 'autoFocus' is true", async () => {
    render(() => (
      <FocusScope autoFocus>
        {setContainerRef => (
          <div ref={setContainerRef}>
            <button>Button</button>
          </div>
        )}
      </FocusScope>
    ));

    expect(screen.getByText("Button")).toHaveFocus();
  });

  it("should focus element targeted with 'autoFocus' on mount", () => {
    render(() => (
      <FocusScope autoFocus="#first">
        {setContainerRef => (
          <div ref={setContainerRef}>
            <button>Button 1</button>
            <button id="first">Button 2</button>
          </div>
        )}
      </FocusScope>
    ));

    expect(screen.getByText("Button 2")).toHaveFocus();
  });

  it("should fallbacks to container focus if no focusable elements are found", async () => {
    render(() => (
      <>
        <button>Before</button>
        <FocusScope>
          {setContainerRef => (
            <div tabIndex={-1} data-testid="container" ref={setContainerRef}></div>
          )}
        </FocusScope>
        <button>After</button>
      </>
    ));

    await userEvent.tab();
    expect(screen.getByText("Before")).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId("container")).toHaveFocus();

    // focus remains on the focus trap container
    await userEvent.tab();
    expect(screen.getByTestId("container")).toHaveFocus();
  });

  it("can be disabled", async () => {
    render(() => (
      <>
        <button>Before</button>
        <FocusScope trapFocus={false}>
          {setContainerRef => (
            <div ref={setContainerRef}>
              <button>Button</button>
            </div>
          )}
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
            <FocusScope restoreFocus>
              {setContainerRef => (
                <div data-testid="container" ref={setContainerRef}>
                  <button onClick={() => setIsOpen(false)}>Close</button>
                </div>
              )}
            </FocusScope>
          </Show>
        </>
      );
    };

    render(() => <Example />);

    expect(screen.queryByTestId("container")).toBeNull();

    const openButton = screen.getByText("Open") as HTMLButtonElement;

    await userEvent.tab();
    expect(openButton).toHaveFocus();

    fireEvent.click(openButton);
    await Promise.resolve();

    const focusTrap = screen.getByTestId("container");
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
            <FocusScope restoreFocus="#last">
              {setContainerRef => (
                <div data-testid="container" ref={setContainerRef}>
                  <button onClick={() => setIsOpen(false)}>Close</button>
                </div>
              )}
            </FocusScope>
          </Show>
          <button id="last">Last</button>
        </>
      );
    };

    render(() => <Example />);

    expect(screen.queryByTestId("container")).toBeNull();

    const openButton = screen.getByText("Open") as HTMLButtonElement;

    await userEvent.tab();
    expect(openButton).toHaveFocus();

    fireEvent.click(openButton);
    await Promise.resolve();

    const focusTrap = screen.getByTestId("container");
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
          {setContainerRef => (
            <div ref={setContainerRef}>
              <button>Inside</button>
            </div>
          )}
        </FocusScope>
        <button>Outside</button>
      </>
    ));

    await triggerPress(screen.getByText("Outside"));

    expect(screen.getByText("Inside")).toHaveFocus();
  });
});
