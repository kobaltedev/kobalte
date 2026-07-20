import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Indicator,
	Item,
	ItemControl,
	ItemInput,
	ItemLabel,
	Label,
	Root,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/SegmentedControl",
	tags: ["autodocs"],
});

export default meta;

export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.segmentedControlRoot} defaultValue="month">
			<Indicator class={style.segmentedControlIndicator} />
			{(["Day", "Month", "Year"] as const).map((label) => (
				<Item class={style.segmentedControlItem} value={label.toLowerCase()}>
					<ItemInput />
					<ItemControl class={style.segmentedControlItemControl} />
					<ItemLabel class={style.segmentedControlItemLabel}>{label}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={style.segmentedControlRoot} defaultValue="year">
			<Indicator class={style.segmentedControlIndicator} />
			{(["Day", "Month", "Year"] as const).map((label) => (
				<Item class={style.segmentedControlItem} value={label.toLowerCase()}>
					<ItemInput />
					<ItemControl class={style.segmentedControlItemControl} />
					<ItemLabel class={style.segmentedControlItemLabel}>{label}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

export const WithLabel = meta.story({
	name: "With Label",
	render: () => (
		<div class={style.segmentedControlWrapper}>
			<Root class={style.segmentedControlRoot} defaultValue="grid">
				<Label class={style.segmentedControlLabel}>View</Label>
				<Indicator class={style.segmentedControlIndicator} />
				{(["List", "Grid", "Kanban"] as const).map((label) => (
					<Item class={style.segmentedControlItem} value={label.toLowerCase()}>
						<ItemInput />
						<ItemControl class={style.segmentedControlItemControl} />
						<ItemLabel class={style.segmentedControlItemLabel}>
							{label}
						</ItemLabel>
					</Item>
				))}
			</Root>
		</div>
	),
});

export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root
			class={`${style.segmentedControlRoot} ${style.segmentedControlRootDisabled}`}
			defaultValue="month"
			disabled
		>
			<Indicator class={style.segmentedControlIndicator} />
			{(["Day", "Month", "Year"] as const).map((label) => (
				<Item
					class={`${style.segmentedControlItem} ${style.segmentedControlItemPointerNone}`}
					value={label.toLowerCase()}
				>
					<ItemInput />
					<ItemControl
						class={`${style.segmentedControlItemControl} ${style.segmentedControlItemControlNoCursor}`}
					/>
					<ItemLabel class={style.segmentedControlItemLabel}>{label}</ItemLabel>
				</Item>
			))}
		</Root>
	),
});

function ControlledDemo() {
	const [value, setValue] = createSignal("month");
	return (
		<div class={style.segmentedControlWrapper}>
			<Root
				class={style.segmentedControlRoot}
				value={value()}
				onChange={setValue}
			>
				<Indicator class={style.segmentedControlIndicator} />
				{(["Day", "Month", "Year"] as const).map((label) => (
					<Item class={style.segmentedControlItem} value={label.toLowerCase()}>
						<ItemInput />
						<ItemControl class={style.segmentedControlItemControl} />
						<ItemLabel class={style.segmentedControlItemLabel}>
							{label}
						</ItemLabel>
					</Item>
				))}
			</Root>
			<p class={style.segmentedControlValueText}>
				Selected: <strong>{value()}</strong>
			</p>
			<button
				type="button"
				class={style.segmentedControlResetButton}
				onClick={() => setValue("month")}
			>
				Reset to Month
			</button>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

export const ManySegments = meta.story({
	name: "Many Segments",
	render: () => (
		<Root class={style.segmentedControlRoot} defaultValue="1w">
			<Indicator class={style.segmentedControlIndicator} />
			{(["1D", "1W", "1M", "3M", "6M", "1Y", "ALL"] as const).map((label) => (
				<Item
					class={`${style.segmentedControlItem} ${style.segmentedControlItemPx3}`}
					value={label.toLowerCase()}
				>
					<ItemInput />
					<ItemControl class={style.segmentedControlItemControl} />
					<ItemLabel
						class={`${style.segmentedControlItemLabel} ${style.segmentedControlItemLabelMono}`}
					>
						{label}
					</ItemLabel>
				</Item>
			))}
		</Root>
	),
});
