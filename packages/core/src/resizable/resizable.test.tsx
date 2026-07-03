import { render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as Resizable from ".";

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

const ResizableExample = () => (
	<Resizable.Root data-testid="root">
		<Resizable.Panel data-testid="panel-1" initialSize={0.5}>
			Panel 1
		</Resizable.Panel>
		<Resizable.Handle data-testid="handle" />
		<Resizable.Panel data-testid="panel-2" initialSize={0.5}>
			Panel 2
		</Resizable.Panel>
	</Resizable.Root>
);

describe("Resizable", () => {
	it("root has data-orientation='horizontal' by default", () => {
		const { getByTestId } = render(() => <ResizableExample />);
		expect(getByTestId("root")).toHaveAttribute("data-orientation", "horizontal");
	});

	it("root has data-orientation='vertical' when specified", () => {
		const { getByTestId } = render(() => (
			<Resizable.Root data-testid="root" orientation="vertical">
				<Resizable.Panel initialSize={0.5}>Panel 1</Resizable.Panel>
				<Resizable.Handle />
				<Resizable.Panel initialSize={0.5}>Panel 2</Resizable.Panel>
			</Resizable.Root>
		));
		expect(getByTestId("root")).toHaveAttribute("data-orientation", "vertical");
	});

	it("renders panels", () => {
		const { getByTestId } = render(() => <ResizableExample />);
		expect(getByTestId("panel-1")).toBeInTheDocument();
		expect(getByTestId("panel-2")).toBeInTheDocument();
	});

	it("renders panel content", () => {
		const { getByText } = render(() => <ResizableExample />);
		expect(getByText("Panel 1")).toBeInTheDocument();
		expect(getByText("Panel 2")).toBeInTheDocument();
	});

	it("handle has role='separator'", () => {
		const { getByRole } = render(() => <ResizableExample />);
		expect(getByRole("separator")).toBeInTheDocument();
	});

	it("handle has aria-orientation='horizontal' by default", () => {
		const { getByRole } = render(() => <ResizableExample />);
		expect(getByRole("separator")).toHaveAttribute(
			"aria-orientation",
			"horizontal",
		);
	});

	it("handle has aria-orientation='vertical' when root is vertical", () => {
		const { getByRole } = render(() => (
			<Resizable.Root orientation="vertical">
				<Resizable.Panel initialSize={0.5}>Panel 1</Resizable.Panel>
				<Resizable.Handle />
				<Resizable.Panel initialSize={0.5}>Panel 2</Resizable.Panel>
			</Resizable.Root>
		));
		expect(getByRole("separator")).toHaveAttribute(
			"aria-orientation",
			"vertical",
		);
	});

	it("panels have data-orientation matching root", () => {
		const { getByTestId } = render(() => <ResizableExample />);
		expect(getByTestId("panel-1")).toHaveAttribute(
			"data-orientation",
			"horizontal",
		);
	});

	it("accepts onSizesChange as a controlled prop", () => {
		const onSizesChange = vi.fn();
		const { getByTestId } = render(() => (
			<Resizable.Root
				data-testid="root"
				sizes={[0.5, 0.5]}
				onSizesChange={onSizesChange}
			>
				<Resizable.Panel>Panel 1</Resizable.Panel>
				<Resizable.Handle />
				<Resizable.Panel>Panel 2</Resizable.Panel>
			</Resizable.Root>
		));
		expect(getByTestId("root")).toBeInTheDocument();
	});
});
