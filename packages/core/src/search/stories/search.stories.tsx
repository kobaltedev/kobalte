import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	DebounceExample,
	InlineStyleExample,
} from "../../../../../apps/docs/src/examples/search.tsx";

const meta = preview.meta({
	title: "Components/Search",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Debounce example. */
export const Debounce = meta.story({
	name: "Debounce",
	render: () => <DebounceExample />,
});

/** Inline Style example. */
export const InlineStyle = meta.story({
	name: "Inline Style",
	render: () => <InlineStyleExample />,
});
