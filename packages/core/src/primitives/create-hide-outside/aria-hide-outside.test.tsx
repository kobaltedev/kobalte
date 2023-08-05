/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/test/ariaHideOutside.test.js
 */

import { createSignal, onMount } from "solid-js";
import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";

import { ariaHideOutside } from "./create-hide-outside";

describe("ariaHideOutside", function () {
  it("should hide everything except the provided element [button]", function () {
    render(() => (
      <>
        <input type="checkbox" />
        <button>Button</button>
        <input type="checkbox" />
      </>
    ));

    const checkboxes = screen.getAllByRole("checkbox");
    const button = screen.getByRole("button");

    const revert = ariaHideOutside([button]);

    expect(checkboxes[0]).toHaveAttribute("aria-hidden", "true");
    expect(checkboxes[1]).toHaveAttribute("aria-hidden", "true");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert();

    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
    expect(checkboxes[1]).not.toHaveAttribute("aria-hidden");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should hide everything except multiple elements", function () {
    render(() => (
      <>
        <input type="checkbox" />
        <button>Button</button>
        <input type="checkbox" />
      </>
    ));

    const checkboxes = screen.getAllByRole("checkbox");
    const button = screen.getByRole("button");

    const revert = ariaHideOutside(checkboxes);

    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden", "true");
    expect(checkboxes[1]).not.toHaveAttribute("aria-hidden", "true");
    expect(button).toHaveAttribute("aria-hidden");

    expect(screen.queryAllByRole("checkbox")).not.toBeNull();
    expect(screen.queryByRole("button")).toBeNull();

    revert();

    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
    expect(checkboxes[1]).not.toHaveAttribute("aria-hidden");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should not traverse into an already hidden container", function () {
    render(() => (
      <>
        <div>
          <input type="checkbox" />
        </div>
        <button>Button</button>
        <input type="checkbox" />
      </>
    ));

    const checkboxes = screen.getAllByRole("checkbox");
    const button = screen.getByRole("button");

    const revert = ariaHideOutside([button]);

    expect(checkboxes[0].parentElement).toHaveAttribute("aria-hidden", "true");
    expect(checkboxes[1]).toHaveAttribute("aria-hidden", "true");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert();

    expect(checkboxes[0].parentElement).not.toHaveAttribute("aria-hidden");
    expect(checkboxes[1]).not.toHaveAttribute("aria-hidden");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should not overwrite an existing aria-hidden prop", function () {
    render(() => (
      <>
        <input type="checkbox" aria-hidden="true" />
        <button>Button</button>
        <input type="checkbox" />
      </>
    ));

    let checkboxes = screen.getAllByRole("checkbox");
    const button = screen.getByRole("button");

    const revert = ariaHideOutside([button]);

    expect(checkboxes).toHaveLength(1);
    expect(checkboxes[0]).toHaveAttribute("aria-hidden", "true");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert();

    checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(1);
    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should handle when a new element is added outside while active", async function () {
    const Test = () => {
      let toggleRef: any;
      let revertRef: any;

      const [show, setShow] = createSignal(false);
      let revert: () => void;

      onMount(() => {
        revert = ariaHideOutside([toggleRef, revertRef]);
      });

      return (
        <>
          {show() && <input type="checkbox" />}
          <button data-testid="toggle" ref={toggleRef} onClick={() => setShow(true)}>
            Toggle
          </button>
          <button data-testid="revert" ref={revertRef} onClick={() => revert()}>
            Revert
          </button>
          {show() && <input type="checkbox" />}
        </>
      );
    };

    render(() => <Test />);

    const toggle = screen.getByTestId("toggle");
    const revert = screen.getByTestId("revert");
    expect(() => screen.getAllByRole("checkbox")).toThrow();

    // Toggle the show state
    fireEvent.click(toggle);
    await Promise.resolve();

    // MutationObserver is async
    await waitFor(() => expect(() => screen.getAllByRole("checkbox")).toThrow());
    expect(() => screen.getAllByRole("button")).not.toThrow();

    // revert the 'ariaHideOutside'
    fireEvent.click(revert);
    await Promise.resolve();

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("should handle when a new element is added to an already hidden container", async function () {
    const Test = () => {
      const [show, setShow] = createSignal(false);

      return (
        <>
          <div data-testid="test">{show() && <input type="checkbox" />}</div>
          <button onClick={() => setShow(true)}>Button</button>
          {show() && <input type="checkbox" />}
        </>
      );
    };

    render(() => <Test />);

    const button = screen.getByRole("button");
    const test = screen.getByTestId("test");
    expect(() => screen.getAllByRole("checkbox")).toThrow();

    const revert = ariaHideOutside([button]);

    expect(test).toHaveAttribute("aria-hidden");

    // Toggle the show state
    fireEvent.click(button);
    await Promise.resolve();

    // MutationObserver is async
    await waitFor(() => expect(() => screen.getAllByRole("checkbox")).toThrow());
    expect(() => screen.getByRole("button")).not.toThrow();

    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    expect(test).toHaveAttribute("aria-hidden");
    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
    expect(checkboxes[1]).toHaveAttribute("aria-hidden", "true");

    revert();

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("should handle when a new element is added inside a target element", async function () {
    const Test = () => {
      const [show, setShow] = createSignal(false);

      return (
        <>
          <input type="checkbox" />
          <div data-testid="test">
            <button onClick={() => setShow(true)}>Button</button>
            {show() && <input type="radio" />}
          </div>
          <input type="checkbox" />
        </>
      );
    };

    render(() => <Test />);

    const button = screen.getByRole("button");
    const test = screen.getByTestId("test");
    const revert = ariaHideOutside([test]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(screen.queryByRole("radio")).toBeNull();
    expect(screen.queryByRole("button")).not.toBeNull();
    expect(() => screen.getByTestId("test")).not.toThrow();

    // Toggle the show state
    fireEvent.click(button);
    await Promise.resolve();

    // Wait for mutation observer tick
    await Promise.resolve();
    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
    expect(() => screen.getByTestId("test")).not.toThrow();

    revert();

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
    expect(() => screen.getByTestId("test")).not.toThrow();
  });

  it("work when called multiple times", function () {
    render(() => (
      <>
        <input type="checkbox" />
        <input type="radio" />
        <button>Button</button>
        <input type="radio" />
        <input type="checkbox" />
      </>
    ));

    const radios = screen.getAllByRole("radio");
    const button = screen.getByRole("button");

    const revert1 = ariaHideOutside([button, ...radios]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    const revert2 = ariaHideOutside([button]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert2();

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert1();

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("work when called multiple times and restored out of order", function () {
    render(() => (
      <>
        <input type="checkbox" />
        <input type="radio" />
        <button>Button</button>
        <input type="radio" />
        <input type="checkbox" />
      </>
    ));

    const radios = screen.getAllByRole("radio");
    const button = screen.getByRole("button");

    const revert1 = ariaHideOutside([button, ...radios]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    const revert2 = ariaHideOutside([button]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert1();

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert2();

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should hide everything except the provided element [row]", function () {
    render(() => (
      <div role="grid">
        <div role="row">
          <div role="gridcell">Cell 1</div>
        </div>
        <div role="row">
          <div role="gridcell">Cell 2</div>
        </div>
      </div>
    ));

    const cells = screen.getAllByRole("gridcell");
    const rows = screen.getAllByRole("row");

    const revert = ariaHideOutside([rows[1]]);

    // Applies aria-hidden to the row and cell despite recursive nature of aria-hidden
    // for https://bugs.webkit.org/show_bug.cgi?id=222623
    expect(rows[0]).toHaveAttribute("aria-hidden", "true");
    expect(cells[0]).toHaveAttribute("aria-hidden", "true");
    expect(rows[1]).not.toHaveAttribute("aria-hidden", "true");
    expect(cells[1]).not.toHaveAttribute("aria-hidden", "true");

    revert();

    expect(rows[0]).not.toHaveAttribute("aria-hidden", "true");
    expect(cells[0]).not.toHaveAttribute("aria-hidden", "true");
    expect(rows[1]).not.toHaveAttribute("aria-hidden", "true");
    expect(cells[1]).not.toHaveAttribute("aria-hidden", "true");
  });
});
