/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-spectrum/picker/test/Picker.test.js
 */

import { installPointerEvent } from "@kobalte/tests";
import { fireEvent, render, within } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as Search from ".";
import { DebouncerTimeout } from "./utils";

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
describe("Search", () => {
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

	it("debounce", () => {
		const callbackSpy = vi.fn();
		const debouncer = DebouncerTimeout();
		debouncer.setDebounceMillisecond(1000);

		debouncer.debounce(callbackSpy);
		expect(callbackSpy).not.toHaveBeenCalled();

		vi.advanceTimersByTime(500);
		debouncer.debounce(callbackSpy);
		expect(callbackSpy).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1000);
		debouncer.debounce(callbackSpy);
		expect(callbackSpy).toHaveBeenCalledOnce();

		vi.advanceTimersByTime(500);
		expect(callbackSpy).toHaveBeenCalledOnce();

		vi.advanceTimersByTime(1000);
		expect(callbackSpy).toHaveBeenCalledTimes(2);
	});

	it("renders correctly", () => {
		const placeholder = "Test placeholder";

		const { getByRole, getByText, getByPlaceholderText } = render(() => (
			<Search.Root
				options={DATA_SOURCE}
				optionValue="key"
				optionTextValue="textValue"
				optionLabel="label"
				optionDisabled="disabled"
				placeholder={placeholder}
				itemComponent={(props) => (
					<Search.Item item={props.item}>
						{props.item.rawValue.label}
					</Search.Item>
				)}
			>
				<Search.HiddenSelect />
				<Search.Label>Label</Search.Label>
				<Search.Control>
					<Search.Input />
				</Search.Control>
				<Search.Portal>
					<Search.Content>
						<Search.Listbox />
					</Search.Content>
				</Search.Portal>
			</Search.Root>
		));

		const root = getByRole("group");

		expect(root).toBeInTheDocument();
		expect(root).toBeInstanceOf(HTMLDivElement);

		const input = getByRole("combobox");
		const placeHolderElement = getByPlaceholderText(placeholder);
		expect(input).toBe(placeHolderElement);

		expect(input).toHaveAttribute("aria-autocomplete", "list");
		expect(input).not.toHaveAttribute("aria-controls");
		expect(input).not.toHaveAttribute("aria-activedescendant");
		expect(input).not.toBeDisabled();

		const label = getByText("Label");
		expect(label).toBeVisible();
	});

	describe("help text", () => {
		it("supports description", () => {
			const { getByRole, getByText } = render(() => (
				<Search.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Search.Item item={props.item}>
							{props.item.rawValue.label}
						</Search.Item>
					)}
				>
					<Search.Label>Label</Search.Label>
					<Search.Control>
						<Search.Input />
					</Search.Control>
					<Search.Description>Description</Search.Description>
					<Search.Portal>
						<Search.Content>
							<Search.Listbox />
						</Search.Content>
					</Search.Portal>
				</Search.Root>
			));

			const input = getByRole("combobox");
			const description = getByText("Description");

			expect(description).toHaveAttribute("id");
			expect(input).toHaveAttribute("aria-describedby", description.id);
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
				<Search.Root
					options={dataSource}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Search.Item item={props.item}>
							{props.item.rawValue.label}
						</Search.Item>
					)}
				>
					<Search.HiddenSelect autocomplete="address-level1" />
					<Search.Label>Label</Search.Label>
					<Search.Control>
						<Search.Input />
					</Search.Control>
					<Search.Portal>
						<Search.Content>
							<Search.Listbox />
						</Search.Content>
					</Search.Portal>
				</Search.Root>
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

		it("should have a hidden input to marshall focus to the Search input", async () => {
			const { getByRole } = render(() => (
				<Search.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					onChange={onValueChange}
					itemComponent={(props) => (
						<Search.Item item={props.item}>
							{props.item.rawValue.label}
						</Search.Item>
					)}
				>
					<Search.HiddenSelect />
					<Search.Label>Label</Search.Label>
					<Search.Control>
						<Search.Input />
					</Search.Control>
					<Search.Portal>
						<Search.Content>
							<Search.Listbox />
						</Search.Content>
					</Search.Portal>
				</Search.Root>
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
				<Search.Root
					options={DATA_SOURCE}
					optionValue="key"
					optionTextValue="textValue"
					optionDisabled="disabled"
					placeholder="Placeholder"
					optionLabel="label"
					disabled
					onChange={onValueChange}
					itemComponent={(props) => (
						<Search.Item item={props.item}>
							{props.item.rawValue.label}
						</Search.Item>
					)}
				>
					<Search.HiddenSelect />
					<Search.Label>Label</Search.Label>
					<Search.Control>
						<Search.Input />
					</Search.Control>
					<Search.Portal>
						<Search.Content>
							<Search.Listbox />
						</Search.Content>
					</Search.Portal>
				</Search.Root>
			));

			const select = getByRole("textbox", { hidden: true });
			expect(select).toBeDisabled();
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
					<Search.Root
						options={DATA_SOURCE}
						optionValue="key"
						optionTextValue="textValue"
						optionDisabled="disabled"
						placeholder="Placeholder"
						optionLabel="label"
						name="test"
						itemComponent={(props) => (
							<Search.Item item={props.item}>
								{props.item.rawValue.label}
							</Search.Item>
						)}
					>
						<Search.HiddenSelect />
						<Search.Label>Label</Search.Label>
						<Search.Control>
							<Search.Input autofocus />
						</Search.Control>
						<Search.Portal>
							<Search.Content>
								<Search.Listbox />
							</Search.Content>
						</Search.Portal>
					</Search.Root>
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
					<Search.Root
						options={DATA_SOURCE}
						optionValue="key"
						optionTextValue="textValue"
						optionDisabled="disabled"
						placeholder="Placeholder"
						optionLabel="label"
						name="test"
						defaultValue={DATA_SOURCE[0]}
						itemComponent={(props) => (
							<Search.Item item={props.item}>
								{props.item.rawValue.label}
							</Search.Item>
						)}
					>
						<Search.HiddenSelect />
						<Search.Label>Label</Search.Label>
						<Search.Control>
							<Search.Input autofocus />
						</Search.Control>
						<Search.Portal>
							<Search.Content>
								<Search.Listbox />
							</Search.Content>
						</Search.Portal>
					</Search.Root>
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
