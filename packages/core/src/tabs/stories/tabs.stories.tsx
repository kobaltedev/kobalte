import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
	DefaultValueExample,
	DisabledTabsExample,
	DynamicContentExample,
	FocusableContentExample,
	ManualActivationExample,
	SingleDisabledTabExample,
	VerticalOrientationExample,
} from "../../../../../apps/docs/src/examples/tabs.tsx";

const meta = preview.meta({
	title: "Components/Tabs",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage. */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Default Value example. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => <DefaultValueExample />,
});

/** Controlled example. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledExample />,
});

/** Focusable Content example. */
export const FocusableContent = meta.story({
	name: "Focusable Content",
	render: () => <FocusableContentExample />,
});

/** Dynamic Content example. */
export const DynamicContent = meta.story({
	name: "Dynamic Content",
	render: () => <DynamicContentExample />,
});

/** Manual Activation example. */
export const ManualActivation = meta.story({
	name: "Manual Activation",
	render: () => <ManualActivationExample />,
});

/** Vertical Orientation example. */
export const VerticalOrientation = meta.story({
	name: "Vertical Orientation",
	render: () => <VerticalOrientationExample />,
});

/** Disabled Tabs example. */
export const DisabledTabs = meta.story({
	name: "Disabled Tabs",
	render: () => <DisabledTabsExample />,
});

/** Single Disabled Tab example. */
export const SingleDisabledTab = meta.story({
	name: "Single Disabled Tab",
	render: () => <SingleDisabledTabExample />,
});
