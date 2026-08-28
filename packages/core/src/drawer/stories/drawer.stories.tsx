import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
	SnapPointsExample,
} from "../../../../../apps/docs/src/examples/drawer.tsx";

const meta = preview.meta({
	title: "Components/Drawer",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Snap Points example. */
export const SnapPoints = meta.story({
	name: "Snap Points",
	render: () => <SnapPointsExample />,
});

/** Controlled example. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledExample />,
});
