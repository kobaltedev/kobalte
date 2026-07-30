import type { Color } from "@solid-primitives/utils/colors";
import {
	colorScale,
	parseColor,
	perceptualColorScale,
} from "@solid-primitives/utils/colors";
import { createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index.tsx";
import style from "./stories.module.css";

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
	sm: style.swatchSm,
	md: style.swatchMd,
	lg: style.swatchLg,
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
				class={sizeMap[args.size as keyof typeof sizeMap]}
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
			<div class={style.paletteWrapper}>
				<For each={scale}>
					{(color) => <Root value={color} class={style.paletteSwatch} />}
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
			<div class={style.scaleWrapper}>
				<For each={scale}>
					{(color) => <Root value={color} class={style.scaleSwatch} />}
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
			class={style.transparentSwatch}
		/>
	),
});

/** Interactive swatch grid — click to select. */
function SelectableSwatchDemo() {
	const palette: Color[] = [
		"#ef4444",
		"#f97316",
		"#eab308",
		"#22c55e",
		"#3b82f6",
		"#a855f7",
		"#ec4899",
		"#64748b",
	].map(parseColor);

	const [selected, setSelected] = createSignal<Color>(palette[4]);

	return (
		<div class={style.selectableWrapper}>
			<div class={style.selectableGrid}>
				<For each={palette}>
					{(color) => (
						<button
							type="button"
							class={style.selectableButton}
							style={{
								"border-color":
									selected().toString("hex") === color.toString("hex")
										? color.toString("css")
										: "transparent",
							}}
							onClick={() => setSelected(color)}
						>
							<Root value={color} class={style.selectableSwatch} />
						</button>
					)}
				</For>
			</div>
			<p class={style.selectableText}>
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
		<div class={style.customNameWrapper}>
			<Root
				value={parseColor("#0f172a")}
				colorName="Midnight Navy"
				class={style.customNameSwatch}
			/>
			<span class={style.customNameText}>Midnight Navy</span>
		</div>
	),
});
