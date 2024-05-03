/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/dialog/test/Dialog.test.js
 */

import { render } from "@solidjs/testing-library";

import * as Dialog from ".";

describe("Dialog", () => {
	it("should be labelled by its dialog title", () => {
		const { getByRole, getByTestId } = render(() => (
			<Dialog.Root open>
				<Dialog.Content>
					<Dialog.Title data-testid="title">title</Dialog.Title>
				</Dialog.Content>
			</Dialog.Root>
		));

		const panel = getByRole("dialog");
		const title = getByTestId("title");

		expect(panel).toHaveAttribute("aria-labelledby", title.id);
	});

	it("should be described by its dialog description", () => {
		const { getByRole, getByTestId } = render(() => (
			<Dialog.Root open>
				<Dialog.Content>
					<Dialog.Description data-testid="description">
						description
					</Dialog.Description>
				</Dialog.Content>
			</Dialog.Root>
		));

		const panel = getByRole("dialog");
		const description = getByTestId("description");

		expect(panel).toHaveAttribute("aria-describedby", description.id);
	});
});
