/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/dialog/test/Dialog.test.js
 */

import { render, screen } from "solid-testing-library";

import { Dialog } from "./dialog";

describe("Dialog", () => {
  it("should be labelled by its dialog title", function () {
    render(() => (
      <Dialog isOpen>
        <Dialog.Panel>
          <Dialog.Title data-testid="title">title</Dialog.Title>
        </Dialog.Panel>
      </Dialog>
    ));

    const panel = screen.getByRole("dialog");
    const title = screen.getByTestId("title");

    expect(panel).toHaveAttribute("aria-labelledby", title.id);
  });

  it("should use dialog 'aria-labelledby' over dialog title", function () {
    render(() => (
      <Dialog isOpen aria-labelledby="foo">
        <Dialog.Panel>
          <Dialog.Title>title</Dialog.Title>
        </Dialog.Panel>
      </Dialog>
    ));

    const panel = screen.getByRole("dialog");

    expect(panel).toHaveAttribute("aria-labelledby", "foo");
  });

  it("should use dialog 'aria-label' over dialog title", function () {
    render(() => (
      <Dialog isOpen aria-label="Label">
        <Dialog.Panel>
          <Dialog.Title>title</Dialog.Title>
        </Dialog.Panel>
      </Dialog>
    ));

    const panel = screen.getByRole("dialog");

    expect(panel).not.toHaveAttribute("aria-labelledby");
    expect(panel).toHaveAttribute("aria-label", "Label");
  });

  it("should be described by its dialog description", function () {
    render(() => (
      <Dialog isOpen>
        <Dialog.Panel>
          <Dialog.Description data-testid="description">description</Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    ));

    const panel = screen.getByRole("dialog");
    const description = screen.getByTestId("description");

    expect(panel).toHaveAttribute("aria-describedby", description.id);
  });

  it("should use dialog 'aria-describedby' over dialog description", function () {
    render(() => (
      <Dialog isOpen aria-describedby="foo">
        <Dialog.Panel>
          <Dialog.Description>description</Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    ));

    const panel = screen.getByRole("dialog");

    expect(panel).toHaveAttribute("aria-describedby", "foo");
  });
});
