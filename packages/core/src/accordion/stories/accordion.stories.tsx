import preview from "../../../../../.storybook/preview.js";
import {
	AllowMultipleExample,
	BasicExample,
	CollapsibleExample,
	ControlledExample,
	DefaultValueExample,
} from "../../../../../apps/docs/src/examples/accordion.tsx";

const meta = preview.meta({
	title: "Components/Accordion",
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

/** Collapsible example. */
export const Collapsible = meta.story({
	name: "Collapsible",
	render: () => <CollapsibleExample />,
});

/** Allow Multiple example. */
export const AllowMultiple = meta.story({
	name: "Allow Multiple",
	render: () => <AllowMultipleExample />,
});
