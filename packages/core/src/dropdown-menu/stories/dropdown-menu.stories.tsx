import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
} from "../../../../../apps/docs/src/examples/dropdown-menu.tsx";

const meta = preview.meta({
	title: "Components/DropdownMenu",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Controlled example. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledExample />,
});
