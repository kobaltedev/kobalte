import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
	DescriptionExample,
	ErrorMessageExample,
	HTMLFormExample,
	VerticalExample,
} from "../../../../../apps/docs/src/examples/segmented-control.tsx";

const meta = preview.meta({
	title: "Components/SegmentedControl",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Vertical example. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => <VerticalExample />,
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
