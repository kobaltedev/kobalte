import preview from "../../../../../.storybook/preview.js";
import { Fill, Label, Root, Track, ValueLabel } from "../index";

const meta = preview.meta({
	title: "Components/Meter",
	tags: ["autodocs"],
});

export default meta;

function meterColor(pct: number) {
	if (pct >= 0.8) return "rgb(239 68 68)";
	if (pct >= 0.6) return "rgb(234 179 8)";
	return "rgb(34 197 94)";
}

/** Interactive playground — drag the value to see the color zones shift. */
export const Playground = meta.story({
	name: "Playground",
	args: { value: 60 },
	argTypes: {
		value: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "Current meter value (0–100)",
		},
	},
	render: (args) => (
		<Root
			value={args.value}
			class="flex flex-col gap-2 w-72 font-sans"
			getValueLabel={({ value }) => `${value} / 100`}
		>
			<div class="flex justify-between items-baseline">
				<Label class="text-sm font-medium text-slate-700">Resource usage</Label>
				<ValueLabel
					class="text-sm font-mono font-semibold"
					style={{ color: meterColor(args.value / 100) }}
				/>
			</div>
			<Track class="relative h-6 w-full rounded bg-slate-100 border border-slate-200 overflow-hidden">
				<Fill
					class="h-full transition-all duration-300 [width:var(--kb-meter-fill-width)]"
					style={{ "background-color": meterColor(args.value / 100) }}
				/>
				<div class="absolute inset-0 flex pointer-events-none">
					{([25, 50, 75] as const).map((tick) => (
						<div
							class="absolute top-0 bottom-0 w-px bg-white/50"
							style={{ left: `${tick}%` }}
						/>
					))}
				</div>
			</Track>
			<div class="flex justify-between text-xs text-slate-400">
				<span>0</span>
				<span>25</span>
				<span>50</span>
				<span>75</span>
				<span>100</span>
			</div>
		</Root>
	),
});

/** Disk usage — a real-world meter with custom byte label and color zones. */
export const DiskUsage = meta.story({
	name: "Disk Usage",
	args: { used: 68 },
	argTypes: {
		used: {
			control: { type: "range", min: 0, max: 100, step: 1 },
			description: "GB used out of 100 GB",
		},
	},
	render: (args) => (
		<Root
			value={args.used}
			minValue={0}
			maxValue={100}
			getValueLabel={({ value, max }) => `${value} GB / ${max} GB`}
			class="flex flex-col gap-2 w-72 font-sans"
		>
			<div class="flex justify-between items-baseline">
				<Label class="text-sm font-medium text-slate-700">Disk</Label>
				<ValueLabel class="text-xs font-mono text-slate-500" />
			</div>
			<Track class="relative h-5 rounded bg-slate-100 border border-slate-200 overflow-hidden">
				<Fill
					class="h-full transition-all duration-300 [width:var(--kb-meter-fill-width)]"
					style={{ "background-color": meterColor(args.used / 100) }}
				/>
				<div
					class="absolute inset-y-0 flex items-center"
					style={{ left: `${args.used}%` }}
				>
					<div class="w-0.5 h-full bg-white/70" />
				</div>
			</Track>
			<p class="text-xs text-slate-400">
				{args.used >= 80
					? "Critical — clean up files"
					: args.used >= 60
						? "Running low"
						: "Healthy"}
			</p>
		</Root>
	),
});

/** System resources — multiple meters reading simultaneously. */
export const SystemResources = meta.story({
	name: "System Resources",
	render: () => {
		const resources = [
			{ label: "CPU", value: 45 },
			{ label: "Memory", value: 72 },
			{ label: "Disk I/O", value: 91 },
			{ label: "Network", value: 38 },
		];
		return (
			<div class="flex flex-col gap-3 w-72 font-sans p-4 bg-slate-900 rounded-lg">
				{resources.map((r) => {
					const pct = r.value / 100;
					const color = meterColor(pct);
					return (
						<Root
							value={r.value}
							getValueLabel={({ value }) => `${value}%`}
							class="flex items-center gap-3"
						>
							<Label class="w-16 text-xs text-slate-400 shrink-0">
								{r.label}
							</Label>
							<Track class="relative flex-1 h-3 rounded-sm bg-slate-700 overflow-hidden">
								<Fill
									class="h-full [width:var(--kb-meter-fill-width)]"
									style={{ "background-color": color }}
								/>
							</Track>
							<ValueLabel
								class="w-9 text-right text-xs font-mono shrink-0"
								style={{ color }}
							/>
						</Root>
					);
				})}
			</div>
		);
	},
});
