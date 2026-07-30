import preview from "../../../../../.storybook/preview.js";
import { Fill, Label, Root, Track, ValueLabel } from "../index.tsx";
import style from "./stories.module.css";

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
			class={style.meter__root}
			getValueLabel={({ value }) => `${value} / 100`}
		>
			<div class={style["meter__label-row"]}>
				<Label class={style.meter__label}>Resource usage</Label>
				<ValueLabel
					class={style["meter__value-label"]}
					style={{ color: meterColor(args.value / 100) }}
				/>
			</div>
			<Track class={style.meter__track}>
				<Fill
					class={style.meter__fill}
					style={{ "background-color": meterColor(args.value / 100) }}
				/>
				<div class={style["meter__tick-container"]}>
					{([25, 50, 75] as const).map((tick) => (
						<div class={style.meter__tick} style={{ left: `${tick}%` }} />
					))}
				</div>
			</Track>
			<div class={style["meter__scale-labels"]}>
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
			class={style.meter__root}
		>
			<div class={style["meter__label-row"]}>
				<Label class={style.meter__label}>Disk</Label>
				<ValueLabel class={style["meter__value-label"]} />
			</div>
			<Track class={style["meter__track-sm"]}>
				<Fill
					class={style.meter__fill}
					style={{ "background-color": meterColor(args.used / 100) }}
				/>
				<div
					class={style["meter__cursor-pointer-container"]}
					style={{ left: `${args.used}%` }}
				>
					<div class={style["meter__cursor-pointer"]} />
				</div>
			</Track>
			<p class={style.meter__description}>
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
			<div class={style["meter__system-panel"]}>
				{resources.map((r) => {
					const pct = r.value / 100;
					const color = meterColor(pct);
					return (
						<Root
							value={r.value}
							getValueLabel={({ value }) => `${value}%`}
							class={style["meter__system-row"]}
						>
							<Label class={style["meter__system-label"]}>{r.label}</Label>
							<Track class={style["meter__system-track"]}>
								<Fill
									class={style.meter__fill}
									style={{ "background-color": color }}
								/>
							</Track>
							<ValueLabel
								class={style["meter__system-value"]}
								style={{ color }}
							/>
						</Root>
					);
				})}
			</div>
		);
	},
});
