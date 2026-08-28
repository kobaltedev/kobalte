import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	CustomColorNameExample,
	ValueExample,
} from "../../../../../apps/docs/src/examples/color-swatch.tsx";

const meta = preview.meta({
	title: "Components/ColorSwatch",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Value example. */
export const Value = meta.story({
	name: "Value",
	render: () => <ValueExample />,
});

/** Custom Color Name example. */
export const CustomColorName = meta.story({
	name: "Custom Color Name",
	render: () => <CustomColorNameExample />,
});
