import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ButtonsExample,
	ControlledExample,
	DefaultPageExample,
	FirstLastExample,
	FixedItemsExample,
	SiblingsExample,
} from "../../../../../apps/docs/src/examples/pagination.tsx";

const meta = preview.meta({
	title: "Components/Pagination",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Default Page example. */
export const DefaultPage = meta.story({
	name: "Default Page",
	render: () => <DefaultPageExample />,
});

/** Controlled example. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledExample />,
});

/** Buttons example. */
export const Buttons = meta.story({
	name: "Buttons",
	render: () => <ButtonsExample />,
});

/** First Last example. */
export const FirstLast = meta.story({
	name: "First Last",
	render: () => <FirstLastExample />,
});

/** Siblings example. */
export const Siblings = meta.story({
	name: "Siblings",
	render: () => <SiblingsExample />,
});

/** Fixed Items example. */
export const FixedItems = meta.story({
	name: "Fixed Items",
	render: () => <FixedItemsExample />,
});
