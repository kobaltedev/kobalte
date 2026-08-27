import { render } from "@solidjs/testing-library";
import { Select } from "../select/index.tsx";

it("debug3", () => {
	const { container } = render(() => (
		<Select
			options={["a", "b"]}
			itemComponent={(props) => <Select.Item item={props.item}>{props.item.rawValue}</Select.Item>}
		>
			<Select.Trigger>
				<Select.Value<string>>{(state) => state.selectedOption()}</Select.Value>
			</Select.Trigger>
		</Select>
	));
	console.log(container.innerHTML);
});
