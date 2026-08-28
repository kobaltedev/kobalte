import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	CustomValueLabelExample,
	CustomValueScaleExample,
} from "../../../../../apps/docs/src/examples/progress.tsx";

const meta = preview.meta({
	title: "Components/Progress",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Custom Value Scale example. */
export const CustomValueScale = meta.story({
	name: "Custom Value Scale",
	render: () => <CustomValueScaleExample />,
});

/** Custom Value Label example. */
export const CustomValueLabel = meta.story({
	name: "Custom Value Label",
	render: () => <CustomValueLabelExample />,
});
