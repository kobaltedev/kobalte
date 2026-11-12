import { render, waitFor } from "@solidjs/testing-library";
import { createSignal } from "solid-js";

import * as Popper from ".";
import * as Popover from "../popover";

describe("Popper", () => {
	it("calls `onPositionChange` with the computed position and the positioner", async () => {
		const onPositionChange = vi.fn();

		const [anchor, setAnchor] = createSignal<HTMLElement>();
		const [content, setContent] = createSignal<HTMLElement>();

		render(() => (
			<>
				<div ref={setAnchor} data-testid="anchor" />
				<Popper.Root
					anchorRef={anchor}
					contentRef={content}
					placement="bottom"
					onPositionChange={onPositionChange}
				>
					<Popper.Positioner data-testid="positioner">
						<div ref={setContent} />
					</Popper.Positioner>
				</Popper.Root>
			</>
		));

		await waitFor(() => expect(onPositionChange).toHaveBeenCalled());

		const [position, positioner] = onPositionChange.mock.calls[0];

		expect(positioner).toHaveAttribute("data-testid", "positioner");
		expect(position.placement).toBe("bottom");
		expect(position).toHaveProperty("x");
		expect(position).toHaveProperty("y");
		expect(position.middlewareData).toBeDefined();
	});

	it("is forwarded by components built on Popper", async () => {
		const onPositionChange = vi.fn();

		render(() => (
			<Popover.Root defaultOpen onPositionChange={onPositionChange}>
				<Popover.Trigger>Open</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content>Content</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		));

		await waitFor(() => expect(onPositionChange).toHaveBeenCalled());
	});
});
