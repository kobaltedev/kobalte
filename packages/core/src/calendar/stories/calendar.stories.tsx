import preview from "../../../../../.storybook/preview.js";
import {
	BasicExample,
	ControlledExample,
	DisabledExample,
	MinMaxExample,
	MultipleExample,
	RangeExample,
	UnavailableDatesExample,
} from "../../../../../apps/docs/src/examples/calendar.tsx";

const meta = preview.meta({
	title: "Components/Calendar",
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

/** Controlled value example. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledExample />,
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

/** Unavailable dates example. */
export const UnavailableDates = meta.story({
	name: "Unavailable Dates",
	render: () => <UnavailableDatesExample />,
});
