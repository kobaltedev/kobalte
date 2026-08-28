import preview from "../../../../../.storybook/preview.js";
import {
	AnimationExample,
	BasicExample,
} from "../../../../../apps/docs/src/examples/navigation-menu.tsx";

const meta = preview.meta({
	title: "Components/NavigationMenu",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Animation example. */
export const Animation = meta.story({
	name: "Animation",
	render: () => <AnimationExample />,
});
