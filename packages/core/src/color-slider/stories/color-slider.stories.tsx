import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledValueExample,
	CustomValueExample,
	DefaultValueExample,
	VerticalSliderExample,
} from "../../../../../apps/docs/src/examples/color-slider.tsx";

const meta = preview.meta({
	title: "Components/ColorSlider",
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

/** Vertical Slider example. */
export const VerticalSlider = meta.story({
	name: "Vertical Slider",
	render: () => <VerticalSliderExample />,
});

/** Custom Value example. */
export const CustomValue = meta.story({
	name: "Custom Value",
	render: () => <CustomValueExample />,
});
