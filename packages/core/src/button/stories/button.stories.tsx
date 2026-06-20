import preview from "../../../../../.storybook/preview.js";
import { Button } from "../index";

const meta = preview.meta({
	title: "Components/Button",
	tags: ["autodocs"],
});

export default meta;

export const Default = meta.story({
	name: "Default",
	render: () => <Button>Click me</Button>,
});

export const Disabled = meta.story({
	name: "Disabled",
	render: () => <Button disabled>Disabled</Button>,
});
