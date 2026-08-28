import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	CustomSeparatorExample,
} from "../../../../../apps/docs/src/examples/breadcrumbs.tsx";

const meta = preview.meta({
	title: "Components/Breadcrumbs",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Custom Separator example. */
export const CustomSeparator = meta.story({
	name: "Custom Separator",
	render: () => <CustomSeparatorExample />,
});
