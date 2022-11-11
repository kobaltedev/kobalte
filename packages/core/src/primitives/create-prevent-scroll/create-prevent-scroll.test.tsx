/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/overlays/test/usePreventScroll.test.js
 */

import { createSignal } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createPreventScroll, PreventScrollOptions } from "./create-prevent-scroll";

function Example(props: PreventScrollOptions) {
  createPreventScroll(props);
  return <div />;
}

describe("createPreventScroll", function () {
  it("should set overflow: hidden on the body on mount and remove on unmount", () => {
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");

    const res = render(() => <Example isEnabled />);
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    res.unmount();
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");
  });

  it("should work with nested modals", () => {
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");

    const one = render(() => <Example isEnabled />);
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    const two = render(() => <Example isEnabled />);
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    two.unmount();
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    one.unmount();
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");
  });

  it("should remove overflow: hidden when isDisabled option is true", async () => {
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");

    render(() => {
      const [isEnabled, setEnabled] = createSignal(true);
      return (
        <>
          <button onClick={() => setEnabled(false)}>Disable scroll lock</button>
          <Example isEnabled={isEnabled} />
        </>
      );
    });
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    const disableButton = screen.getByRole("button");

    fireEvent.click(disableButton);
    await Promise.resolve();

    expect(document.documentElement).not.toHaveStyle("overflow: hidden");
  });
});
