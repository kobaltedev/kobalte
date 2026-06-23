import { createSignal, For } from "solid-js";
import { parseColor, colorScale, perceptualColorScale } from "@solid-primitives/utils/colors";
import type { Color } from "@solid-primitives/utils/colors";
import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";

const meta = preview.meta({
	title: "Components/ColorSwatch",
	tags: ["autodocs"],
	argTypes: {
		color: { control: "color" },
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
	},
	args: {
		color: "#3b82f6",
		size: "md",
	},
});

export default meta;

const sizeMap = {
	sm: "w-6 h-6",
	md: "w-10 h-10",
	lg: "w-16 h-16",
};

/** Single color swatch — the basic use case. */
export const Default = meta.story({
	name: "Default",
	args: { color: "#3b82f6", size: "md" },
	render: (args) => {
		const color = () => {
			try {
				return parseColor(args.color as string);
			} catch {
				return parseColor("#3b82f6");
			}
		};
		return (
			<Root
				value={color()}
				class={`${sizeMap[args.size as keyof typeof sizeMap]} rounded-md border border-slate-200 shadow-sm forced-colors:forced-color-adjust-none`}
			/>
		);
	},
});

/** A palette of swatches from a perceptual color scale. */
export const Palette = meta.story({
	name: "Palette",
	render: () => {
		const scale = perceptualColorScale(
			parseColor("#ef4444"),
			parseColor("#3b82f6"),
			7,
		);
		return (
			<div class="flex gap-2 font-sans">
				<For each={scale}>
					{(color) => (
						<Root
							value={color}
							class="w-10 h-10 rounded-md border border-slate-200 shadow-sm forced-colors:forced-color-adjust-none"
						/>
					)}
				</For>
			</div>
		);
	},
});

/** A standard RGB color scale using colorScale. */
export const ColorScale = meta.story({
	name: "Color Scale",
	render: () => {
		const scale = colorScale(parseColor("#000000"), parseColor("#ffffff"), 9);
		return (
			<div class="flex gap-1 font-sans">
				<For each={scale}>
					{(color) => (
						<Root
							value={color}
							class="w-8 h-8 rounded border border-slate-200 forced-colors:forced-color-adjust-none"
						/>
					)}
				</For>
			</div>
		);
	},
});

/** Transparent / zero-alpha swatch. */
export const Transparent = meta.story({
	name: "Transparent",
	render: () => (
		<Root
			value={parseColor("rgba(59, 130, 246, 0)")}
			class="w-10 h-10 rounded-md border border-slate-200 shadow-sm forced-colors:forced-color-adjust-none"
		/>
	),
});

/** Interactive swatch grid — click to select. */
function SelectableSwatchDemo() {
	const palette: Color[] = [
		"#ef4444", "#f97316", "#eab308", "#22c55e",
		"#3b82f6", "#a855f7", "#ec4899", "#64748b",
	].map(parseColor);

	const [selected, setSelected] = createSignal<Color>(palette[4]);

	return (
		<div class="flex flex-col gap-3 font-sans">
			<div class="flex gap-2 flex-wrap">
				<For each={palette}>
					{(color) => (
						<button
							type="button"
							class="rounded-md border-2 p-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
							style={{
								"border-color":
									selected().toString("hex") === color.toString("hex")
										? color.toString("css")
										: "transparent",
							}}
							onClick={() => setSelected(color)}
						>
							<Root
								value={color}
								class="w-8 h-8 rounded forced-colors:forced-color-adjust-none"
							/>
						</button>
					)}
				</For>
			</div>
			<p class="text-xs text-slate-500">
				Selected: <strong>{selected().toString("hex")}</strong>
			</p>
		</div>
	);
}

export const Selectable = meta.story({
	name: "Selectable",
	render: () => <SelectableSwatchDemo />,
});

/** Custom color name override. */
export const CustomName = meta.story({
	name: "Custom Name",
	render: () => (
		<div class="flex gap-3 items-center font-sans">
			<Root
				value={parseColor("#0f172a")}
				colorName="Midnight Navy"
				class="w-10 h-10 rounded-md border border-slate-200 shadow-sm"
			/>
			<span class="text-sm text-slate-600">Midnight Navy</span>
		</div>
	),
});
