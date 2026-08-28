import preview from "../../../../../.storybook/preview.js";
import { BasicExample } from "../../../../../apps/docs/src/examples/collapsible.tsx";

const meta = preview.meta({
	title: "Components/Collapsible",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});
