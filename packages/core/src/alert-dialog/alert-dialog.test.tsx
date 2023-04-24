/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/dialog/test/Dialog.test.js
 */

import { render, screen } from "@solidjs/testing-library";

import * as AlertDialog from ".";

describe("AlertDialog", () => {
  it("should be labelled by its alert dialog title", function () {
    render(() => (
      <AlertDialog.Root open>
        <AlertDialog.Content>
          <AlertDialog.Title data-testid="title">title</AlertDialog.Title>
        </AlertDialog.Content>
      </AlertDialog.Root>
    ));

    const panel = screen.getByRole("alertdialog");
    const title = screen.getByTestId("title");

    expect(panel).toHaveAttribute("aria-labelledby", title.id);
  });

  it("should be described by its alert dialog description", function () {
    render(() => (
      <AlertDialog.Root open>
        <AlertDialog.Content>
          <AlertDialog.Description data-testid="description">description</AlertDialog.Description>
        </AlertDialog.Content>
      </AlertDialog.Root>
    ));

    const panel = screen.getByRole("alertdialog");
    const description = screen.getByTestId("description");

    expect(panel).toHaveAttribute("aria-describedby", description.id);
  });
});
