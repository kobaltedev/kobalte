import { createSignal } from "solid-js";

import preview from "../../../../../.storybook/preview.js";
import { Description, Label, Root, Trend, Value } from "../index";

const meta = preview.meta({
	title: "Components/Statistic",
	tags: ["autodocs"],
});

export default meta;

/** A labeled numeric value. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class="font-sans">
			<Label class="block text-xs text-slate-500">Web traffic</Label>
			<Value
				class="block text-2xl font-semibold text-slate-900"
				value={255650}
				formatOptions={{ notation: "compact" }}
			/>
		</Root>
	),
});

/** `Statistic.Description` adds a breakdown, wired to `aria-describedby`. */
export const WithDescription = meta.story({
	name: "With Description",
	render: () => (
		<Root class="font-sans">
			<Label class="block text-xs text-slate-500">Security insights</Label>
			<Value class="block text-2xl font-semibold text-slate-900" value={40} />
			<Description class="block text-xs text-slate-400">
				12 high, 28 low
			</Description>
		</Root>
	),
});

/**
 * `Statistic.Trend` renders whatever visual you pass as `children` (here,
 * an arrow glyph + formatted percentage), marks it `aria-hidden`, and
 * generates its own accessible sentence from `value` — so the meaning
 * doesn't depend on the arrow's color or shape.
 */
export const WithTrend = meta.story({
	name: "With Trend",
	render: () => (
		<Root class="font-sans">
			<Label class="block text-xs text-slate-500">Cache rate</Label>
			<Value
				class="inline text-2xl font-semibold text-slate-900"
				value={0.162}
				formatOptions={{ style: "percent", maximumFractionDigits: 1 }}
			/>
			<Trend
				value={-0.025}
				formatOptions={{ style: "percent", maximumFractionDigits: 1 }}
				class="ml-2 inline-flex items-center gap-1 text-sm font-medium text-red-600"
			>
				▼ 2.5%
			</Trend>
		</Root>
	),
});

/**
 * `Statistic.Value` is a `polite` live region — when `value` changes
 * (e.g. a real-time metric refreshing), screen readers announce the new
 * value without moving focus.
 */
export const LiveUpdating = meta.story({
	name: "Live Updating",
	render: () => {
		const [value, setValue] = createSignal(805);

		const bump = () => setValue((v) => v + Math.round(Math.random() * 20 - 10));

		return (
			<div class="flex flex-col items-start gap-3 font-sans">
				<Root>
					<Label class="block text-xs text-slate-500">
						Workers invocations
					</Label>
					<Value
						class="block text-2xl font-semibold text-slate-900"
						value={value()}
					/>
				</Root>
				<button
					type="button"
					class="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
					onClick={bump}
				>
					Simulate update
				</button>
			</div>
		);
	},
});

/** Multiple stats grouped side by side inside a single labeled group. */
export const Group = meta.story({
	name: "Group",
	render: () => (
		<div class="flex gap-6 font-sans">
			<Root>
				<Label class="block text-xs text-slate-500">Security insights</Label>
				<Value class="block text-2xl font-semibold text-slate-900" value={40} />
			</Root>
			<Root>
				<Label class="block text-xs text-slate-500">Logins blocked</Label>
				<Value class="block text-2xl font-semibold text-slate-900" value={0} />
			</Root>
		</div>
	),
});
