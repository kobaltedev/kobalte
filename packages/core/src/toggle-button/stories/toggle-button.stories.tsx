import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
	DefaultPressedExample,
} from "../../../../../apps/docs/src/examples/toggle-button.tsx";

const meta = preview.meta({
	title: "Components/ToggleButton",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Default Pressed example. */
export const DefaultPressed = meta.story({
	name: "Default Pressed",
	render: () => <DefaultPressedExample />,
});

/** Controlled example. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledExample />,
});
