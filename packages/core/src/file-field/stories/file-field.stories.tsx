import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	HTMLFormExample,
} from "../../../../../apps/docs/src/examples/file-field.tsx";

const meta = preview.meta({
	title: "Components/FileField",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** HTMLForm example. */
export const HTMLForm = meta.story({
	name: "HTMLForm",
	render: () => <HTMLFormExample />,
});
