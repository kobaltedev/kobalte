import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledValueExample,
	DefaultValueExample,
	HTMLFormExample,
	XAndYChannelExample,
} from "../../../../../apps/docs/src/examples/color-area.tsx";

const meta = preview.meta({
	title: "Components/ColorArea",
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

/** Controlled Value example. */
export const ControlledValue = meta.story({
	name: "Controlled Value",
	render: () => <ControlledValueExample />,
});

/** XAnd YChannel example. */
export const XAndYChannel = meta.story({
	name: "XAnd YChannel",
	render: () => <XAndYChannelExample />,
});

/** HTMLForm example. */
export const HTMLForm = meta.story({
	name: "HTMLForm",
	render: () => <HTMLFormExample />,
});
