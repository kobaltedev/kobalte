/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/dialog/test/Dialog.test.js
 */

import { render } from "@solidjs/testing-library";

import * as AlertDialog from ".";

describe("AlertDialog", () => {
	it("should be labelled by its alert dialog title", () => {
		const { getByRole, getByTestId } = render(() => (
			<AlertDialog.Root open>
				<AlertDialog.Content>
					<AlertDialog.Title data-testid="title">title</AlertDialog.Title>
				</AlertDialog.Content>
			</AlertDialog.Root>
		));

		const panel = getByRole("alertdialog");
		const title = getByTestId("title");

		expect(panel).toHaveAttribute("aria-labelledby", title.id);
	});

	it("should be described by its alert dialog description", () => {
		const { getByRole, getByTestId } = render(() => (
			<AlertDialog.Root open>
				<AlertDialog.Content>
					<AlertDialog.Description data-testid="description">
						description
					</AlertDialog.Description>
				</AlertDialog.Content>
			</AlertDialog.Root>
		));

		const panel = getByRole("alertdialog");
		const description = getByTestId("description");

		expect(panel).toHaveAttribute("aria-describedby", description.id);
	});
});
