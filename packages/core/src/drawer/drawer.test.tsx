import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render } from "@solidjs/testing-library";
import type { ComponentProps } from "solid-js";
import { vi } from "vitest";

import * as Drawer from ".";

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

const DrawerExample = (props: ComponentProps<typeof Drawer.Root>) => (
	<Drawer.Root {...props}>
		<Drawer.Trigger data-testid="trigger">Open</Drawer.Trigger>
		<Drawer.Content data-testid="content">
			<Drawer.Title>Drawer</Drawer.Title>
			<Drawer.CloseButton data-testid="close">Close</Drawer.CloseButton>
		</Drawer.Content>
	</Drawer.Root>
);

describe("Drawer", () => {
	installPointerEvent();

	it("does not render content when closed", () => {
		const { queryByTestId } = render(() => <DrawerExample />);
		expect(queryByTestId("content")).toBeNull();
	});

	it("renders content when open", () => {
		const { getByTestId } = render(() => <DrawerExample open />);
		expect(getByTestId("content")).toBeInTheDocument();
	});

	it("opens when trigger is clicked", async () => {
		const { getByTestId, queryByTestId } = render(() => <DrawerExample />);
		expect(queryByTestId("content")).toBeNull();

		fireEvent.click(getByTestId("trigger"));
		await Promise.resolve();

		expect(getByTestId("content")).toBeInTheDocument();
	});

	it("fires onOpenChange(true) when trigger opens the drawer", async () => {
		const onOpenChange = vi.fn();
		const { getByTestId } = render(() => (
			<DrawerExample onOpenChange={onOpenChange} />
		));

		fireEvent.click(getByTestId("trigger"));
		await Promise.resolve();

		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("fires onOpenChange(false) when close button is clicked", async () => {
		const onOpenChange = vi.fn();
		const { getByTestId } = render(() => (
			<DrawerExample defaultOpen onOpenChange={onOpenChange} />
		));

		fireEvent.click(getByTestId("close"));
		await Promise.resolve();

		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("fires onOpenChange(false) when Escape is pressed", async () => {
		const onOpenChange = vi.fn();
		const { getByTestId } = render(() => (
			<DrawerExample defaultOpen onOpenChange={onOpenChange} />
		));

		fireEvent.keyDown(getByTestId("content"), { key: "Escape" });
		await Promise.resolve();

		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("content has role='dialog'", () => {
		const { getByRole } = render(() => <DrawerExample open />);
		expect(getByRole("dialog")).toBeInTheDocument();
	});

	it("content is labelled by its title", () => {
		const { getByRole, getByText } = render(() => <DrawerExample open />);
		const dialog = getByRole("dialog");
		const title = getByText("Drawer");
		expect(dialog).toHaveAttribute("aria-labelledby", title.id);
	});

	it("trigger has aria-expanded=false when closed", () => {
		const { getByTestId } = render(() => <DrawerExample />);
		expect(getByTestId("trigger")).toHaveAttribute("aria-expanded", "false");
	});

	it("trigger has aria-expanded=true when open", async () => {
		const { getByTestId } = render(() => <DrawerExample />);
		fireEvent.click(getByTestId("trigger"));
		await Promise.resolve();
		expect(getByTestId("trigger")).toHaveAttribute("aria-expanded", "true");
	});
});
