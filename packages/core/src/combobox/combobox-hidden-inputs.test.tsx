import { render } from "@solidjs/testing-library";
import * as Combobox from ".";

interface DataSourceItem {
	key: string;
	label: string;
	textValue: string;
	disabled: boolean;
}

const DATA_SOURCE: DataSourceItem[] = [
	{ key: "apple", label: "Apple", textValue: "Apple", disabled: false },
	{ key: "banana", label: "Banana", textValue: "Banana", disabled: false },
	{ key: "cherry", label: "Cherry", textValue: "Cherry", disabled: false },
];

describe("Combobox.HiddenInputs", () => {
	it("renders one hidden input per selected value for native form submission", () => {
		const { container } = render(() => (
			<Combobox.Root<DataSourceItem>
				name="fruits"
				multiple
				value={[DATA_SOURCE[0], DATA_SOURCE[1]]}
				options={DATA_SOURCE}
				optionValue="key"
				optionTextValue="textValue"
				optionLabel="label"
				itemComponent={(props) => (
					<Combobox.Item item={props.item}>
						{props.item.rawValue.label}
					</Combobox.Item>
				)}
			>
				<Combobox.HiddenInputs />
			</Combobox.Root>
		));

		const hiddenInputs = container.querySelectorAll(
			'input[type="hidden"][name="fruits"]',
		);

		expect(hiddenInputs).toHaveLength(2);
		expect((hiddenInputs[0] as HTMLInputElement).value).toBe("apple");
		expect((hiddenInputs[1] as HTMLInputElement).value).toBe("banana");
	});

	it("renders no hidden inputs when nothing is selected", () => {
		const { container } = render(() => (
			<Combobox.Root<DataSourceItem>
				name="fruits"
				multiple
				value={[] as DataSourceItem[]}
				options={DATA_SOURCE}
				optionValue="key"
				optionTextValue="textValue"
				optionLabel="label"
				itemComponent={(props) => (
					<Combobox.Item item={props.item}>
						{props.item.rawValue.label}
					</Combobox.Item>
				)}
			>
				<Combobox.HiddenInputs />
			</Combobox.Root>
		));

		expect(
			container.querySelectorAll('input[type="hidden"][name="fruits"]'),
		).toHaveLength(0);
	});
});
