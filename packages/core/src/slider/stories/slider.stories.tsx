import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
	CustomValueLabelExample,
	MinStepsBetweenExample,
	MultipleThumbsExample,
	StepExample,
	VerticalSliderExample,
} from "../../../../../apps/docs/src/examples/slider.tsx";

const meta = preview.meta({
	title: "Components/Slider",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Multiple Thumbs example. */
export const MultipleThumbs = meta.story({
	name: "Multiple Thumbs",
	render: () => <MultipleThumbsExample />,
});

/** Step example. */
export const Step = meta.story({
	name: "Step",
	render: () => <StepExample />,
});

/** Min Steps Between example. */
export const MinStepsBetween = meta.story({
	name: "Min Steps Between",
	render: () => <MinStepsBetweenExample />,
});

/** Vertical Slider example. */
export const VerticalSlider = meta.story({
	name: "Vertical Slider",
	render: () => <VerticalSliderExample />,
});

/** Custom Value Label example. */
export const CustomValueLabel = meta.story({
	name: "Custom Value Label",
	render: () => <CustomValueLabelExample />,
});

/** Controlled example. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledExample />,
});
