/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-spectrum/dialog/test/Dialog.test.js
 */

import { fireEvent, render, waitFor } from "@solidjs/testing-library";
import { createSignal } from "solid-js";

import { DismissableLayer } from "../dismissable-layer/index.ts";
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

	describe("#768 - modal dialog without trigger restores focus correctly", () => {
		it("closes without throwing when no Dialog.Trigger is rendered", async () => {
			const [open, setOpen] = createSignal(true);
			const { queryByRole } = render(() => (
				// No Dialog.Trigger - programmatic open only
				<Dialog.Root open={open()} onOpenChange={setOpen} modal>
					<Dialog.Content>
						<Dialog.Title>title</Dialog.Title>
						<button type="button" onClick={() => setOpen(false)}>
							close
						</button>
					</Dialog.Content>
				</Dialog.Root>
			));

			expect(queryByRole("dialog")).toBeTruthy();

			// Close via Escape - should not throw and dialog should unmount
			fireEvent.keyDown(document.activeElement ?? document.body, {
				key: "Escape",
				code: "Escape",
			});

			await waitFor(() => {
				expect(queryByRole("dialog")).toBeNull();
			});
		});
	});

	describe("#766 - portalled child overlay inside modal dialog is not aria-hidden", () => {
		it("does not set aria-hidden on a nested DismissableLayer registered in the dialog's context", async () => {
			// A DismissableLayer rendered inside a modal Dialog registers itself in the
			// dialog's DismissableLayerContext. The fix ensures createHideOutside includes
			// those nested layers in its targets so they are not aria-hidden.
			const [nestedVisible, setNestedVisible] = createSignal(false);

			const { getByRole, getByTestId } = render(() => (
				<Dialog.Root open modal>
					<Dialog.Content>
						<Dialog.Title>title</Dialog.Title>
						<button type="button" onClick={() => setNestedVisible(true)}>
							open nested
						</button>
						{nestedVisible() && (
							// Simulates a portalled Select/Popover: a DismissableLayer that is a
							// child of the dialog's DismissableLayerContext. In a real app it
							// would be rendered via <Portal> outside the dialog in the DOM.
							<DismissableLayer data-testid="nested-layer" />
						)}
					</Dialog.Content>
				</Dialog.Root>
			));

			expect(getByRole("dialog")).toBeTruthy();

			// Mount the nested layer
			fireEvent.click(getByRole("button", { name: "open nested" }));

			await waitFor(() => {
				expect(getByTestId("nested-layer")).toBeTruthy();
			});

			// The nested DismissableLayer should have registered itself in the
			// dialog's DismissableLayerContext and appear in nestedLayersSignal().
			// Verify it is NOT aria-hidden (it was included in targets).
			expect(getByTestId("nested-layer")).not.toHaveAttribute(
				"aria-hidden",
				"true",
			);
		});
	});
});
