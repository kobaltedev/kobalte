/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/collapsible/src/Collapsible.test.tsx
 */

import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { ComponentProps } from "solid-js";

import * as Collapsible from ".";

const TRIGGER_TEXT = "Trigger";
const CONTENT_TEXT = "Content";

const Example = (props: ComponentProps<typeof Collapsible.Root>) => (
	<Collapsible.Root {...props}>
		<Collapsible.Trigger>{TRIGGER_TEXT}</Collapsible.Trigger>
		<Collapsible.Content>{CONTENT_TEXT}</Collapsible.Content>
	</Collapsible.Root>
);

describe("Collapsible", () => {
	installPointerEvent();

	it("should toggle between open/close the content when clicking the trigger", async () => {
		render(() => <Example />);

		const trigger = screen.getByText(TRIGGER_TEXT);

		fireEvent.click(trigger);
		await Promise.resolve();

		const content = screen.queryByText(CONTENT_TEXT);
		expect(content).toBeVisible();

		fireEvent.click(trigger);
		await Promise.resolve();

		expect(content).not.toBeVisible();
	});

	it("should not open the content when clicking the trigger if disabled", async () => {
		render(() => <Example disabled />);

		const trigger = screen.getByText(TRIGGER_TEXT);

		fireEvent.click(trigger);
		await Promise.resolve();

		const content = screen.queryByText(CONTENT_TEXT);
		expect(content).toBeNull();
	});

	it("should close content when clicking the trigger and collapsible is open uncontrolled", async () => {
		const onOpenChangeSpy = jest.fn();

		render(() => <Example defaultOpen onOpenChange={onOpenChangeSpy} />);

		const trigger = screen.getByText(TRIGGER_TEXT);
		const content = screen.getByText(CONTENT_TEXT);

		fireEvent.click(trigger);
		await Promise.resolve();

		expect(content).not.toBeVisible();
		expect(onOpenChangeSpy).toHaveBeenCalledWith(false);
	});

	it("should not close content when clicking the trigger and collapsible is open controlled", async () => {
		const onOpenChangeSpy = jest.fn();

		render(() => <Example open onOpenChange={onOpenChangeSpy} />);

		const trigger = screen.getByText(TRIGGER_TEXT);
		const content = screen.getByText(CONTENT_TEXT);

		fireEvent.click(trigger);
		await Promise.resolve();

		expect(content).toBeVisible();
		expect(onOpenChangeSpy).toHaveBeenCalledWith(false);
	});
});
