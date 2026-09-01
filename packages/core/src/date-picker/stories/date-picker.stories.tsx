import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	DescriptionExample,
	DisabledExample,
	ErrorMessageExample,
	MinMaxExample,
	MultipleExample,
	RangeExample,
} from "../../../../../apps/docs/src/examples/date-picker.tsx";

const meta = preview.meta({
	title: "Components/DatePicker",
	tags: ["autodocs"],
});

export default meta;

/** Basic usage (single selection). */
export const Basic = meta.story({
	name: "Basic",
	render: () => <BasicExample />,
});

/** Multiple selection example. */
export const Multiple = meta.story({
	name: "Multiple",
	render: () => <MultipleExample />,
});

/** Range selection example. */
export const Range = meta.story({
	name: "Range",
	render: () => <RangeExample />,
});

/** Min Max example. */
export const MinMax = meta.story({
	name: "Min Max",
	render: () => <MinMaxExample />,
});

/** Disabled example. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => <DisabledExample />,
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
