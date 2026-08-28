import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledValueExample,
	DefaultValueExample,
	DescriptionExample,
	ErrorMessageExample,
	GranularityExample,
	HourCycleExample,
	HTMLFormExample,
	MinMaxExample,
	PlaceholderValueExample,
} from "../../../../../apps/docs/src/examples/time-field.tsx";

const meta = preview.meta({
	title: "Components/TimeField",
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

/** Controlled Value example. */
export const ControlledValue = meta.story({
	name: "Controlled Value",
	render: () => <ControlledValueExample />,
});

/** Granularity example. */
export const Granularity = meta.story({
	name: "Granularity",
	render: () => <GranularityExample />,
});

/** Min Max example. */
export const MinMax = meta.story({
	name: "Min Max",
	render: () => <MinMaxExample />,
});

/** Placeholder Value example. */
export const PlaceholderValue = meta.story({
	name: "Placeholder Value",
	render: () => <PlaceholderValueExample />,
});

/** Hour Cycle example. */
export const HourCycle = meta.story({
	name: "Hour Cycle",
	render: () => <HourCycleExample />,
});

/** Description example. */
export const Description = meta.story({
	name: "Description",
	render: () => <DescriptionExample />,
});

/** Error Message example. */
export const ErrorMessage = meta.story({
	name: "Error Message",
	render: () => <ErrorMessageExample />,
});

/** HTMLForm example. */
export const HTMLForm = meta.story({
	name: "HTMLForm",
	render: () => <HTMLFormExample />,
});
