import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
	DefaultValueExample,
	DescriptionExample,
	ErrorMessageExample,
	HTMLFormExample,
	TriggersExample,
} from "../../../../../apps/docs/src/examples/color-channel-field.tsx";

const meta = preview.meta({
	title: "Components/ColorChannelField",
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

/** Description example. */
export const Description = meta.story({
	name: "Description",
	render: () => <DescriptionExample />,
});

/** Error Message example. */
export const ErrorMessage = meta.story({
	name: "Error Message",
	render: () => <ErrorMessageExample />,
});

/** HTMLForm example. */
export const HTMLForm = meta.story({
	name: "HTMLForm",
	render: () => <HTMLFormExample />,
});

/** Triggers example. */
export const Triggers = meta.story({
	name: "Triggers",
	render: () => <TriggersExample />,
});
