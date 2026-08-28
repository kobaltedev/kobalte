import preview from "../../../../../.storybook/preview.js";
import { BasicExample } from "../../../../../apps/docs/src/examples/alert.tsx";

const meta = preview.meta({
	title: "Components/Alert",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});
