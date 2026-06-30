import { render } from "@solidjs/testing-library";
import * as Dialog from "/Users/ddibiase/Projects/kobalte/packages/core/src/dialog";

describe("minimal dialog", () => {
	it("simple render", () => {
		const { getByRole } = render(() => (
			<Dialog.Root open>
				<Dialog.Content>
					<Dialog.Title>title</Dialog.Title>
				</Dialog.Content>
			</Dialog.Root>
		));

		expect(getByRole("dialog")).toBeTruthy();
	});
});
