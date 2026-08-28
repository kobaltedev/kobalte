import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledValueExample,
	CustomValueLabelExample,
	DefaultValueExample,
	HTMLFormExample,
	ThicknessExample,
} from "../../../../../apps/docs/src/examples/color-wheel.tsx";

const meta = preview.meta({
	title: "Components/ColorWheel",
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

/** Thickness example. */
export const Thickness = meta.story({
	name: "Thickness",
	render: () => <ThicknessExample />,
});

/** Controlled Value example. */
export const ControlledValue = meta.story({
	name: "Controlled Value",
	render: () => <ControlledValueExample />,
});

/** Custom Value Label example. */
export const CustomValueLabel = meta.story({
	name: "Custom Value Label",
	render: () => <CustomValueLabelExample />,
});

/** HTMLForm example. */
export const HTMLForm = meta.story({
	name: "HTMLForm",
	render: () => <HTMLFormExample />,
});
