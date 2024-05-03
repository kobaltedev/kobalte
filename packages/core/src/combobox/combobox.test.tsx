/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-spectrum/picker/test/Picker.test.js
 */

import { createPointerEvent, installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, within } from "@solidjs/testing-library";
import { vi } from "vitest";

import { Show, createSignal } from "solid-js";
import * as Combobox from ".";

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
describe.skip("Combobox", () => {
	installPointerEvent();

	// structuredClone polyfill, kind of ^^'
	global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

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
			<Combobox.Root
				options={DATA_SOURCE}
				optionValue="key"
				optionTextValue="textValue"
				optionLabel="label"
				optionDisabled="disabled"
				placeholder="Placeholder"
				itemComponent={(props) => (
					<Combobox.Item item={props.item}>
						{props.item.rawValue.label}
					</Combobox.Item>
				)}
			>
				<Combobox.HiddenSelect />
				<Combobox.Label>Label</Combobox.Label>
				<Combobox.Control>
					<Combobox.Input />
					<Combobox.Trigger />
				</Combobox.Control>
				<Combobox.Portal>
					<Combobox.Content>
						<Combobox.Listbox />
					</Combobox.Content>
				</Combobox.Portal>
			</Combobox.Root>
		));

		const root = getByRole("group");

		expect(root).toBeInTheDocument();
		expect(root).toBeInstanceOf(HTMLDivElement);

		const input = getByRole("combobox");

		expect(input).toHaveAttribute("aria-autocomplete", "list");
		expect(input).not.toHaveAttribute("aria-controls");
		expect(input).not.toHaveAttribute("aria-activedescendant");
		expect(input).not.toBeDisabled();

		const trigger = getByRole("button");

		expect(trigger).toHaveAttribute("tabindex", "-1");
		expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

		const label = getByText("Label");

		expect(label).toBeVisible();
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
			const { getByRole } = render(() => (
				<Combobox.Root<any, any>
					options={CUSTOM_DATA_SOURCE_WITH_STRING_KEY}
					optionValue="id"
					optionTextValue="valueText"
					optionLabel="name"
					optionDisabled="disabled"
					optionGroupChildren="items"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.name}
						</Combobox.Item>
					)}
					sectionComponent={(props) => (
						<Combobox.Section>{props.section.rawValue.name}</Combobox.Section>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(
				CUSTOM_DATA_SOURCE_WITH_STRING_KEY[0].items[2],
			);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(input).toHaveValue("Three");
			expect(document.activeElement).toBe(input);
		});

		it("supports function based option mapping for object options with string keys", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root<any, any>
					options={CUSTOM_DATA_SOURCE_WITH_STRING_KEY}
					optionValue={(option) => option.id}
					optionTextValue={(option) => option.valueText}
					optionLabel={(option) => option.name}
					optionDisabled={(option) => option.disabled}
					optionGroupChildren="items"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.name}
						</Combobox.Item>
					)}
					sectionComponent={(props) => (
						<Combobox.Section>{props.section.rawValue.name}</Combobox.Section>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(
				CUSTOM_DATA_SOURCE_WITH_STRING_KEY[0].items[2],
			);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(input).toHaveValue("Three");
			expect(document.activeElement).toBe(input);
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
			const { getByRole } = render(() => (
				<Combobox.Root<any, any>
					options={CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY}
					optionValue="id"
					optionTextValue="valueText"
					optionLabel="name"
					optionDisabled="disabled"
					optionGroupChildren="items"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.name}
						</Combobox.Item>
					)}
					sectionComponent={(props) => (
						<Combobox.Section>{props.section.rawValue.name}</Combobox.Section>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(
				CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY[0].items[2],
			);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(input).toHaveValue("Three");
			expect(document.activeElement).toBe(input);
		});

		it("supports function based option mapping for object options with number keys", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root<any, any>
					options={CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY}
					optionValue={(option) => option.id}
					optionTextValue={(option) => option.valueText}
					optionLabel={(option) => option.name}
					optionDisabled={(option) => option.disabled}
					optionGroupChildren="items"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.name}
						</Combobox.Item>
					)}
					sectionComponent={(props) => (
						<Combobox.Section>{props.section.rawValue.name}</Combobox.Section>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			fireEvent(
				trigger,
				createPointerEvent("pointerdown", {
					pointerId: 1,
					pointerType: "mouse",
				}),
			);

			fireEvent(
				trigger,
				createPointerEvent("pointerup", { pointerId: 1, pointerType: "mouse" }),
			);

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
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(
				CUSTOM_DATA_SOURCE_WITH_NUMBER_KEY[0].items[2],
			);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(input).toHaveValue("Three");
			expect(document.activeElement).toBe(input);
		});

		it("supports string options without mapping", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={["One", "Two", "Three"]}
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue}
						</Combobox.Item>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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

			expect(input).toHaveValue("Three");
			expect(document.activeElement).toBe(input);
		});

		it("supports function based option mapping for string options", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={["One", "Two", "Three"]}
					optionValue={(option) => option}
					optionTextValue={(option) => option}
					optionLabel={(option) => option}
					optionDisabled={(option) => option === "Two"}
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue}
						</Combobox.Item>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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

			expect(input).toHaveValue("Three");
			expect(document.activeElement).toBe(input);
		});

		it("supports number options without mapping", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={[1, 2, 3]}
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue}
						</Combobox.Item>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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

			expect(input).toHaveValue("3");
			expect(document.activeElement).toBe(input);
		});

		it("supports function based option mapping for number options", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={[1, 2, 3]}
					optionValue={(option) => option}
					optionTextValue={(option) => option}
					optionLabel={(option) => option}
					optionDisabled={(option) => option === 2}
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue}
						</Combobox.Item>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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

			expect(input).toHaveValue("3");
			expect(document.activeElement).toBe(input);
		});
	});

	describe("opening", () => {
		it("can be opened on mouse down", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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

			fireEvent.click(trigger);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true, "manual");
			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(input);
		});

		it("can be opened on touch up", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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
			expect(onOpenChange).toHaveBeenCalledWith(true, "manual");
			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(input);
		});

		it("can be opened on ArrowDown key down and virtual focuses the first item", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const input = getByRole("combobox");

			fireEvent.keyDown(input, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "ArrowDown" });
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true, "manual");
			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(input).toHaveAttribute("aria-activedescendant", items[0].id);
		});

		it("can be opened on ArrowUp key down and virtual focuses the last item", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const input = getByRole("combobox");

			fireEvent.keyDown(input, { key: "ArrowUp" });
			fireEvent.keyUp(input, { key: "ArrowUp" });
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true, "manual");
			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(input).toHaveAttribute("aria-activedescendant", items[2].id);
		});

		it("can change item focus with arrow keys", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const input = getByRole("combobox");

			fireEvent.keyDown(input, { key: "ArrowDown" });
			fireEvent.keyUp(input, { key: "ArrowDown" });
			await Promise.resolve();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true, "manual");
			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(input).toHaveAttribute("aria-activedescendant", items[0].id);

			fireEvent.keyDown(input, { key: "ArrowDown" });
			fireEvent.keyUp(input, { key: "ArrowDown" });
			await Promise.resolve();

			expect(input).toHaveAttribute("aria-activedescendant", items[1].id);

			fireEvent.keyDown(input, { key: "ArrowDown" });
			fireEvent.keyUp(input, { key: "ArrowDown" });
			await Promise.resolve();

			expect(input).toHaveAttribute("aria-activedescendant", items[2].id);

			fireEvent.keyDown(input, { key: "ArrowUp" });
			fireEvent.keyUp(input, { key: "ArrowUp" });
			await Promise.resolve();

			expect(input).toHaveAttribute("aria-activedescendant", items[1].id);
		});

		it("supports controlled open state", () => {
			const onOpenChange = vi.fn();

			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					open
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).not.toBeCalled();

			const input = getByRole("combobox");

			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");
		});

		it("supports default open state", async () => {
			const onOpenChange = vi.fn();

			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					defaultOpen
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).not.toBeCalled();

			const input = getByRole("combobox");

			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");
		});
	});

	describe("closing", () => {
		it("can be closed by clicking on the button", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
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
			expect(onOpenChange).toHaveBeenCalledWith(true, "manual");
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
			expect(onOpenChange).toHaveBeenCalledWith(false, "manual");
		});

		it("can be closed by clicking outside", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
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

			fireEvent.click(trigger);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(true, "manual");
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
			expect(onOpenChange).toHaveBeenCalledWith(false, "manual");
		});

		it("can be closed by pressing the Escape key", async () => {
			const onOpenChange = vi.fn();

			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			expect(queryByRole("listbox")).toBeNull();

			const trigger = getByRole("button");
			const input = getByRole("combobox");

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
			expect(onOpenChange).toHaveBeenCalledWith(true, "manual");
			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			fireEvent.keyDown(input, { key: "Escape" });
			await Promise.resolve();

			expect(listbox).not.toBeVisible();
			expect(input).toHaveAttribute("aria-expanded", "false");
			expect(input).not.toHaveAttribute("aria-controls");
			expect(onOpenChange).toBeCalledTimes(2);
			expect(onOpenChange).toHaveBeenCalledWith(false, "manual");

			vi.runAllTimers();

			expect(document.activeElement).toBe(input);
		});

		it("does not close in controlled open state", async () => {
			const onOpenChange = vi.fn();

			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					open
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).not.toBeCalled();

			const input = getByRole("combobox");

			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			fireEvent.keyDown(input, { key: "Escape" });
			fireEvent.keyUp(input, { key: "Escape" });
			await Promise.resolve();

			expect(listbox).toBeVisible();
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(false, "focus");
		});

		it("closes in default open state", async () => {
			const onOpenChange = vi.fn();

			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					defaultOpen
					onOpenChange={onOpenChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();
			expect(onOpenChange).not.toBeCalled();

			const input = getByRole("combobox");

			expect(input).toHaveAttribute("aria-expanded", "true");
			expect(input).toHaveAttribute("aria-controls", listbox.id);

			fireEvent.keyDown(input, { key: "Escape" });
			fireEvent.keyUp(input, { key: "Escape" });
			await Promise.resolve();

			expect(listbox).not.toBeVisible();
			expect(input).toHaveAttribute("aria-expanded", "false");
			expect(input).not.toHaveAttribute("aria-controls");
			expect(onOpenChange).toBeCalledTimes(1);
			expect(onOpenChange).toHaveBeenCalledWith(false, "focus");
		});
	});

	describe("labeling", () => {
		it("supports labeling with a visible label", async () => {
			const { getByRole, getAllByText } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");

			const input = getByRole("combobox");
			expect(input).toHaveAttribute("aria-haspopup", "listbox");

			const label = getAllByText("Label")[0];

			expect(label).toHaveAttribute("id");
			expect(input).toHaveAttribute("aria-labelledby", `${label.id}`);

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
			expect(listbox).toHaveAttribute(
				"aria-labelledby",
				`${label.id} ${listbox.id}`,
			);
		});

		it("supports labeling via aria-labelledby", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Control>
						<Combobox.Input aria-labelledby="foo" />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(input).toHaveAttribute("aria-labelledby", "foo");

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
		});

		it("supports labeling via aria-label and aria-labelledby", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Control>
						<Combobox.Input aria-label="bar" aria-labelledby="foo" />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(input).toHaveAttribute("aria-label", "bar");
			expect(input).toHaveAttribute("aria-labelledby", `foo ${input.id}`);

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
		});
	});

	describe("help text", () => {
		it("supports description", () => {
			const { getByRole, getByText } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Description>Description</Combobox.Description>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const input = getByRole("combobox");
			const description = getByText("Description");

			expect(description).toHaveAttribute("id");
			expect(input).toHaveAttribute("aria-describedby", description.id);
		});

		it("supports error message", () => {
			const { getByRole, getByText } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					validationState="invalid"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.ErrorMessage>ErrorMessage</Combobox.ErrorMessage>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const input = getByRole("combobox");
			const errorMessage = getByText("ErrorMessage");

			expect(errorMessage).toHaveAttribute("id");
			expect(input).toHaveAttribute("aria-describedby", errorMessage.id);
		});
	});

	describe("selection", () => {
		it("can select items on press", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(getByRole("combobox")).toHaveAttribute(
				"placeholder",
				"Placeholder",
			);

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

			fireEvent.click(trigger);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(document.activeElement).toBe(input);

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
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(DATA_SOURCE[2]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(input).toHaveValue("Three");
			expect(document.activeElement).toBe(input);
		});

		it("can select items with the Enter key", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const input = getByRole("combobox");

			expect(input).toHaveAttribute("placeholder", "Placeholder");

			fireEvent.focus(input);
			await Promise.resolve();

			fireEvent.keyDown(input, { key: "ArrowUp" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "ArrowUp" });
			await Promise.resolve();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

			expect(input).toHaveAttribute("aria-activedescendant", items[2].id);

			fireEvent.keyDown(input, { key: "ArrowUp" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "ArrowUp" });
			await Promise.resolve();

			expect(input).toHaveAttribute("aria-activedescendant", items[1].id);

			fireEvent.keyDown(input, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(DATA_SOURCE[1]);

			expect(listbox).not.toBeVisible();
			expect(input).toHaveValue("Two");
		});

		it("focuses items on hover", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(input).toHaveAttribute("placeholder", "Placeholder");

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

			expect(input).toHaveAttribute("aria-activedescendant", items[1].id);

			fireEvent.keyDown(input, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "ArrowDown" });
			await Promise.resolve();

			expect(input).toHaveAttribute("aria-activedescendant", items[2].id);

			fireEvent.keyDown(input, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(DATA_SOURCE[2]);
			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(input);
			expect(input).toHaveValue("Three");
		});

		it("does not clear selection on escape closing the listbox", async () => {
			const onOpenChangeSpy = vi.fn();
			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					onOpenChange={onOpenChangeSpy}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(getByRole("combobox")).toHaveAttribute(
				"placeholder",
				"Placeholder",
			);
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

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();

			const item1 = within(listbox).getByText("One");
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

			fireEvent.keyDown(input, { key: "Escape" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1); // still expecting it to have only been called once

			expect(onOpenChangeSpy).toHaveBeenCalledTimes(4);
			expect(queryByRole("listbox")).toBeNull();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(input);
			expect(getByRole("combobox")).toHaveValue("Three");
		});

		it("clear selection on escape when listbox is not visible", async () => {
			const onOpenChangeSpy = vi.fn();
			const { getByRole, queryByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					onOpenChange={onOpenChangeSpy}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(getByRole("combobox")).toHaveAttribute(
				"placeholder",
				"Placeholder",
			);
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

			const listbox = getByRole("listbox");

			expect(listbox).toBeVisible();

			const item1 = within(listbox).getByText("One");
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

			fireEvent.keyDown(input, { key: "Escape" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1); // still expecting it to have only been called once

			expect(onOpenChangeSpy).toHaveBeenCalledTimes(4);
			expect(queryByRole("listbox")).toBeNull();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(input);
			expect(getByRole("combobox")).toHaveValue("Three");

			fireEvent.keyDown(input, { key: "Escape" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(2);

			expect(document.activeElement).toBe(input);
			expect(getByRole("combobox")).toHaveValue("");
		});

		it("supports controlled selection", async () => {
			render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					value={DATA_SOURCE[1]}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(input).toHaveValue("Two");

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

			expect(input).toHaveAttribute("aria-activedescendant", items[1].id);

			expect(items[1]).toHaveAttribute("aria-selected", "true");

			fireEvent.keyDown(input, { key: "ArrowUp" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "ArrowUp" });
			await Promise.resolve();

			expect(input).toHaveAttribute("aria-activedescendant", items[0].id);

			fireEvent.keyDown(input, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(DATA_SOURCE[0]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(input);
			expect(input).toHaveValue("Two");
		});

		it("supports default selection", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					defaultValue={DATA_SOURCE[1]}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(input).toHaveValue("Two");

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

			expect(input).toHaveAttribute("aria-activedescendant", items[1].id);
			expect(items[1]).toHaveAttribute("aria-selected", "true");

			fireEvent.keyDown(input, { key: "ArrowUp" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "ArrowUp" });
			await Promise.resolve();

			expect(input).toHaveAttribute("aria-activedescendant", items[0].id);

			fireEvent.keyDown(input, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(DATA_SOURCE[0]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(input);
			expect(input).toHaveValue("One");
		});

		it("skips disabled items", async () => {
			const dataSource = [
				{ key: "1", label: "One", textValue: "One", disabled: false },
				{ key: "2", label: "Two", textValue: "Two", disabled: true },
				{ key: "3", label: "Three", textValue: "Three", disabled: false },
			];

			const { getByRole } = render(() => (
				<Combobox.Root
					options={dataSource}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(input).toHaveAttribute("placeholder", "Placeholder");

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

			expect(items[1]).toHaveAttribute("aria-disabled", "true");

			fireEvent.keyDown(input, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyDown(input, { key: "ArrowDown" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "ArrowDown" });
			await Promise.resolve();

			expect(input).toHaveAttribute("aria-activedescendant", items[2].id);

			fireEvent.keyDown(input, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(dataSource[2]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(input);
			expect(input).toHaveValue("Three");
		});

		it("does not deselect when pressing an already selected item when 'disallowEmptySelection' is true", async () => {
			render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					defaultValue={DATA_SOURCE[1]}
					onChange={onValueChange}
					disallowEmptySelection
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			const input = getByRole("combobox");

			expect(input).toHaveValue("Two");

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

			expect(input).toHaveAttribute("aria-activedescendant", items[1].id);

			fireEvent.keyDown(input, { key: "Enter" });
			await Promise.resolve();

			fireEvent.keyUp(input, { key: "Enter" });
			await Promise.resolve();

			expect(onValueChange).toHaveBeenCalledTimes(1);
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(DATA_SOURCE[1]);

			expect(listbox).not.toBeVisible();

			// run restore focus rAF
			vi.runAllTimers();

			expect(document.activeElement).toBe(input);
			expect(input).toHaveValue("Two");
		});
	});

	describe("multi-select", () => {
		it("supports selecting multiple options", async () => {
			const { getByRole, getByTestId } = render(() => (
				<Combobox.Root
					multiple
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control<DataSourceItem>>
						{(state) => (
							<>
								<span data-testid="value">
									{state
										.selectedOptions()
										.map((option) => option.label)
										.join(", ")}
								</span>
								<Combobox.Input />
								<Combobox.Trigger />
							</>
						)}
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const trigger = getByRole("button");
			expect(getByRole("combobox")).toHaveAttribute(
				"placeholder",
				"Placeholder",
			);

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

			fireEvent.click(trigger);
			await Promise.resolve();

			vi.runAllTimers();

			const listbox = getByRole("listbox");
			const items = within(listbox).getAllByRole("option");

			expect(listbox).toHaveAttribute("aria-multiselectable", "true");

			expect(items.length).toBe(3);
			expect(items[0]).toHaveTextContent("One");
			expect(items[1]).toHaveTextContent("Two");
			expect(items[2]).toHaveTextContent("Three");

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
				onValueChange.mock.calls[0][0]
					.map((option: DataSourceItem) => option.key)
					.includes(DATA_SOURCE[0].key),
			).toBeTruthy();
			expect(
				onValueChange.mock.calls[1][0]
					.map((option: DataSourceItem) => option.key)
					.includes(DATA_SOURCE[2].key),
			).toBeTruthy();

			// Does not close on multi-select
			expect(listbox).toBeVisible();

			expect(getByTestId("value")).toHaveTextContent("One, Three");
		});

		it("supports multiple defaultValue (uncontrolled)", async () => {
			const defaultValue = [DATA_SOURCE[0], DATA_SOURCE[1]];

			const { getByRole } = render(() => (
				<Combobox.Root<DataSourceItem>
					multiple
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					defaultValue={defaultValue}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control<DataSourceItem>>
						{(state) => (
							<>
								<span data-testid="value">
									{state
										.selectedOptions()
										.map((option) => option.label)
										.join(", ")}
								</span>
								<Combobox.Input />
								<Combobox.Trigger />
							</>
						)}
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
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
				onValueChange.mock.calls[0][0]
					.map((option: DataSourceItem) => option.key)
					.includes(DATA_SOURCE[0].key),
			).toBeTruthy();
			expect(
				onValueChange.mock.calls[0][0]
					.map((option: DataSourceItem) => option.key)
					.includes(DATA_SOURCE[1].key),
			).toBeTruthy();
			expect(
				onValueChange.mock.calls[0][0]
					.map((option: DataSourceItem) => option.key)
					.includes(DATA_SOURCE[2].key),
			).toBeTruthy();
		});

		it("supports multiple value (controlled)", async () => {
			const value = [DATA_SOURCE[0], DATA_SOURCE[1]];

			render(() => (
				<Combobox.Root<DataSourceItem>
					multiple
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					value={value}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control<DataSourceItem>>
						{(state) => (
							<>
								<span data-testid="value">
									{state
										.selectedOptions()
										.map((option) => option.label)
										.join(", ")}
								</span>
								<Combobox.Input />
								<Combobox.Trigger />
							</>
						)}
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
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
				onValueChange.mock.calls[0][0]
					.map((option: DataSourceItem) => option.key)
					.includes(DATA_SOURCE[2].key),
			).toBeTruthy();
		});

		it("supports deselection", async () => {
			const defaultValue = [DATA_SOURCE[0], DATA_SOURCE[1]];

			const { getByRole } = render(() => (
				<Combobox.Root<DataSourceItem>
					multiple
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					defaultValue={defaultValue}
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control<DataSourceItem>>
						{(state) => (
							<>
								<span data-testid="value">
									{state
										.selectedOptions()
										.map((option) => option.label)
										.join(", ")}
								</span>
								<Combobox.Input />
								<Combobox.Trigger />
							</>
						)}
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
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
				onValueChange.mock.calls[0][0]
					.map((option: DataSourceItem) => option.key)
					.includes(DATA_SOURCE[0].key),
			).toBeFalsy();
			expect(
				onValueChange.mock.calls[0][0]
					.map((option: DataSourceItem) => option.key)
					.includes(DATA_SOURCE[1].key),
			).toBeTruthy();
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
				<Combobox.Root
					options={dataSource}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.HiddenSelect autocomplete="address-level1" />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const input = getByRole("combobox");

			expect(input).toHaveAttribute("placeholder", "Placeholder");

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
			expect(onValueChange.mock.calls[0][0]).toStrictEqual(dataSource[1]);
			expect(input).toHaveValue("France");
		});

		it("should have a hidden input to marshall focus to the combobox input", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const hiddenInput = getByRole("textbox", { hidden: true }); // get the hidden ones

			expect(hiddenInput).toHaveAttribute("tabIndex", "0");
			expect(hiddenInput).toHaveAttribute("style", "font-size: 16px;");
			expect(hiddenInput.parentElement).toHaveAttribute("aria-hidden", "true");

			hiddenInput.focus();
			await Promise.resolve();

			const input = getByRole("combobox");

			expect(document.activeElement).toBe(input);
			expect(hiddenInput).toHaveAttribute("tabIndex", "-1");

			fireEvent.blur(input);
			await Promise.resolve();

			expect(hiddenInput).toHaveAttribute("tabIndex", "0");
		});
	});

	describe("disabled", () => {
		it("disables the hidden select when disabled is true", async () => {
			const { getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					disabled
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.HiddenSelect />
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
			));

			const select = getByRole("textbox", { hidden: true });

			expect(select).toBeDisabled();
		});

		it("does not open on mouse down when disabled is true", async () => {
			const onOpenChange = vi.fn();

			const { queryByRole, getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					disabled
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
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
			const { queryByRole, getByRole } = render(() => (
				<Combobox.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					disabled
					onChange={onValueChange}
					itemComponent={(props) => (
						<Combobox.Item item={props.item}>
							{props.item.rawValue.label}
						</Combobox.Item>
					)}
				>
					<Combobox.Label>Label</Combobox.Label>
					<Combobox.Control>
						<Combobox.Input />
						<Combobox.Trigger />
					</Combobox.Control>
					<Combobox.Portal>
						<Combobox.Content>
							<Combobox.Listbox />
						</Combobox.Content>
					</Combobox.Portal>
				</Combobox.Root>
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
					<Combobox.Root
						options={DATA_SOURCE}
						optionValue="key"
						optionTextValue="textValue"
						optionDisabled="disabled"
						placeholder="Placeholder"
						optionLabel="label"
						name="test"
						itemComponent={(props) => (
							<Combobox.Item item={props.item}>
								{props.item.rawValue.label}
							</Combobox.Item>
						)}
					>
						<Combobox.HiddenSelect />
						<Combobox.Label>Label</Combobox.Label>
						<Combobox.Control>
							<Combobox.Input autofocus />
							<Combobox.Trigger />
						</Combobox.Control>
						<Combobox.Portal>
							<Combobox.Content>
								<Combobox.Listbox />
							</Combobox.Content>
						</Combobox.Portal>
					</Combobox.Root>
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
					<Combobox.Root
						options={DATA_SOURCE}
						optionValue="key"
						optionTextValue="textValue"
						optionDisabled="disabled"
						placeholder="Placeholder"
						optionLabel="label"
						name="test"
						defaultValue={DATA_SOURCE[0]}
						itemComponent={(props) => (
							<Combobox.Item item={props.item}>
								{props.item.rawValue.label}
							</Combobox.Item>
						)}
					>
						<Combobox.HiddenSelect />
						<Combobox.Label>Label</Combobox.Label>
						<Combobox.Control>
							<Combobox.Input autofocus />
							<Combobox.Trigger />
						</Combobox.Control>
						<Combobox.Portal>
							<Combobox.Content>
								<Combobox.Listbox />
							</Combobox.Content>
						</Combobox.Portal>
					</Combobox.Root>
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
