import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { createSignal, flush, For } from "solid-js";
import * as Combobox from ".";

interface DataSourceItem {
	key: string;
	label: string;
}

const DATA_SOURCE: DataSourceItem[] = [
	{ key: "apple", label: "Apple" },
	{ key: "banana", label: "Banana" },
	{ key: "cherry", label: "Cherry" },
];

function ComboboxExample() {
	const [value, setValue] = createSignal<DataSourceItem[]>([...DATA_SOURCE]);

	return (
		<Combobox.Root<DataSourceItem>
			multiple
			value={value()}
			onChange={(v) => setValue(v)}
			options={DATA_SOURCE}
			optionValue="key"
			optionTextValue="label"
			optionLabel="label"
			itemComponent={(props) => (
				<Combobox.Item item={props.item}>
					{props.item.rawValue.label}
				</Combobox.Item>
			)}
		>
			<Combobox.Control<DataSourceItem> data-testid="control">
				{(state) => (
					<>
						<For each={state.selectedOptions()} keyed={false}>
							{(getOption, index) => (
								<Combobox.ControlItem
									data-testid="chip"
									option={getOption()}
									index={index}
									textValue={getOption().label}
								>
									{getOption().label}
								</Combobox.ControlItem>
							)}
						</For>
						<Combobox.Input data-testid="input" />
					</>
				)}
			</Combobox.Control>
		</Combobox.Root>
	);
}

describe("Combobox.ControlItem", () => {
	afterEach(() => {
		cleanup();
	});

	it("ArrowLeft/ArrowRight navigate between chips and ArrowRight exits back to the input", () => {
		const { getByTestId, getAllByTestId } = render(() => <ComboboxExample />);

		const chips = getAllByTestId("chip");

		chips[1].focus();
		flush();

		fireEvent.keyDown(chips[1], { key: "ArrowLeft" });
		flush();
		expect(document.activeElement).toBe(chips[0]);

		fireEvent.keyDown(chips[0], { key: "ArrowRight" });
		flush();
		expect(document.activeElement).toBe(chips[1]);

		fireEvent.keyDown(chips[1], { key: "ArrowRight" });
		flush();
		expect(document.activeElement).toBe(chips[2]);

		fireEvent.keyDown(chips[2], { key: "ArrowRight" });
		flush();
		expect(document.activeElement).toBe(getByTestId("input"));
	});

	it("Backspace on a focused chip removes it and refocuses a neighbor", () => {
		const { getAllByTestId } = render(() => <ComboboxExample />);

		let chips = getAllByTestId("chip");
		chips[1].focus();
		flush();

		fireEvent.keyDown(chips[1], { key: "Backspace" });
		flush();

		chips = getAllByTestId("chip");
		expect(chips.map((chip) => chip.textContent)).toEqual([
			"Apple",
			"Cherry",
		]);
		expect(document.activeElement).toBe(chips[1]);
	});

	it("Backspace on the last remaining chip focuses the input", () => {
		const { getByTestId, getAllByTestId, queryAllByTestId } = render(() => (
			<ComboboxExample />
		));

		fireEvent.keyDown(getAllByTestId("chip")[0], { key: "Backspace" });
		flush();
		fireEvent.keyDown(getAllByTestId("chip")[0], { key: "Backspace" });
		flush();

		const lastChip = getAllByTestId("chip")[0];
		lastChip.focus();
		flush();

		fireEvent.keyDown(lastChip, { key: "Backspace" });
		flush();

		expect(queryAllByTestId("chip")).toHaveLength(0);
		expect(document.activeElement).toBe(getByTestId("input"));
	});
});
