import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
	DefaultValueExample,
	MultipleSelectionExample,
} from "../../../../../apps/docs/src/examples/toggle-group.tsx";

const meta = preview.meta({
	title: "Components/ToggleGroup",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Default Value example. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => <DefaultValueExample />,
});

/** Controlled example. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledExample />,
});

/** Multiple Selection example. */
export const MultipleSelection = meta.story({
	name: "Multiple Selection",
	render: () => <MultipleSelectionExample />,
});
