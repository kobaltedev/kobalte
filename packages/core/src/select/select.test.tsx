/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-spectrum/picker/test/Picker.test.js
 */
import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, within } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { vi } from "vitest";

import * as Select from ".";

interface DataSourceItem {
	key: string;
	label: string;
	textValue: string;
	disabled: boolean;
}

const DATA_SOURCE: DataSourceItem[] = [
	{ key: "1", label: "One", textValue: "One", disabled: false },
	{ key: "2", label: "Two", textValue: "Two", disabled: false },
	{ key: "3", label: "Three", textValue: "Three", disabled: false },
];

// Skipped: jsdom stub for pointerEvent issue with vitest
describe.skip("Select", () => {
	installPointerEvent();

	const onValueChange = vi.fn();

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.clearAllTimers();
	});

	it("renders correctly", () => {
		const { getByRole, getByText } = render(() => (
			<Select.Root
				options={DATA_SOURCE}
				optionValue="key"
				optionTextValue="textValue"
				optionDisabled="disabled"
				placeholder="Placeholder"
				itemComponent={(props) => (
					<Select.Item item={props.item}>
						{props.item.rawValue.label}
					</Select.Item>
				)}
			>
				<Select.HiddenSelect />
				<Select.Label>Label</Select.Label>
				<Select.Trigger>
					<Select.Value<DataSourceItem>>
						{(state) => state.selectedOption().label}
					</Select.Value>
				</Select.Trigger>
				<Select.Portal>
					<Select.Content>
						<Select.Listbox />
					</Select.Content>
				</Select.Portal>
			</Select.Root>
		));

		const root = getByRole("group");

		expect(root).toBeInTheDocument();
		expect(root).toBeInstanceOf(HTMLDivElement);

		const select = getByRole("textbox", { hidden: true });

		expect(select).not.toBeDisabled();

		const trigger = getByRole("button");

		expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

		const label = getByText("Label");
		const value = getByText("Placeholder");

		expect(label).toBeVisible();
		expect(value).toBeVisible();
	});

	describe("option mapping", () => {
		const CUSTOM_DATA_SOURCE_WITH_STRING_KEY = [
			{
				name: "Section 1",
				items: [
					{ id: "1", name: "One", valueText: "One", disabled: false },
					{ id: "2", name: "Two", valueText: "Two", disabled: true },
					{ id: "3", name: "Three", valueText: "Three", disabled: false },
				],
			},
		];

		it("supports string based option mapping for object options with string keys", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root<any, any>
					options={CUSTOM_DATA_SOURCE_WITH_STRING_KEY}
					optionValue="id"
					optionTextValue="valueText"
					optionDisabled="disabled"
					optionGroupChildren="items"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.name}
						</Select.Item>
					)}
					sectionComponent={(props) => (
						<Select.Section>{props.section.rawValue.name}</Select.Section>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<any>>
							{(state) => state.selectedOption().name}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			const items = within(listbox).getAllByRole("option");

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

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(
				CUSTOM_DATA_SOURCE_WITH_STRING_KEY[0].items[2],
			);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		it("supports function based option mapping for object options with string keys", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root<any, any>
					options={CUSTOM_DATA_SOURCE_WITH_STRING_KEY}
					optionValue={(option) => option.id}
					optionTextValue={(option) => option.valueText}
					optionDisabled={(option) => option.disabled}
					optionGroupChildren="items"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.name}
						</Select.Item>
					)}
					sectionComponent={(props) => (
						<Select.Section>{props.section.rawValue.name}</Select.Section>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<any>>
							{(state) => state.selectedOption().name}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			const items = within(listbox).getAllByRole("option");

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

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(
				CUSTOM_DATA_SOURCE_WITH_STRING_KEY[0].items[2],
			);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		const CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY = [
			{
				name: "Section 1",
				items: [
					{ id: 1, name: "One", valueText: "One", disabled: false },
					{ id: 2, name: "Two", valueText: "Two", disabled: true },
					{ id: 3, name: "Three", valueText: "Three", disabled: false },
				],
			},
		];

		it("supports string based option mapping for object options with number keys", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root<any, any>
					options={CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY}
					optionValue="id"
					optionTextValue="valueText"
					optionDisabled="disabled"
					optionGroupChildren="items"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.name}
						</Select.Item>
					)}
					sectionComponent={(props) => (
						<Select.Section>{props.section.rawValue.name}</Select.Section>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<any>>
							{(state) => state.selectedOption().name}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			const items = within(listbox).getAllByRole("option");

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

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(
				CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY[0].items[2],
			);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		it("supports function based option mapping for object options with number keys", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root<any, any>
					options={CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY}
					optionValue={(option) => option.id}
					optionTextValue={(option) => option.valueText}
					optionDisabled={(option) => option.disabled}
					optionGroupChildren="items"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.name}
						</Select.Item>
					)}
					sectionComponent={(props) => (
						<Select.Section>{props.section.rawValue.name}</Select.Section>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<any>>
							{(state) => state.selectedOption().name}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			const items = within(listbox).getAllByRole("option");

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

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(
				CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY[0].items[2],
			);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		it("supports string options without mapping", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root
					options={["One", "Two", "Three"]}
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>{props.item.rawValue}</Select.Item>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<string>>
							{(state) => state.selectedOption()}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);

			expect(items[0]).toHaveTextContent("One");
			expect(items[0]).toHaveAttribute("data-key", "One");
			expect(items[0]).not.toHaveAttribute("data-disabled");

			expect(items[1]).toHaveTextContent("Two");
			expect(items[1]).toHaveAttribute("data-key", "Two");
			expect(items[1]).not.toHaveAttribute("data-disabled");

			expect(items[2]).toHaveTextContent("Three");
			expect(items[2]).toHaveAttribute("data-key", "Three");
			expect(items[2]).not.toHaveAttribute("data-disabled");

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe("Three");

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		it("supports function based option mapping for string options", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root
					options={["One", "Two", "Three"]}
					optionValue={(option) => option}
					optionTextValue={(option) => option}
					optionDisabled={(option) => option === "Two"}
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>{props.item.rawValue}</Select.Item>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<string>>
							{(state) => state.selectedOption()}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			const items = within(listbox).getAllByRole("option");

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

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe("Three");

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		it("supports number options without mapping", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root
					options={[1, 2, 3]}
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>{props.item.rawValue}</Select.Item>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<number>>
							{(state) => state.selectedOption()}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);

			expect(items[0]).toHaveTextContent("1");
			expect(items[0]).toHaveAttribute("data-key", "1");
			expect(items[0]).not.toHaveAttribute("data-disabled");

			expect(items[1]).toHaveTextContent("2");
			expect(items[1]).toHaveAttribute("data-key", "2");
			expect(items[1]).not.toHaveAttribute("data-disabled");

			expect(items[2]).toHaveTextContent("3");
			expect(items[2]).toHaveAttribute("data-key", "3");
			expect(items[2]).not.toHaveAttribute("data-disabled");

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(3);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("3");
		});

		it("supports function based option mapping for number options", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root
					options={[1, 2, 3]}
					optionValue={(option) => option}
					optionTextValue={(option) => option.toString()}
					optionDisabled={(option) => option === 2}
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>{props.item.rawValue}</Select.Item>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<number>>
							{(state) => state.selectedOption()}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);

			expect(items[0]).toHaveTextContent("1");
			expect(items[0]).toHaveAttribute("data-key", "1");
			expect(items[0]).not.toHaveAttribute("data-disabled");

			expect(items[1]).toHaveTextContent("2");
			expect(items[1]).toHaveAttribute("data-key", "2");
			expect(items[1]).toHaveAttribute("data-disabled");

			expect(items[2]).toHaveTextContent("3");
			expect(items[2]).toHaveAttribute("data-key", "3");
			expect(items[2]).not.toHaveAttribute("data-disabled");

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(3);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("3");
		});
	});

	describe("opening", () => {
		it("can be opened on mouse down", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);
		});

		it("can be opened on touch up", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "touch",
				}),
			);
			await Promise.resolve();

			expect(queryByRole("listbox")).toBeNull();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", {
					pointerId: 1,
					pointerType: "touch",
					clientX: 0,
					clientY: 0,
				}),
			);
			await Promise.resolve();

			fireEvent.click(trigger);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);
		});

		it("can be opened on Space key down", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent.keyDown(trigger, { key: " " });
			fireEvent.keyUp(trigger, { key: " " });
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(items[0]);
		});

		it("can be opened on Enter key down", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent.keyDown(trigger, { key: "Enter" });
			fireEvent.keyUp(trigger, { key: "Enter" });
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(items[0]);
		});

		it("can be opened on ArrowDown key down and auto focuses the first item", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent.keyDown(trigger, { key: "ArrowDown" });
			fireEvent.keyUp(trigger, { key: "ArrowDown" });
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(items[0]);
		});

		it("can be opened on ArrowUp key down and auto focuses the last item", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent.keyDown(trigger, { key: "ArrowUp" });
			fireEvent.keyUp(trigger, { key: "ArrowUp" });
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(items[2]);
		});

		it("can change item focus with arrow keys", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent.keyDown(trigger, { key: "ArrowDown" });
			fireEvent.keyUp(trigger, { key: "ArrowDown" });
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(items[0]);

			fireEvent.keyDown(listbox, { key: "ArrowDown" });
			fireEvent.keyUp(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[1]);

			fireEvent.keyDown(listbox, { key: "ArrowDown" });
			fireEvent.keyUp(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[2]);

			fireEvent.keyDown(listbox, { key: "ArrowUp" });
			fireEvent.keyUp(listbox, { key: "ArrowUp" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[1]);
		});

		it("supports controlled open state", () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					open
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).not.toBeCalled();

			const trigger = getByRole("button", { hidden: true });

			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);
		});

		it("supports default open state", async () => {
			const onOpenChange = vi.fn();

			const { getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					defaultOpen
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).not.toBeCalled();

			const trigger = getByRole("button", { hidden: true });

			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);
		});
	});

	describe("closing", () => {
		it("can be closed by clicking on the button", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			vi.runAllTimers();

			expect(listbox).not.toBeVisible();
			expect(trigger).toHaveAttribute("aria-expanded", "false");
			expect(trigger).not.toHaveAttribute("aria-controls");
			expect(onOpenChange).toBeCalledTimes(2);
			expect(onOpenChange).toHaveBeenCalledWith(false);

			expect(document.activeElement).toBe(trigger);
		});

		it("can be closed by clicking outside", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			fireEvent(
				document.body,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				document.body,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			expect(listbox).not.toBeVisible();
			expect(trigger).toHaveAttribute("aria-expanded", "false");
			expect(trigger).not.toHaveAttribute("aria-controls");
			expect(onOpenChange).toBeCalledTimes(2);
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it("can be closed by pressing the Escape key", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true);
			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			fireEvent.keyDown(listbox, { key: "Escape" });
			await Promise.resolve();

			expect(listbox).not.toBeVisible();
			expect(trigger).toHaveAttribute("aria-expanded", "false");
			expect(trigger).not.toHaveAttribute("aria-controls");
			expect(onOpenChange).toBeCalledTimes(2);
			expect(onOpenChange).toHaveBeenCalledWith(false);

			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
		});

		it("does not close in controlled open state", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, getByLabelText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					open
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).not.toBeCalled();

			const trigger = getByLabelText("Placeholder");

			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			fireEvent.keyDown(listbox, { key: "Escape" });
			fireEvent.keyUp(listbox, { key: "Escape" });
			await Promise.resolve();

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});

		it("closes in default open state", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, getByLabelText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					defaultOpen
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).not.toBeCalled();

			const trigger = getByLabelText("Placeholder");

			expect(trigger).toHaveAttribute("aria-expanded", "true");
			expect(trigger).toHaveAttribute("aria-controls", listbox.id);

			fireEvent.keyDown(listbox, { key: "Escape" });
			fireEvent.keyUp(listbox, { key: "Escape" });
			await Promise.resolve();

			expect(listbox).not.toBeVisible();
			expect(trigger).toHaveAttribute("aria-expanded", "false");
			expect(trigger).not.toHaveAttribute("aria-controls");
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});
	});

	describe("labeling", () => {
		it("focuses on the trigger when you click the label", async () => {
			const { getByRole, getAllByText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const label = getAllByText("Label")[0];

			fireEvent.click(label);
			await Promise.resolve();

			const trigger = getByRole("button");

			expect(document.activeElement).toBe(trigger);
		});

		it("supports labeling with a visible label", async () => {
			const { getByRole, getAllByText, getByText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

			const label = getAllByText("Label")[0];
			const value = getByText("Placeholder");

			expect(label).toHaveAttribute("id");
			expect(value).toHaveAttribute("id");
			expect(trigger).toHaveAttribute(
				"aria-labelledby",
				`${label.id} ${value.id}`,
			);

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(listbox).toHaveAttribute("aria-labelledby", label.id);
		});

		it("supports labeling via aria-label", async () => {
			const { getByRole, getByText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Trigger aria-label="foo">
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			const value = getByText("Placeholder");

			expect(trigger).toHaveAttribute("id");
			expect(value).toHaveAttribute("id");
			expect(trigger).toHaveAttribute("aria-label", "foo");
			expect(trigger).toHaveAttribute(
				"aria-labelledby",
				`${trigger.id} ${value.id}`,
			);

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(listbox).toHaveAttribute("aria-labelledby", trigger.id);
		});

		it("supports labeling via aria-labelledby", async () => {
			const { getByRole, getByText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Trigger aria-labelledby="foo">
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			const value = getByText("Placeholder");

			expect(trigger).toHaveAttribute("id");
			expect(value).toHaveAttribute("id");
			expect(trigger).toHaveAttribute("aria-labelledby", `foo ${value.id}`);

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(listbox).toHaveAttribute("aria-labelledby", "foo");
		});

		it("supports labeling via aria-label and aria-labelledby", async () => {
			const { getByRole, getByText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Trigger aria-label="bar" aria-labelledby="foo">
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			const value = getByText("Placeholder");

			expect(trigger).toHaveAttribute("id");
			expect(value).toHaveAttribute("id");
			expect(trigger).toHaveAttribute("aria-label", "bar");
			expect(trigger).toHaveAttribute(
				"aria-labelledby",
				`foo ${trigger.id} ${value.id}`,
			);

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");
			expect(listbox).toBeVisible();
			expect(listbox).toHaveAttribute("aria-labelledby", `foo ${trigger.id}`);
		});
	});

	describe("help text", () => {
		it("supports description", () => {
			const { getByRole, getByText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Description>Description</Select.Description>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			const description = getByText("Description");

			expect(description).toHaveAttribute("id");
			expect(trigger).toHaveAttribute("aria-describedby", description.id);
		});

		it("supports error message", () => {
			const { getByRole, getByText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					validationState="invalid"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.ErrorMessage>ErrorMessage</Select.ErrorMessage>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			const errorMessage = getByText("ErrorMessage");

			expect(errorMessage).toHaveAttribute("id");
			expect(trigger).toHaveAttribute("aria-describedby", errorMessage.id);
		});
	});

	describe("selection", () => {
		it("can select items on press", async () => {
			const { getByRole, getAllByRole, getByText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[2]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		it("can select items with the Space key", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);

			fireEvent.keyDown(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[0]);

			fireEvent.keyDown(document.activeElement!, { key: " " });
			await Promise.resolve();

			fireEvent.keyUp(document.activeElement!, { key: " " });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[0]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("One");
		});

		it("can select items with the Enter key", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent.focus(trigger);
			await Promise.resolve();

			fireEvent.keyDown(trigger, { key: "ArrowUp" });
			await Promise.resolve();

			fireEvent.keyUp(trigger, { key: "ArrowUp" });
			await Promise.resolve();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(items[2]);

			fireEvent.keyDown(listbox, { key: "ArrowUp" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "ArrowUp" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[1]);

			fireEvent.keyDown(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);

			expect(listbox).not.toBeVisible();
			expect(trigger).toHaveTextContent("Two");
		});

		it("focuses items on hover", async () => {
			const { getByRole, getAllByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);

			fireEvent(
				items[1],
				createPointerEvent("pointermove", {
					pointerId: 1,
					pointerType: "mouse",
					clientX: 0,
					clientY: 0,
				}),
			);
			await Promise.resolve();

			expect(document.activeElement).toBe(items[1]);

			fireEvent.keyDown(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[2]);

			fireEvent.keyDown(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[2]);
			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		it("does not clear selection on escape closing the listbox", async () => {
			const onOpenChangeSpy = vi.fn();
			const { getByRole, getAllByText, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					onOpenChange={onOpenChangeSpy}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			expect(trigger).toHaveTextContent("Placeholder");
			expect(onOpenChangeSpy).toHaveBeenCalledTimes(0);

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);

			let listbox = getByRole("listbox");
			const label = getAllByText("Label")[0];

			expect(listbox).toBeVisible();
			expect(listbox).toHaveAttribute("aria-labelledby", label.id);

			let item1 = within(listbox).getByText("One");
			const item2 = within(listbox).getByText("Two");
			const item3 = within(listbox).getByText("Three");

			expect(item1).toBeTruthy();
			expect(item2).toBeTruthy();
			expect(item3).toBeTruthy();

			fireEvent(
				item3,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				item3,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);

			expect(onOpenChangeSpy).toHaveBeenCalledTimes(2);
			expect(queryByRole("listbox")).toBeNull();

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			expect(onOpenChangeSpy).toHaveBeenCalledTimes(3);

			listbox = getByRole("listbox");
			item1 = within(listbox).getByText("One");

			fireEvent.keyDown(item1, { key: "Escape" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1); // still expecting it to have only been called once

			expect(onOpenChangeSpy).toHaveBeenCalledTimes(4);
			expect(queryByRole("listbox")).toBeNull();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		it("supports controlled selection", async () => {
			const { getByRole, getAllByText } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					value={DATA_SOURCE[1]}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveTextContent("Two");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(items[1]);

			expect(items[1]).toHaveAttribute("aria-selected", "true");

			fireEvent.keyDown(listbox, { key: "ArrowUp" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "ArrowUp" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[0]);

			fireEvent.keyDown(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[0]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Two");
		});

		it("supports controlled clear selection", async () => {
			const { getByRole, getByTestId } = render(() => {
				const [value, setValue] = createSignal(DATA_SOURCE[1]);

				return (
					<>
						<button
							type="button"
							data-testid="clear-button"
							onClick={() => setValue(null as any)}
						>
							Clear selection
						</button>
						<Select.Root
							options={DATA_SOURCE}
							optionValue="key"
							optionTextValue="textValue"
							optionDisabled="disabled"
							placeholder="Placeholder"
							value={value()}
							onChange={onValueChange}
							itemComponent={(props) => (
								<Select.Item item={props.item}>
									{props.item.rawValue.label}
								</Select.Item>
							)}
						>
							<Select.Label>Label</Select.Label>
							<Select.Trigger data-testid="trigger">
								<Select.Value<DataSourceItem>>
									{(state) => state.selectedOption().label}
								</Select.Value>
							</Select.Trigger>
							<Select.Portal>
								<Select.Content>
									<Select.Listbox />
								</Select.Content>
							</Select.Portal>
						</Select.Root>
					</>
				);
			});

			const clearButton = getByTestId("clear-button");

			const trigger = getByTestId("trigger");
			expect(trigger).toHaveTextContent("Two");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(items[1]);

			expect(items[1]).toHaveAttribute("aria-selected", "true");

			fireEvent.keyDown(listbox, { key: "ArrowUp" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "ArrowUp" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[0]);

			fireEvent.keyDown(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[0]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Two");

			fireEvent.click(clearButton);
			await Promise.resolve();

			expect(trigger).toHaveTextContent("Placeholder");
		});

		it("supports default selection", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					defaultValue={DATA_SOURCE[1]}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			expect(trigger).toHaveTextContent("Two");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(items[1]);
			expect(items[1]).toHaveAttribute("aria-selected", "true");

			fireEvent.keyDown(listbox, { key: "ArrowUp" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "ArrowUp" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[0]);

			fireEvent.keyDown(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[0]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("One");
		});

		it("skips disabled items", async () => {
			const dataSource = [
				{ key: "1", label: "One", textValue: "One", disabled: false },
				{ key: "2", label: "Two", textValue: "Two", disabled: true },
				{ key: "3", label: "Three", textValue: "Three", disabled: false },
			];

			const { getByRole } = render(() => (
				<Select.Root
					options={dataSource}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);
			expect(items[1]).toHaveAttribute("aria-disabled", "true");

			fireEvent.keyDown(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyDown(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "ArrowDown" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[2]);

			fireEvent.keyDown(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(dataSource[2]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Three");
		});

		it("supports type to select", async () => {
			const dataSource: DataSourceItem[] = [
				{ key: "1", label: "One", textValue: "One", disabled: false },
				{ key: "2", label: "Two", textValue: "Two", disabled: false },
				{ key: "3", label: "Three", textValue: "Three", disabled: false },
				{ key: "4", label: "Four", textValue: "Four", disabled: false },
			];

			const { getByRole } = render(() => (
				<Select.Root
					options={dataSource}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent.focus(trigger);
			await Promise.resolve();

			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent.keyDown(trigger, { key: "ArrowDown" });
			await Promise.resolve();

			let listbox = getByRole("listbox");
			let items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(4);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");
			expect(items[3]).toHaveTextContent("Four");

			expect(document.activeElement).toBe(items[0]);

			fireEvent.keyDown(listbox, { key: "t" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "t" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[1]);

			fireEvent.keyDown(listbox, { key: "h" });
			await Promise.resolve();

			fireEvent.keyUp(listbox, { key: "h" });
			await Promise.resolve();

			expect(document.activeElement).toBe(items[2]);

			fireEvent.keyDown(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(dataSource[2]);

			expect(listbox).not.toBeVisible();
			expect(trigger).toHaveTextContent("Three");

			fireEvent.focus(trigger);
			await Promise.resolve();

			fireEvent.keyDown(trigger, { key: "ArrowDown" });
			await Promise.resolve();

			listbox = getByRole("listbox");
			items = within(listbox).getAllByRole("option");

			expect(document.activeElement).toBe(items[2]);

			fireEvent.keyDown(listbox, { key: "f" });
			await Promise.resolve();

			fireEvent.keyDown(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(document.activeElement!, { key: "Enter" });
			await Promise.resolve();

			expect(listbox).not.toBeVisible();
			expect(trigger).toHaveTextContent("Four");
			expect(onValueChange).toHaveBeenCalledTimes(2);
			expect(onValueChange.mock.calls[1][0]).toBe(dataSource[3]);
		});

		it("does not deselect when pressing an already selected item when 'disallowEmptySelection' is true", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					defaultValue={DATA_SOURCE[1]}
					disallowEmptySelection
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveTextContent("Two");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(document.activeElement).toBe(items[1]);

			fireEvent(
				items[1],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[1],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveTextContent("Two");
		});

		it("move selection on Arrow-Left/Right", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent.focus(trigger);
			await Promise.resolve();

			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent.keyDown(trigger, { key: "ArrowLeft" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(trigger).toHaveTextContent("One");

			fireEvent.keyDown(trigger, { key: "ArrowLeft" });
			await Promise.resolve();

			expect(trigger).toHaveTextContent("One");

			fireEvent.keyDown(trigger, { key: "ArrowRight" });

			expect(onValueChange).toHaveBeenCalledTimes(2);
			expect(trigger).toHaveTextContent("Two");

			fireEvent.keyDown(trigger, { key: "ArrowRight" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(3);
			expect(trigger).toHaveTextContent("Three");

			fireEvent.keyDown(trigger, { key: "ArrowRight" });
			await Promise.resolve();

			expect(trigger).toHaveTextContent("Three");

			fireEvent.keyDown(trigger, { key: "ArrowLeft" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(4);
			expect(trigger).toHaveTextContent("Two");
		});
	});

	describe("multi-select", () => {
		it("supports selecting multiple options", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					multiple
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{({ selectedOptions }) =>
								selectedOptions()
									.map((opt) => opt.label)
									.join(", ")
							}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(listbox).toHaveAttribute("aria-multiselectable", "true");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);

			fireEvent(
				items[0],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[0],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(items[0]).toHaveAttribute("aria-selected", "true");
			expect(items[2]).toHaveAttribute("aria-selected", "true");

			expect(onValueChange).toBeCalledTimes(2);
			expect(
				onValueChange.mock.calls[0][0].includes(DATA_SOURCE[0]),
			).toBeTruthy();
			expect(
				onValueChange.mock.calls[1][0].includes(DATA_SOURCE[2]),
			).toBeTruthy();

			// Does not close on multi-select
			expect(listbox).toBeVisible();

			expect(trigger).toHaveTextContent("One, Three");
		});

		it("supports multiple defaultValue (uncontrolled)", async () => {
			const defaultValue = [DATA_SOURCE[0], DATA_SOURCE[1]];

			const { getByRole } = render(() => (
				<Select.Root<DataSourceItem>
					multiple
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					defaultValue={defaultValue}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{({ selectedOptions }) =>
								selectedOptions()
									.map((opt) => opt.label)
									.join(", ")
							}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items[0]).toHaveAttribute("aria-selected", "true");
			expect(items[1]).toHaveAttribute("aria-selected", "true");

			// SelectBase a different option
			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(items[2]).toHaveAttribute("aria-selected", "true");

			expect(onValueChange).toBeCalledTimes(1);
			expect(
				onValueChange.mock.calls[0][0].includes(DATA_SOURCE[0]),
			).toBeTruthy();
			expect(
				onValueChange.mock.calls[0][0].includes(DATA_SOURCE[1]),
			).toBeTruthy();
			expect(
				onValueChange.mock.calls[0][0].includes(DATA_SOURCE[2]),
			).toBeTruthy();
		});

		it("supports multiple value (controlled)", async () => {
			const value = [DATA_SOURCE[0], DATA_SOURCE[1]];

			const { getByRole } = render(() => (
				<Select.Root<DataSourceItem>
					multiple
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					value={value}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{({ selectedOptions }) =>
								selectedOptions()
									.map((opt) => opt.label)
									.join(", ")
							}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items[0]).toHaveAttribute("aria-selected", "true");
			expect(items[1]).toHaveAttribute("aria-selected", "true");

			// SelectBase a different option
			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(items[2]).toHaveAttribute("aria-selected", "false");

			expect(onValueChange).toBeCalledTimes(1);
			expect(
				onValueChange.mock.calls[0][0].includes(DATA_SOURCE[2]),
			).toBeTruthy();
		});

		it("should keep the selection order", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					multiple
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{({ selectedOptions }) =>
								selectedOptions()
									.map((opt) => opt.label)
									.join(", ")
							}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(listbox).toHaveAttribute("aria-multiselectable", "true");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(listbox);

			fireEvent(
				items[2],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[2],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			fireEvent(
				items[0],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[0],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(items[0]).toHaveAttribute("aria-selected", "true");
			expect(items[2]).toHaveAttribute("aria-selected", "true");

			expect(onValueChange).toBeCalledTimes(2);
			expect(
				onValueChange.mock.calls[0][0].includes(DATA_SOURCE[2]),
			).toBeTruthy();
			expect(
				onValueChange.mock.calls[1][0].includes(DATA_SOURCE[0]),
			).toBeTruthy();

			// Does not close on multi-select
			expect(listbox).toBeVisible();

			expect(trigger).toHaveTextContent("Three, One");
		});

		it("supports deselection", async () => {
			const defaultValue = [DATA_SOURCE[0], DATA_SOURCE[1]];

			const { getByRole } = render(() => (
				<Select.Root<DataSourceItem>
					multiple
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					defaultValue={defaultValue}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{({ selectedOptions }) =>
								selectedOptions()
									.map((opt) => opt.label)
									.join(", ")
							}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items[0]).toHaveAttribute("aria-selected", "true");
			expect(items[1]).toHaveAttribute("aria-selected", "true");

			// Deselect first option
			fireEvent(
				items[0],
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			fireEvent(
				items[0],
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);
			await Promise.resolve();

			expect(items[0]).toHaveAttribute("aria-selected", "false");

			expect(onValueChange).toBeCalledTimes(1);
			expect(
				onValueChange.mock.calls[0][0].includes(DATA_SOURCE[0]),
			).toBeFalsy();
			expect(
				onValueChange.mock.calls[0][0].includes(DATA_SOURCE[1]),
			).toBeTruthy();
		});
	});

	describe("type to select", () => {
		it("supports focusing items by typing letters in rapid succession without opening the menu", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent.focus(trigger);
			await Promise.resolve();

			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent.keyDown(trigger, { key: "t" });
			await Promise.resolve();

			fireEvent.keyUp(trigger, { key: "t" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);
			expect(trigger).toHaveTextContent("Two");

			fireEvent.keyDown(trigger, { key: "h" });
			await Promise.resolve();

			fireEvent.keyUp(trigger, { key: "h" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(2);
			expect(onValueChange.mock.calls[1][0]).toBe(DATA_SOURCE[2]);
			expect(trigger).toHaveTextContent("Three");
		});

		it("resets the search text after a timeout", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			fireEvent.focus(trigger);
			await Promise.resolve();

			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent.keyDown(trigger, { key: "t" });
			await Promise.resolve();

			fireEvent.keyUp(trigger, { key: "t" });
			await Promise.resolve();

			vi.runAllTimers();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);
			expect(trigger).toHaveTextContent("Two");

			fireEvent.keyDown(trigger, { key: "h" });
			await Promise.resolve();

			fireEvent.keyUp(trigger, { key: "h" });
			await Promise.resolve();

			vi.runAllTimers();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(trigger).toHaveTextContent("Two");
		});

		it("wraps around when no items past the current one match", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");
			fireEvent.focus(trigger);
			await Promise.resolve();

			expect(trigger).toHaveTextContent("Placeholder");

			fireEvent.keyDown(trigger, { key: "t" });
			await Promise.resolve();

			fireEvent.keyUp(trigger, { key: "t" });
			await Promise.resolve();

			vi.runAllTimers();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(DATA_SOURCE[1]);
			expect(trigger).toHaveTextContent("Two");

			fireEvent.keyDown(trigger, { key: "o" });
			await Promise.resolve();

			fireEvent.keyUp(trigger, { key: "o" });
			await Promise.resolve();

			vi.runAllTimers();

			expect(onValueChange).toHaveBeenCalledTimes(2);
			expect(trigger).toHaveTextContent("One");
		});
	});

	describe("autofill", () => {
		it("should have a hidden select element for form autocomplete", async () => {
			const dataSource: DataSourceItem[] = [
				{ key: "DE", label: "Germany", textValue: "Germany", disabled: false },
				{ key: "FR", label: "France", textValue: "France", disabled: false },
				{ key: "IT", label: "Italy", textValue: "Italy", disabled: false },
			];

			const { getByRole, getAllByRole } = render(() => (
				<Select.Root
					options={dataSource}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.HiddenSelect autocomplete="address-level1" />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const trigger = getByRole("button");

			expect(trigger).toHaveTextContent("Placeholder");

			const hiddenSelectBase = getAllByRole("listbox", {
				hidden: true,
			})[0];

			expect(hiddenSelectBase).toHaveAttribute("tabIndex", "-1");
			expect(hiddenSelectBase).toHaveAttribute(
				"autocomplete",
				"address-level1",
			);

			const options = within(hiddenSelectBase).getAllByRole("option", {
				hidden: true,
			});

			expect(options.length).toBe(4);

			options.forEach(
				(option, index) =>
					index > 0 &&
					expect(option).toHaveTextContent(dataSource[index - 1].label),
			);

			fireEvent.change(hiddenSelectBase, { target: { value: "FR" } });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toBe(dataSource[1]);
			expect(trigger).toHaveTextContent("France");
		});

		it("should have a hidden input to marshall focus to the button", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const hiddenInput = getByRole("textbox", { hidden: true }); // get the hidden ones

			expect(hiddenInput).toHaveAttribute("tabIndex", "0");
			expect(hiddenInput).toHaveAttribute("style", "font-size: 16px;");
			expect(hiddenInput.parentElement).toHaveAttribute("aria-hidden", "true");

			hiddenInput.focus();
			await Promise.resolve();

			const button = getByRole("button");

			expect(document.activeElement).toBe(button);
			expect(hiddenInput).toHaveAttribute("tabIndex", "-1");

			fireEvent.blur(button);
			await Promise.resolve();

			expect(hiddenInput).toHaveAttribute("tabIndex", "0");
		});
	});

	describe("disabled", () => {
		it("disables the hidden select when disabled is true", async () => {
			const { getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					disabled
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.HiddenSelect />
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			const select = getByRole("textbox", { hidden: true });

			expect(select).toBeDisabled();
		});

		it("does not open on mouse down when disabled is true", async () => {
			const onOpenChange = vi.fn();

			const { queryByRole, getByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					disabled
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);
			await Promise.resolve();

			expect(queryByRole("listbox")).toBeNull();

			expect(onOpenChange).toBeCalledTimes(0);

			expect(trigger).toHaveAttribute("aria-expanded", "false");
		});

		it("does not open on Space key press when disabled is true", async () => {
			const onOpenChange = vi.fn();
			const { getByRole, queryByRole } = render(() => (
				<Select.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					disabled
					onChange={onValueChange}
					itemComponent={(props) => (
						<Select.Item item={props.item}>
							{props.item.rawValue.label}
						</Select.Item>
					)}
				>
					<Select.Label>Label</Select.Label>
					<Select.Trigger>
						<Select.Value<DataSourceItem>>
							{(state) => state.selectedOption().label}
						</Select.Value>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content>
							<Select.Listbox />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");

			fireEvent.keyDown(trigger, { key: " " });
			await Promise.resolve();

			fireEvent.keyUp(trigger, { key: " " });
			await Promise.resolve();

			expect(queryByRole("listbox")).toBeNull();

			expect(onOpenChange).toBeCalledTimes(0);

			expect(trigger).toHaveAttribute("aria-expanded", "false");
			expect(document.activeElement).not.toBe(trigger);
		});
	});

	describe("form", () => {
		it("Should submit empty option by default", async () => {
			let value: {};

			const onSubmit = vi.fn((e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				value = Object.fromEntries(formData).test; // same name as the select "name" prop
			});

			const { getByTestId } = render(() => (
				<form data-testid="form" onSubmit={onSubmit}>
					<Select.Root
						options={DATA_SOURCE}
						optionValue="key"
						optionTextValue="textValue"
						optionDisabled="disabled"
						placeholder="Placeholder"
						name="test"
						itemComponent={(props) => (
							<Select.Item item={props.item}>
								{props.item.rawValue.label}
							</Select.Item>
						)}
					>
						<Select.HiddenSelect />
						<Select.Label>Label</Select.Label>
						<Select.Trigger autofocus>
							<Select.Value<DataSourceItem>>
								{(state) => state.selectedOption().label}
							</Select.Value>
						</Select.Trigger>
						<Select.Portal>
							<Select.Content>
								<Select.Listbox />
							</Select.Content>
						</Select.Portal>
					</Select.Root>
					<button type="submit" data-testid="submit">
						submit
					</button>
				</form>
			));

			fireEvent.submit(getByTestId("form"));
			await Promise.resolve();

			expect(onSubmit).toHaveBeenCalledTimes(1);
			// @ts-ignore
			expect(value).toBe("");
		});

		it("Should submit default option", async () => {
			let value: {};

			const onSubmit = vi.fn((e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				value = Object.fromEntries(formData).test; // same name as the select "name" prop
			});

			const { getByTestId } = render(() => (
				<form data-testid="form" onSubmit={onSubmit}>
					<Select.Root
						options={DATA_SOURCE}
						optionValue="key"
						optionTextValue="textValue"
						optionDisabled="disabled"
						placeholder="Placeholder"
						name="test"
						defaultValue={DATA_SOURCE[0]}
						itemComponent={(props) => (
							<Select.Item item={props.item}>
								{props.item.rawValue.label}
							</Select.Item>
						)}
					>
						<Select.HiddenSelect />
						<Select.Label>Label</Select.Label>
						<Select.Trigger autofocus>
							<Select.Value<DataSourceItem>>
								{(state) => state.selectedOption().label}
							</Select.Value>
						</Select.Trigger>
						<Select.Portal>
							<Select.Content>
								<Select.Listbox />
							</Select.Content>
						</Select.Portal>
					</Select.Root>
				</form>
			));

			fireEvent.submit(getByTestId("form"));
			await Promise.resolve();

			expect(onSubmit).toHaveBeenCalledTimes(1);
			// @ts-ignore
			expect(value).toEqual("1");
		});
	});
});
