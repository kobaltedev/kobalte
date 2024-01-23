import { fireEvent, render, screen } from "@solidjs/testing-library";

import * as Menubar from ".";

const commonUI = () => (
	<>
		<Menubar.Root>
			<Menubar.Menu value="test-1-menu">
				<Menubar.Trigger>Test 1</Menubar.Trigger>

				<Menubar.Portal>
					<Menubar.Content>
						<Menubar.Item>Item 1</Menubar.Item>

						<Menubar.Item>Item 2</Menubar.Item>

						<Menubar.Sub>
							<Menubar.SubTrigger>{"Sub 3 >"}</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent>
									<Menubar.Item>Item 4</Menubar.Item>

									<Menubar.Item>Item 5</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>

			<Menubar.Menu value="test-2-menu">
				<Menubar.Trigger>Test 2</Menubar.Trigger>

				<Menubar.Portal>
					<Menubar.Content>
						<Menubar.Item>Item A</Menubar.Item>

						<Menubar.Item>Item B</Menubar.Item>

						<Menubar.Sub>
							<Menubar.SubTrigger>{"Sub C >"}</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent>
									<Menubar.Item>Item D</Menubar.Item>

									<Menubar.Item>Item E</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>

			<Menubar.Menu value="test-3-menu">
				<Menubar.Trigger>Test 3</Menubar.Trigger>

				<Menubar.Portal>
					<Menubar.Content>
						<Menubar.Item>Item Z</Menubar.Item>

						<Menubar.Item>Item Y</Menubar.Item>

						<Menubar.Sub>
							<Menubar.SubTrigger>{"Sub X >"}</Menubar.SubTrigger>
							<Menubar.Portal>
								<Menubar.SubContent>
									<Menubar.Item>Item W</Menubar.Item>

									<Menubar.Item>Item V</Menubar.Item>
								</Menubar.SubContent>
							</Menubar.Portal>
						</Menubar.Sub>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu>
		</Menubar.Root>

		<span>External</span>
	</>
);

describe("Menubar", () => {
	it("renders correctly", async () => {
		// Can't be tested as jsdom doesn't support onPointer events.
		// Test code should be valid for the future.
		// biome-ignore lint/correctness/noConstantCondition: disabled code
		if (true) return;

		render(commonUI);

		expect(screen.getByText("Test 1")).toBeVisible();
		expect(screen.getByText("Test 2")).toBeVisible();
		expect(screen.getByText("Test 3")).toBeVisible();

		screen.getByText("Test 1").click();

		expect(screen.getByText("Test 1")).toHaveAttribute(
			"data-highlighted",
			"true",
		);

		expect(screen.getByText("Item 1")).toBeVisible();
		expect(screen.getByText("Item 2")).toBeVisible();
		expect(screen.getByText("Sub 3")).toBeVisible();

		screen.getByText("Test 2").click();

		expect(screen.getByText("Test 1")).not.toHaveAttribute(
			"data-highlighted",
			"true",
		);
		expect(screen.getByText("Test 2")).toHaveAttribute(
			"data-highlighted",
			"true",
		);

		expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
		expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
		expect(screen.queryByText("Sub 3")).not.toBeInTheDocument();

		expect(screen.getByText("Item A")).toBeVisible();
		expect(screen.getByText("Item B")).toBeVisible();
		expect(screen.getByText("Sub C")).toBeVisible();

		fireEvent.click(screen.getByText("Sub C"));

		expect(screen.getByText("Item D")).toBeVisible();
		expect(screen.getByText("Item E")).toBeVisible();

		fireEvent.click(screen.getByText("External"));

		expect(screen.getByText("Test 2")).not.toHaveAttribute(
			"data-highlighted",
			"true",
		);

		expect(screen.queryByText("Item A")).not.toBeInTheDocument();
		expect(screen.queryByText("Item B")).not.toBeInTheDocument();
		expect(screen.queryByText("Sub C")).not.toBeInTheDocument();
	});

	it("handles keyboard navigation correctly", async () => {
		// Can't be tested as jsdom doesn't support onPointer events.
		// Test code should be valid for the future.
		// biome-ignore lint/correctness/noConstantCondition: disabled code
		if (true) return;

		render(commonUI);

		expect(screen.getByText("Test 1")).toHaveAttribute("tabindex", "0");
		expect(screen.getByText("Test 2")).toHaveAttribute("tabindex", "-1");
		expect(screen.getByText("Test 3")).toHaveAttribute("tabindex", "-1");

		expect(screen.getByText("Test 1")).not.toHaveAttribute(
			"data-highlighted",
			"true",
		);

		fireEvent.focus(screen.getByText("Test 1"));

		expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

		expect(screen.getByText("Test 1")).toHaveAttribute(
			"data-highlighted",
			"true",
		);

		fireEvent.keyPress(screen.getByText("Test 1"), {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(screen.queryByText("Item A")).not.toBeInTheDocument();

		expect(screen.getByText("Test 1")).not.toHaveAttribute(
			"data-highlighted",
			"true",
		);
		expect(screen.getByText("Test 2")).toHaveAttribute(
			"data-highlighted",
			"true",
		);

		expect(screen.getByText("Test 1")).toHaveAttribute("tabindex", "-1");
		expect(screen.getByText("Test 2")).toHaveAttribute("tabindex", "0");

		expect(screen.getByText("Test 2")).toHaveFocus();

		fireEvent.keyPress(screen.getByText("Test 2"), {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(screen.queryByText("Item Z")).not.toBeInTheDocument();

		expect(screen.getByText("Test 2")).not.toHaveAttribute(
			"data-highlighted",
			"true",
		);
		expect(screen.getByText("Test 3")).toHaveAttribute(
			"data-highlighted",
			"true",
		);

		expect(screen.getByText("Test 2")).toHaveAttribute("tabindex", "-1");
		expect(screen.getByText("Test 3")).toHaveAttribute("tabindex", "0");

		expect(screen.getByText("Test 3")).toHaveFocus();

		fireEvent.keyPress(screen.getByText("Test 3"), {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(screen.getByText("Test 1")).toHaveFocus();

		fireEvent.keyPress(screen.getByText("Test 1"), {
			key: "ArrowDown",
			code: "ArrowDown",
		});

		expect(screen.getByText("Item 1")).toBeVisible();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(screen.getByText("Item A")).toBeVisible();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowDown",
			code: "ArrowDown",
		});

		expect(screen.getByText("Item A")).toHaveFocus();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowDown",
			code: "ArrowDown",
		});
		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowDown",
			code: "ArrowDown",
		});

		expect(screen.getByText("Sub C")).toHaveFocus();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(screen.getByText("Item D")).toHaveFocus();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowLeft",
			code: "ArrowLeft",
		});

		expect(screen.getByText("Sub C")).toHaveFocus();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});
		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(screen.getByText("Item Z")).toBeVisible();
	});

	it("handles hover correctly", async () => {
		// Can't be tested as jsdom doesn't support onPointer events.
		// Test code should be valid for the future.
		// biome-ignore lint/correctness/noConstantCondition: disabled code
		if (true) return;

		render(commonUI);

		fireEvent.mouseEnter(screen.getByText("Test 2"));

		expect(screen.getByText("Test 1")).toHaveAttribute("tabindex", "0");

		expect(screen.queryByText("Item A")).not.toBeInTheDocument();

		screen.getByText("Test 1").click();

		expect(screen.getByText("Item 1")).toBeVisible();

		screen.getByText("Test 2").click();

		expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
		expect(screen.getByText("Item A")).toBeVisible();
	});
});
