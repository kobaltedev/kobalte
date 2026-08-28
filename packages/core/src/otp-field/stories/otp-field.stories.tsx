import preview from "../../../../../.storybook/preview.js";
import {
	AnimatedExample,
	BasicExample,
	ControlledExample,
	CustomPatternExample,
	DefaultValueExample,
	HTMLFormExample,
	OnCompleteExample,
	ValidationExample,
} from "../../../../../apps/docs/src/examples/otp-field.tsx";

const meta = preview.meta({
	title: "Components/OTPField",
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

/** On Complete example. */
export const OnComplete = meta.story({
	name: "On Complete",
	render: () => <OnCompleteExample />,
});

/** Custom Pattern example. */
export const CustomPattern = meta.story({
	name: "Custom Pattern",
	render: () => <CustomPatternExample />,
});

/** Animated example. */
export const Animated = meta.story({
	name: "Animated",
	render: () => <AnimatedExample />,
});

/** Validation example. */
export const Validation = meta.story({
	name: "Validation",
	render: () => <ValidationExample />,
});

/** HTMLForm example. */
export const HTMLForm = meta.story({
	name: "HTMLForm",
	render: () => <HTMLFormExample />,
});
