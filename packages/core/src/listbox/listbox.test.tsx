/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-spectrum/listbox/test/Listbox.test.js
 */

import { createPointerEvent } from "@kobalte/tests";
import { fireEvent, render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as Listbox from ".";

const DATA_SOURCE = [
	{ key: "1", label: "One", textValue: "One", disabled: false },
	{ key: "2", label: "Two", textValue: "Two", disabled: false },
	{ key: "3", label: "Three", textValue: "Three", disabled: false },
];

describe("Listbox", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			cb(0);
			return 0;
		});
	});

	afterEach(() => {
		// @ts-ignore
		window.requestAnimationFrame.mockRestore();
		vi.clearAllTimers();
	});

	it("renders properly", () => {
		const { getByRole, getAllByRole } = render(() => (
			<Listbox.Root
				options={DATA_SOURCE}
				selectionMode="single"
				renderItem={(item) => (
					<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
				)}
			/>
		));

		const listbox = getByRole("listbox");
		const options = getAllByRole("option");

		expect(listbox).toBeInTheDocument();

		expect(options.length).toBe(3);

		for (const option of options) {
			expect(option).toBeInTheDocument();
			expect(option).toHaveAttribute("tabindex");
			expect(option).toHaveAttribute("aria-selected", "false");
			expect(option).toHaveAttribute("aria-disabled", "false");
		}
	});

	it("allows user to change option focus via up/down arrow keys", async () => {
		const { getByRole, getAllByRole } = render(() => (
			<Listbox.Root
				options={DATA_SOURCE}
				renderItem={(item) => (
					<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
				)}
			/>
		));

		const listbox = getByRole("listbox");
		const options = getAllByRole("option");

		fireEvent.focusIn(listbox);
		await Promise.resolve();

		expect(document.activeElement).toBe(options[0]);

		fireEvent.keyDown(listbox, { key: "ArrowDown" });
		await Promise.resolve();

		expect(document.activeElement).toBe(options[1]);

		fireEvent.keyDown(listbox, { key: "ArrowUp" });
		await Promise.resolve();

		expect(document.activeElement).toBe(options[0]);
	});

	it("wraps focus from first to last/last to first option if up/down arrow is pressed if shouldFocusWrap is true", async () => {
		const { getByRole, getAllByRole } = render(() => (
			<Listbox.Root
				options={DATA_SOURCE}
				shouldFocusWrap
				renderItem={(item) => (
					<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
				)}
			/>
		));

		const listbox = getByRole("listbox");
		const options = getAllByRole("option");

		fireEvent.focusIn(listbox);
		await Promise.resolve();

		expect(document.activeElement).toBe(options[0]);

		fireEvent.keyDown(listbox, { key: "ArrowUp" });
		await Promise.resolve();

		expect(document.activeElement).toBe(options[2]);

		fireEvent.keyDown(listbox, { key: "ArrowDown" });
		await Promise.resolve();

		expect(document.activeElement).toBe(options[0]);
	});

	describe("option mapping", () => {
		const CUSTOM_DATA_SOURCE = [
			{
				name: "Section 1",
				items: [
					{ id: "1", name: "One", valueText: "One", disabled: false },
					{ id: "2", name: "Two", valueText: "Two", disabled: true },
					{ id: "3", name: "Three", valueText: "Three", disabled: false },
				],
			},
		];

		it("supports string based option mapping for object options", async () => {
			const { getAllByRole } = render(() => (
				<Listbox.Root<any, any>
					options={CUSTOM_DATA_SOURCE}
					optionValue="id"
					optionTextValue="valueText"
					optionDisabled="disabled"
					optionGroupChildren="items"
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.name}</Listbox.Item>
					)}
					renderSection={(section) => (
						<Listbox.Section>{section.rawValue.name}</Listbox.Section>
					)}
				/>
			));

			const items = getAllByRole("option");

			expect(items.length).toBe(3);

			expect(items[0]).toHaveTextContent("One");
			expect(items[0]).toHaveAttribute("data-key", "1");
			expect(items[0]).not.toHaveAttribute("data-disabled");

			expect(items[1]).toHaveTextContent("Two");
			expect(items[1]).toHaveAttribute("data-key", "2");
			expect(items[1]).toHaveAttribute("data-disabled");

			expect(items[2]).toHaveTextContent("Three");
			expect(items[2]).toHaveAttribute("data-key", "3");
			expect(items[2]).not.toHaveAttribute("data-disabled");
		});

		it("supports function based option mapping for object options", async () => {
			const { getAllByRole } = render(() => (
				<Listbox.Root<any, any>
					options={CUSTOM_DATA_SOURCE}
					optionValue={(option) => option.id}
					optionTextValue={(option) => option.valueText}
					optionDisabled={(option) => option.disabled}
					optionGroupChildren={(optGroup) => optGroup.items}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.name}</Listbox.Item>
					)}
					renderSection={(section) => (
						<Listbox.Section>{section.rawValue.name}</Listbox.Section>
					)}
				/>
			));

			const items = getAllByRole("option");

			expect(items.length).toBe(3);

			expect(items[0]).toHaveTextContent("One");
			expect(items[0]).toHaveAttribute("data-key", "1");
			expect(items[0]).not.toHaveAttribute("data-disabled");

			expect(items[1]).toHaveTextContent("Two");
			expect(items[1]).toHaveAttribute("data-key", "2");
			expect(items[1]).toHaveAttribute("data-disabled");

			expect(items[2]).toHaveTextContent("Three");
			expect(items[2]).toHaveAttribute("data-key", "3");
			expect(items[2]).not.toHaveAttribute("data-disabled");
		});

		it("supports function based option mapping for string options", async () => {
			const { getAllByRole } = render(() => (
				<Listbox.Root
					options={["One", "Two", "Three"]}
					optionValue={(option) => option}
					optionTextValue={(option) => option}
					optionDisabled={(option) => option === "Two"}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue}</Listbox.Item>
					)}
				/>
			));

			const items = getAllByRole("option");

			expect(items.length).toBe(3);

			expect(items[0]).toHaveTextContent("One");
			expect(items[0]).toHaveAttribute("data-key", "One");
			expect(items[0]).not.toHaveAttribute("data-disabled");

			expect(items[1]).toHaveTextContent("Two");
			expect(items[1]).toHaveAttribute("data-key", "Two");
			expect(items[1]).toHaveAttribute("data-disabled");

			expect(items[2]).toHaveTextContent("Three");
			expect(items[2]).toHaveAttribute("data-key", "Three");
			expect(items[2]).not.toHaveAttribute("data-disabled");
		});
	});

	describe("supports single selection", () => {
		it("supports defaultValue (uncontrolled)", async () => {
			const defaultValue = new Set(["2"]);

			const { getByRole, getAllByRole } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					selectionMode="single"
					defaultValue={defaultValue}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const listbox = getByRole("listbox");
			const options = getAllByRole("option");
			const selectedItem = options[1];

			fireEvent.focusIn(listbox);
			await Promise.resolve();

			expect(document.activeElement).toBe(selectedItem);
			expect(selectedItem).toHaveAttribute("aria-selected", "true");
			expect(selectedItem).toHaveAttribute("tabindex", "0");
		});

		it("supports value (controlled)", async () => {
			const value = new Set(["2"]);
			const onValueChangeSpy = vi.fn();

			const { getByRole, getAllByRole } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					selectionMode="single"
					value={value}
					onChange={onValueChangeSpy}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const listbox = getByRole("listbox");
			const options = getAllByRole("option");
			const selectedItem = options[1];

			fireEvent.focusIn(listbox);
			await Promise.resolve();

			expect(document.activeElement).toBe(selectedItem);
			expect(selectedItem).toHaveAttribute("aria-selected", "true");
			expect(selectedItem).toHaveAttribute("tabindex", "0");

			const nextSelectedItem = options[2];

			// Try select a different option via enter
			fireEvent.keyDown(nextSelectedItem, { key: "Enter" });
			await Promise.resolve();

			// Since Listbox is controlled, selection doesn't change
			expect(nextSelectedItem).toHaveAttribute("aria-selected", "false");
			expect(selectedItem).toHaveAttribute("aria-selected", "true");

			expect(onValueChangeSpy).toBeCalledTimes(1);
			expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
		});

		it("supports using space key to change option selection", async () => {
			const onValueChangeSpy = vi.fn();

			const { getByRole, getAllByRole } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					selectionMode="single"
					onChange={onValueChangeSpy}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const listbox = getByRole("listbox");
			const options = getAllByRole("option");

			fireEvent.focusIn(listbox);
			await Promise.resolve();

			const nextSelectedItem = options[2];

			// Select an option via space bar
			fireEvent.keyDown(nextSelectedItem, { key: " " });
			await Promise.resolve();

			expect(nextSelectedItem).toHaveAttribute("aria-selected", "true");

			expect(onValueChangeSpy).toBeCalledTimes(1);
			expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
		});

		it("supports using pointer up to change option selection", async () => {
			const onValueChangeSpy = vi.fn();

			const { getByRole, getAllByRole } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					selectionMode="single"
					onChange={onValueChangeSpy}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const listbox = getByRole("listbox");
			const options = getAllByRole("option");

			fireEvent.focusIn(listbox);
			await Promise.resolve();

			const nextSelectedItem = options[2];

			fireEvent(
				nextSelectedItem,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				nextSelectedItem,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(nextSelectedItem).toHaveAttribute("aria-selected", "true");

			expect(onValueChangeSpy).toBeCalledTimes(1);
			expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
		});

		it("supports disabled options", async () => {
			const onValueChangeSpy = vi.fn();

			const dataSource = [
				{ key: "1", label: "One", textValue: "One", disabled: false },
				{ key: "2", label: "Two", textValue: "Two", disabled: true },
				{ key: "3", label: "Three", textValue: "Three", disabled: false },
			];

			const { getByRole, getAllByRole } = render(() => (
				<Listbox.Root
					options={dataSource}
					selectionMode="single"
					onChange={onValueChangeSpy}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const listbox = getByRole("listbox");
			const options = getAllByRole("option");

			const disabledItem = options[1];

			expect(disabledItem).toHaveAttribute("aria-disabled", "true");

			// Try select the disabled option
			fireEvent(
				disabledItem,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				disabledItem,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			// Verify onValueChange is not called
			expect(onValueChangeSpy).not.toHaveBeenCalled();

			fireEvent.focusIn(listbox);
			await Promise.resolve();

			expect(document.activeElement).toBe(options[0]);

			fireEvent.keyDown(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			// Verify that keyboard navigation skips the disabled option
			expect(document.activeElement).toBe(options[2]);
		});
	});

	describe("supports multi selection", () => {
		it("supports selecting multiple options", async () => {
			const onValueChangeSpy = vi.fn();

			const { getByRole, getAllByRole } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					selectionMode="multiple"
					onChange={onValueChangeSpy}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const listbox = getByRole("listbox");
			const options = getAllByRole("option");

			expect(listbox).toHaveAttribute("aria-multiselectable", "true");

			fireEvent(
				options[0],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				options[0],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			fireEvent(
				options[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				options[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(options[0]).toHaveAttribute("aria-selected", "true");
			expect(options[2]).toHaveAttribute("aria-selected", "true");

			expect(onValueChangeSpy).toBeCalledTimes(2);
			expect(onValueChangeSpy.mock.calls[0][0].has("1")).toBeTruthy();
			expect(onValueChangeSpy.mock.calls[1][0].has("3")).toBeTruthy();
		});

		it("supports multiple defaultValue (uncontrolled)", async () => {
			const onValueChangeSpy = vi.fn();

			const defaultValue = new Set(["1", "2"]);

			const { getAllByRole } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					selectionMode="multiple"
					defaultValue={defaultValue}
					onChange={onValueChangeSpy}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const options = getAllByRole("option");

			const firstItem = options[0];
			const secondItem = options[1];
			const thirdItem = options[2];

			expect(firstItem).toHaveAttribute("aria-selected", "true");
			expect(secondItem).toHaveAttribute("aria-selected", "true");

			// Select a different option
			fireEvent(
				thirdItem,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				thirdItem,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(thirdItem).toHaveAttribute("aria-selected", "true");

			expect(onValueChangeSpy).toBeCalledTimes(1);
			expect(onValueChangeSpy.mock.calls[0][0].has("1")).toBeTruthy();
			expect(onValueChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
			expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
		});

		it("supports multiple value (controlled)", async () => {
			const onValueChangeSpy = vi.fn();

			const value = new Set(["1", "2"]);

			const { getAllByRole } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					selectionMode="multiple"
					value={value}
					onChange={onValueChangeSpy}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const options = getAllByRole("option");

			const firstItem = options[0];
			const secondItem = options[1];
			const thirdItem = options[2];

			expect(firstItem).toHaveAttribute("aria-selected", "true");
			expect(secondItem).toHaveAttribute("aria-selected", "true");

			// Select a different option
			fireEvent(
				thirdItem,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				thirdItem,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(thirdItem).toHaveAttribute("aria-selected", "false");

			expect(onValueChangeSpy).toBeCalledTimes(1);
			expect(onValueChangeSpy.mock.calls[0][0].has("3")).toBeTruthy();
		});

		it("supports deselection", async () => {
			const onValueChangeSpy = vi.fn();

			const defaultValue = new Set(["1", "2"]);

			const { getAllByRole } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					selectionMode="multiple"
					defaultValue={defaultValue}
					onChange={onValueChangeSpy}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const options = getAllByRole("option");

			const firstItem = options[0];
			const secondItem = options[1];

			expect(firstItem).toHaveAttribute("aria-selected", "true");
			expect(secondItem).toHaveAttribute("aria-selected", "true");

			// Deselect first option
			fireEvent(
				firstItem,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				firstItem,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(firstItem).toHaveAttribute("aria-selected", "false");

			expect(onValueChangeSpy).toBeCalledTimes(1);
			expect(onValueChangeSpy.mock.calls[0][0].has("2")).toBeTruthy();
		});

		it("supports disabled options", async () => {
			const onValueChangeSpy = vi.fn();

			const defaultValue = new Set(["1", "2"]);

			const dataSource = [
				{ key: "1", label: "One", textValue: "One", disabled: false },
				{ key: "2", label: "Two", textValue: "Two", disabled: false },
				{ key: "3", label: "Three", textValue: "Three", disabled: true },
			];

			const { getAllByRole } = render(() => (
				<Listbox.Root
					options={dataSource}
					selectionMode="multiple"
					defaultValue={defaultValue}
					onChange={onValueChangeSpy}
					renderItem={(item) => (
						<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
					)}
				/>
			));

			const options = getAllByRole("option");

			const firstItem = options[0];
			const secondItem = options[1];
			const disabledItem = options[2];

			expect(disabledItem).toHaveAttribute("aria-disabled", "true");

			fireEvent(
				disabledItem,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				disabledItem,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChangeSpy).not.toHaveBeenCalled();

			expect(firstItem).toHaveAttribute("aria-selected", "true");
			expect(secondItem).toHaveAttribute("aria-selected", "true");
		});
	});

	it("supports empty selection when disallowEmptySelection is false", async () => {
		const onValueChangeSpy = vi.fn();

		const defaultValue = new Set(["2"]);

		const { getAllByRole } = render(() => (
			<Listbox.Root
				options={DATA_SOURCE}
				selectionMode="single"
				defaultValue={defaultValue}
				onChange={onValueChangeSpy}
				disallowEmptySelection={false}
				renderItem={(item) => (
					<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
				)}
			/>
		));

		const options = getAllByRole("option");

		const secondItem = options[1];

		expect(secondItem).toHaveAttribute("aria-selected", "true");

		// Deselect second option
		fireEvent(
			secondItem,
			createPointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }),
		);
		await Promise.resolve();

		fireEvent(
			secondItem,
			createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
		);
		await Promise.resolve();

		expect(secondItem).toHaveAttribute("aria-selected", "false");

		expect(onValueChangeSpy).toBeCalledTimes(1);
		expect(onValueChangeSpy.mock.calls[0][0].size === 0).toBeTruthy();
	});

	it("supports type to select", async () => {
		const { getByRole, getAllByRole } = render(() => (
			<Listbox.Root
				options={DATA_SOURCE}
				renderItem={(item) => (
					<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
				)}
			/>
		));

		const listbox = getByRole("listbox");
		const options = getAllByRole("option");

		fireEvent.focusIn(listbox);
		await Promise.resolve();

		expect(document.activeElement).toBe(options[0]);

		fireEvent.keyDown(listbox, { key: "T" });
		vi.runAllTimers();
		await Promise.resolve();

		expect(document.activeElement).toBe(options[1]);

		fireEvent.keyDown(listbox, { key: "O" });
		vi.runAllTimers();
		await Promise.resolve();

		expect(document.activeElement).toBe(options[0]);
	});

	it("resets the search text after a timeout", async () => {
		const { getByRole, getAllByRole } = render(() => (
			<Listbox.Root
				options={DATA_SOURCE}
				renderItem={(item) => (
					<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
				)}
			/>
		));

		const listbox = getByRole("listbox");
		const options = getAllByRole("option");

		fireEvent.focusIn(listbox);
		await Promise.resolve();

		fireEvent.keyDown(listbox, { key: "O" });
		vi.runAllTimers();
		await Promise.resolve();

		expect(document.activeElement).toBe(options[0]);

		fireEvent.keyDown(listbox, { key: "O" });
		vi.runAllTimers();
		await Promise.resolve();

		expect(document.activeElement).toBe(options[0]);
	});

	it("supports aria-label on options", () => {
		const dataSource = [
			{ key: "1", label: "One", textValue: "One", disabled: false },
		];

		const { getByRole } = render(() => (
			<Listbox.Root
				options={dataSource}
				renderItem={(item) => (
					<Listbox.Item item={item} aria-label="Item">
						{item.rawValue.label}
					</Listbox.Item>
				)}
			/>
		));

		vi.runAllTimers();

		const option = getByRole("option");

		expect(option).toHaveAttribute("aria-label", "Item");
		expect(option).not.toHaveAttribute("aria-labelledby");
		expect(option).not.toHaveAttribute("aria-describedby");
	});

	it("supports complex options with aria-labelledby and aria-describedby", async () => {
		const dataSource = [
			{
				key: "1",
				label: "Label",
				description: "Description",
				textValue: "One",
				disabled: false,
			},
		];

		const { getByRole, getByText } = render(() => (
			<Listbox.Root
				options={dataSource}
				renderItem={(item) => (
					<Listbox.Item item={item}>
						<Listbox.ItemLabel>{item.rawValue.label}</Listbox.ItemLabel>
						<Listbox.ItemDescription>
							{item.rawValue.description}
						</Listbox.ItemDescription>
					</Listbox.Item>
				)}
			/>
		));

		vi.runAllTimers();

		const option = getByRole("option");
		const label = getByText("Label");
		const description = getByText("Description");

		expect(option).toHaveAttribute("aria-labelledby", label.id);
		expect(option).toHaveAttribute("aria-describedby", description.id);
	});

	it("supports aria-label", () => {
		const { getByRole } = render(() => (
			<Listbox.Root
				options={DATA_SOURCE}
				aria-label="Test"
				renderItem={(item) => (
					<Listbox.Item item={item}>{item.rawValue.label}</Listbox.Item>
				)}
			/>
		));

		const listbox = getByRole("listbox");

		expect(listbox).toHaveAttribute("aria-label", "Test");
	});

	describe("item indicator", () => {
		it("should not display item indicator by default", async () => {
			const { queryByTestId } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					renderItem={(item) => (
						<Listbox.Item item={item}>
							<Listbox.ItemLabel>{item.rawValue.label}</Listbox.ItemLabel>
							<Listbox.ItemIndicator data-testid="indicator" />
						</Listbox.Item>
					)}
				/>
			));

			expect(queryByTestId("indicator")).toBeNull();
		});

		it("should display item indicator when 'selected'", async () => {
			const { getByTestId } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					value={["2"]}
					renderItem={(item) => (
						<Listbox.Item item={item}>
							<Listbox.ItemLabel>{item.rawValue.label}</Listbox.ItemLabel>
							<Listbox.ItemIndicator data-testid="indicator" />
						</Listbox.Item>
					)}
				/>
			));

			expect(getByTestId("indicator")).toBeInTheDocument();
		});

		it("should display item indicator when 'forceMount'", async () => {
			const { getAllByTestId } = render(() => (
				<Listbox.Root
					options={DATA_SOURCE}
					renderItem={(item) => (
						<Listbox.Item item={item}>
							<Listbox.ItemLabel>{item.rawValue.label}</Listbox.ItemLabel>
							<Listbox.ItemIndicator data-testid="indicator" forceMount />
						</Listbox.Item>
					)}
				/>
			));

			for (const indicator of getAllByTestId("indicator")) {
				expect(indicator).toBeInTheDocument();
			}
		});
	});
});
