import { installPointerEvent } from "@kobalte/tests";
import { cleanup, fireEvent, render, within } from "@solidjs/testing-library";
import { createSignal, flush, For } from "solid-js";
import { vi } from "vitest";

import * as TagsInput from ".";
import type { TagsInputRootProps } from ".";
import { useTagsInputContext } from "./tags-input-context";

function TagsExampleItems() {
	const context = useTagsInputContext();

	return (
		<For each={context.value()} keyed={false}>
			{(getValue, index) => (
				<TagsInput.Item data-testid="item" value={getValue()} index={index}>
					<TagsInput.ItemPreview data-testid="item-preview">
						<TagsInput.ItemText data-testid="item-text" />
						<TagsInput.ItemDeleteTrigger data-testid="item-delete">
							x
						</TagsInput.ItemDeleteTrigger>
					</TagsInput.ItemPreview>
					<TagsInput.ItemInput data-testid="item-input" />
				</TagsInput.Item>
			)}
		</For>
	);
}

function TagsExample(props: TagsInputRootProps) {
	return (
		<TagsInput.Root {...props}>
			<TagsInput.Label>Tags</TagsInput.Label>
			<TagsInput.Control data-testid="control">
				<TagsExampleItems />
				<TagsInput.Input data-testid="input" />
			</TagsInput.Control>
			<TagsInput.ClearTrigger data-testid="clear">Clear</TagsInput.ClearTrigger>
			<TagsInput.Description data-testid="description">
				Press enter to add a tag
			</TagsInput.Description>
			<TagsInput.ErrorMessage data-testid="error">
				Invalid tag
			</TagsInput.ErrorMessage>
			<TagsInput.HiddenInput />
		</TagsInput.Root>
	);
}

describe("TagsInput", () => {
	afterEach(() => {
		cleanup();
	});

	installPointerEvent();

	it("renders the provided default tags", () => {
		const { getAllByTestId } = render(() => (
			<TagsExample defaultValue={["red", "green"]} />
		));

		const items = getAllByTestId("item-text");

		expect(items).toHaveLength(2);
		expect(items[0]).toHaveTextContent("red");
		expect(items[1]).toHaveTextContent("green");
	});

	it("root has role='group' and reflects the empty state", () => {
		const { getByRole } = render(() => <TagsExample />);

		const root = getByRole("group");

		expect(root).toHaveAttribute("data-empty", "");
	});

	it("typing then pressing Enter adds a tag and clears the input", () => {
		const { getByTestId, queryAllByTestId } = render(() => <TagsExample />);

		const input = getByTestId("input") as HTMLInputElement;

		fireEvent.input(input, { target: { value: "blue" } });
		flush();

		fireEvent.keyDown(input, { key: "Enter" });
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(1);
		expect(queryAllByTestId("item-text")[0]).toHaveTextContent("blue");
		expect(input.value).toBe("");
	});

	it("typing the delimiter immediately commits the tag", () => {
		const { getByTestId, queryAllByTestId } = render(() => <TagsExample />);

		const input = getByTestId("input") as HTMLInputElement;

		fireEvent.input(input, { target: { value: "red," } });
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(1);
		expect(queryAllByTestId("item-text")[0]).toHaveTextContent("red");
		expect(input.value).toBe("");
	});

	it("Backspace on an empty input removes the last tag", () => {
		const { getByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["a", "b"]} />
		));

		const input = getByTestId("input") as HTMLInputElement;

		fireEvent.keyDown(input, { key: "Backspace" });
		flush();

		const items = queryAllByTestId("item-text");
		expect(items).toHaveLength(1);
		expect(items[0]).toHaveTextContent("a");
	});

	it("rejects duplicate tags by default", () => {
		const { getByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["red"]} />
		));

		const input = getByTestId("input") as HTMLInputElement;

		fireEvent.input(input, { target: { value: "red" } });
		flush();
		fireEvent.keyDown(input, { key: "Enter" });
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(1);
	});

	it("allows duplicate tags when allowDuplicates is true", () => {
		const { getByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["red"]} allowDuplicates />
		));

		const input = getByTestId("input") as HTMLInputElement;

		fireEvent.input(input, { target: { value: "red" } });
		flush();
		fireEvent.keyDown(input, { key: "Enter" });
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(2);
	});

	it("respects the max tag count", () => {
		const { getByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["a", "b"]} max={2} />
		));

		const input = getByTestId("input") as HTMLInputElement;

		fireEvent.input(input, { target: { value: "c" } });
		flush();
		fireEvent.keyDown(input, { key: "Enter" });
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(2);
	});

	it("rejects tags that fail the validate function", () => {
		const { getByTestId, queryAllByTestId } = render(() => (
			<TagsExample validate={({ value }) => value !== "bad"} />
		));

		const input = getByTestId("input") as HTMLInputElement;

		fireEvent.input(input, { target: { value: "bad" } });
		flush();
		fireEvent.keyDown(input, { key: "Enter" });
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(0);

		fireEvent.input(input, { target: { value: "good" } });
		flush();
		fireEvent.keyDown(input, { key: "Enter" });
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(1);
		expect(queryAllByTestId("item-text")[0]).toHaveTextContent("good");
	});

	it("clicking an item's delete trigger removes that tag", () => {
		const { getAllByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["a", "b", "c"]} />
		));

		const deleteTriggers = getAllByTestId("item-delete");

		fireEvent.click(deleteTriggers[1]);
		flush();

		const items = queryAllByTestId("item-text");
		expect(items).toHaveLength(2);
		expect(items[0]).toHaveTextContent("a");
		expect(items[1]).toHaveTextContent("c");
	});

	it("clear trigger removes every tag and disables itself when empty", () => {
		const { getByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["a", "b"]} />
		));

		const clearTrigger = getByTestId("clear") as HTMLButtonElement;

		expect(clearTrigger).not.toBeDisabled();

		fireEvent.click(clearTrigger);
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(0);
		expect(clearTrigger).toBeDisabled();
	});

	it("ArrowLeft from an empty input focuses the last tag", () => {
		const { getByTestId, getAllByTestId } = render(() => (
			<TagsExample defaultValue={["a", "b"]} />
		));

		const input = getByTestId("input") as HTMLInputElement;
		input.focus();
		flush();

		fireEvent.keyDown(input, { key: "ArrowLeft" });
		flush();

		const items = getAllByTestId("item");
		expect(document.activeElement).toBe(items[1]);
	});

	it("ArrowLeft/ArrowRight navigate between tags and ArrowRight exits back to the input", () => {
		const { getByTestId, getAllByTestId } = render(() => (
			<TagsExample defaultValue={["a", "b", "c"]} />
		));

		const items = getAllByTestId("item");

		items[1].focus();
		flush();

		fireEvent.keyDown(items[1], { key: "ArrowLeft" });
		flush();
		expect(document.activeElement).toBe(items[0]);

		fireEvent.keyDown(items[0], { key: "ArrowRight" });
		flush();
		expect(document.activeElement).toBe(items[1]);

		fireEvent.keyDown(items[1], { key: "ArrowRight" });
		flush();
		expect(document.activeElement).toBe(items[2]);

		fireEvent.keyDown(items[2], { key: "ArrowRight" });
		flush();
		expect(document.activeElement).toBe(getByTestId("input"));
	});

	it("Enter on a focused tag enters edit mode and commits the new value", () => {
		const { getAllByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["a"]} />
		));

		const item = getAllByTestId("item")[0];
		item.focus();
		flush();

		fireEvent.keyDown(item, { key: "Enter" });
		flush();

		const itemInput = queryAllByTestId("item-input")[0] as HTMLInputElement;
		expect(itemInput).toBeInTheDocument();

		fireEvent.input(itemInput, { target: { value: "renamed" } });
		flush();
		fireEvent.keyDown(itemInput, { key: "Enter" });
		flush();

		expect(queryAllByTestId("item-input")).toHaveLength(0);
		expect(queryAllByTestId("item-text")[0]).toHaveTextContent("renamed");
	});

	it("Escape cancels an in-progress edit", () => {
		const { getAllByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["a"]} />
		));

		const item = getAllByTestId("item")[0];
		item.focus();
		flush();

		fireEvent.keyDown(item, { key: "Enter" });
		flush();

		const itemInput = queryAllByTestId("item-input")[0] as HTMLInputElement;
		fireEvent.input(itemInput, { target: { value: "changed" } });
		flush();
		fireEvent.keyDown(itemInput, { key: "Escape" });
		flush();

		expect(queryAllByTestId("item-input")).toHaveLength(0);
		expect(queryAllByTestId("item-text")[0]).toHaveTextContent("a");
	});

	it("supports controlled value/onChange", () => {
		const onChange = vi.fn();

		function Controlled() {
			const [value, setValue] = createSignal<string[]>(["a"]);

			return (
				<TagsExample
					value={value()}
					onChange={(v) => {
						setValue(v);
						onChange(v);
					}}
				/>
			);
		}

		const { getByTestId, queryAllByTestId } = render(() => <Controlled />);

		const input = getByTestId("input") as HTMLInputElement;
		fireEvent.input(input, { target: { value: "b" } });
		flush();
		fireEvent.keyDown(input, { key: "Enter" });
		flush();

		expect(onChange).toHaveBeenCalledWith(["a", "b"]);
		expect(queryAllByTestId("item-text")).toHaveLength(2);
	});

	it("disabled tags input blocks adding and removing tags", () => {
		const { getByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["a"]} disabled />
		));

		const input = getByTestId("input") as HTMLInputElement;
		expect(input).toBeDisabled();

		fireEvent.input(input, { target: { value: "b" } });
		flush();
		fireEvent.keyDown(input, { key: "Enter" });
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(1);
		expect(queryAllByTestId("item-delete")[0]).toBeDisabled();
	});

	it("readOnly blocks removal but the input stays focusable", () => {
		const { getByTestId, queryAllByTestId } = render(() => (
			<TagsExample defaultValue={["a"]} readOnly />
		));

		const input = getByTestId("input") as HTMLInputElement;
		expect(input).toHaveAttribute("readonly");

		fireEvent.keyDown(input, { key: "Backspace" });
		flush();

		expect(queryAllByTestId("item-text")).toHaveLength(1);
	});

	it("renders one hidden input per tag for native form submission", () => {
		const { container } = render(() => (
			<TagsExample name="fruits" defaultValue={["apple", "banana"]} />
		));

		const hiddenInputs = container.querySelectorAll(
			'input[type="hidden"][name="fruits"]',
		);

		expect(hiddenInputs).toHaveLength(2);
		expect((hiddenInputs[0] as HTMLInputElement).value).toBe("apple");
		expect((hiddenInputs[1] as HTMLInputElement).value).toBe("banana");
	});

	it("reflects validationState as data-invalid on the root", () => {
		const { getByRole } = render(() => (
			<TagsExample validationState="invalid" />
		));

		expect(getByRole("group")).toHaveAttribute("data-invalid", "");
	});
});
