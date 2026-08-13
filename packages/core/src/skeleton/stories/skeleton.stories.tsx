import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	MultipleSkeletonsExample,
	ToggleExample,
} from "../../../../../apps/docs/src/examples/skeleton.tsx";

const meta = preview.meta({
	title: "Components/Skeleton",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Multiple Skeletons example. */
export const MultipleSkeletons = meta.story({
	name: "Multiple Skeletons",
	render: () => <MultipleSkeletonsExample />,
});

/** Toggle example. */
export const Toggle = meta.story({
	name: "Toggle",
	render: () => <ToggleExample />,
});
