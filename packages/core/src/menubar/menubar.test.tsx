import { fireEvent, render } from "@solidjs/testing-library";

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
	it.skip("renders correctly", async () => {
		// Can't be tested as jsdom doesn't support onPointer events.
		// Test code should be valid for the future.

		const { getByText, queryByText } = render(commonUI);

		expect(getByText("Test 1")).toBeVisible();
		expect(getByText("Test 2")).toBeVisible();
		expect(getByText("Test 3")).toBeVisible();

		getByText("Test 1").click();

		expect(getByText("Test 1")).toHaveAttribute("data-highlighted", "true");

		expect(getByText("Item 1")).toBeVisible();
		expect(getByText("Item 2")).toBeVisible();
		expect(getByText("Sub 3")).toBeVisible();

		getByText("Test 2").click();

		expect(getByText("Test 1")).not.toHaveAttribute("data-highlighted", "true");
		expect(getByText("Test 2")).toHaveAttribute("data-highlighted", "true");

		expect(queryByText("Item 1")).not.toBeInTheDocument();
		expect(queryByText("Item 2")).not.toBeInTheDocument();
		expect(queryByText("Sub 3")).not.toBeInTheDocument();

		expect(getByText("Item A")).toBeVisible();
		expect(getByText("Item B")).toBeVisible();
		expect(getByText("Sub C")).toBeVisible();

		fireEvent.click(getByText("Sub C"));

		expect(getByText("Item D")).toBeVisible();
		expect(getByText("Item E")).toBeVisible();

		fireEvent.click(getByText("External"));

		expect(getByText("Test 2")).not.toHaveAttribute("data-highlighted", "true");

		expect(queryByText("Item A")).not.toBeInTheDocument();
		expect(queryByText("Item B")).not.toBeInTheDocument();
		expect(queryByText("Sub C")).not.toBeInTheDocument();
	});

	it.skip("handles keyboard navigation correctly", async () => {
		// Can't be tested as jsdom doesn't support onPointer events.
		// Test code should be valid for the future.

		const { getByText, queryByText } = render(commonUI);

		expect(getByText("Test 1")).toHaveAttribute("tabindex", "0");
		expect(getByText("Test 2")).toHaveAttribute("tabindex", "-1");
		expect(getByText("Test 3")).toHaveAttribute("tabindex", "-1");

		expect(getByText("Test 1")).not.toHaveAttribute("data-highlighted", "true");

		fireEvent.focus(getByText("Test 1"));

		expect(queryByText("Item 1")).not.toBeInTheDocument();

		expect(getByText("Test 1")).toHaveAttribute("data-highlighted", "true");

		fireEvent.keyPress(getByText("Test 1"), {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(queryByText("Item A")).not.toBeInTheDocument();

		expect(getByText("Test 1")).not.toHaveAttribute("data-highlighted", "true");
		expect(getByText("Test 2")).toHaveAttribute("data-highlighted", "true");

		expect(getByText("Test 1")).toHaveAttribute("tabindex", "-1");
		expect(getByText("Test 2")).toHaveAttribute("tabindex", "0");

		expect(getByText("Test 2")).toHaveFocus();

		fireEvent.keyPress(getByText("Test 2"), {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(queryByText("Item Z")).not.toBeInTheDocument();

		expect(getByText("Test 2")).not.toHaveAttribute("data-highlighted", "true");
		expect(getByText("Test 3")).toHaveAttribute("data-highlighted", "true");

		expect(getByText("Test 2")).toHaveAttribute("tabindex", "-1");
		expect(getByText("Test 3")).toHaveAttribute("tabindex", "0");

		expect(getByText("Test 3")).toHaveFocus();

		fireEvent.keyPress(getByText("Test 3"), {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(getByText("Test 1")).toHaveFocus();

		fireEvent.keyPress(getByText("Test 1"), {
			key: "ArrowDown",
			code: "ArrowDown",
		});

		expect(getByText("Item 1")).toBeVisible();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(getByText("Item A")).toBeVisible();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowDown",
			code: "ArrowDown",
		});

		expect(getByText("Item A")).toHaveFocus();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowDown",
			code: "ArrowDown",
		});
		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowDown",
			code: "ArrowDown",
		});

		expect(getByText("Sub C")).toHaveFocus();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(getByText("Item D")).toHaveFocus();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowLeft",
			code: "ArrowLeft",
		});

		expect(getByText("Sub C")).toHaveFocus();

		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});
		fireEvent.keyPress(document.activeElement as Element, {
			key: "ArrowRight",
			code: "ArrowRight",
		});

		expect(getByText("Item Z")).toBeVisible();
	});

	it.skip("handles hover correctly", async () => {
		// Can't be tested as jsdom doesn't support onPointer events.
		// Test code should be valid for the future.

		const { getByText, queryByText } = render(commonUI);

		fireEvent.mouseEnter(getByText("Test 2"));

		expect(getByText("Test 1")).toHaveAttribute("tabindex", "0");

		expect(queryByText("Item A")).not.toBeInTheDocument();

		getByText("Test 1").click();

		expect(getByText("Item 1")).toBeVisible();

		getByText("Test 2").click();

		expect(queryByText("Item 1")).not.toBeInTheDocument();
		expect(getByText("Item A")).toBeVisible();
	});
});
