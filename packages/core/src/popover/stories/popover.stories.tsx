import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
	CustomAnchorExample,
} from "../../../../../apps/docs/src/examples/popover.tsx";

const meta = preview.meta({
	title: "Components/Popover",
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

/** Custom Anchor example. */
export const CustomAnchor = meta.story({
	name: "Custom Anchor",
	render: () => <CustomAnchorExample />,
});
