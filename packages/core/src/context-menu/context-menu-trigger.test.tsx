import { fireEvent, render } from "@solidjs/testing-library";

import * as ContextMenu from ".";

// https://github.com/kobaltedev/kobalte/issues/646
describe("ContextMenuTrigger onContextMenu", () => {
	it("calls a provided onContextMenu handler when the trigger is not disabled", () => {
		const onContextMenu = vi.fn();
		const onOpenChange = vi.fn();

		const { getByText } = render(() => (
			<ContextMenu.Root onOpenChange={onOpenChange}>
				<ContextMenu.Trigger onContextMenu={onContextMenu}>
					Target
				</ContextMenu.Trigger>
			</ContextMenu.Root>
		));

		fireEvent.contextMenu(getByText("Target"));

		expect(onContextMenu).toHaveBeenCalledTimes(1);
		// The default behavior (opening the menu) is still preserved.
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("calls a provided onContextMenu handler when the trigger is disabled", () => {
		const onContextMenu = vi.fn();

		const { getByText } = render(() => (
			<ContextMenu.Root>
				<ContextMenu.Trigger disabled onContextMenu={onContextMenu}>
					Target
				</ContextMenu.Trigger>
			</ContextMenu.Root>
		));

		fireEvent.contextMenu(getByText("Target"));

		expect(onContextMenu).toHaveBeenCalledTimes(1);
	});

	it("does not open the menu when the consumer calls preventDefault", () => {
		const onOpenChange = vi.fn();

		const { getByText } = render(() => (
			<ContextMenu.Root onOpenChange={onOpenChange}>
				<ContextMenu.Trigger onContextMenu={(e) => e.preventDefault()}>
					Target
				</ContextMenu.Trigger>
			</ContextMenu.Root>
		));

		fireEvent.contextMenu(getByText("Target"));

		expect(onOpenChange).not.toHaveBeenCalled();
	});
});
