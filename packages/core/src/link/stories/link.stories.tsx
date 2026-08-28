import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	DisabledExample,
} from "../../../../../apps/docs/src/examples/link.tsx";

const meta = preview.meta({
	title: "Components/Link",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Disabled example. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => <DisabledExample />,
});
