/*
 * Resizable stories for Kobalte.
 *
 * Resize algorithms adapted from corvu/resizable (MIT) by Jasmin Noetzli:
 * https://github.com/corvudev/corvu/tree/main/packages/resizable
 */

import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.ts";
import { Handle, Panel, Root, useContext, usePanelContext } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Resizable",
	tags: ["autodocs"],
});

export default meta;

/** Two panels side by side. Drag the handle or use arrow keys to resize. */
export const Horizontal = meta.story({
	name: "Horizontal",
	render: () => (
		<Root class={style.container} orientation="horizontal">
			<Panel class={style.panel}>Left</Panel>
			<Handle class={style.handleH} aria-label="Resize panels" />
			<Panel class={style.panel}>Right</Panel>
		</Root>
	),
});

/** Two panels stacked. Drag the handle or use arrow keys to resize. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root class={style.container} orientation="vertical">
			<Panel class={style.panel}>Top</Panel>
			<Handle class={style.handleV} aria-label="Resize panels" />
			<Panel class={style.panel}>Bottom</Panel>
		</Root>
	),
});

/** Three panels with independent handles. Drag either handle to redistribute. */
export const ThreePanels = meta.story({
	name: "Three Panels",
	render: () => (
		<Root class={style.container} orientation="horizontal">
			<Panel class={style.panelLeft}>Left</Panel>
			<Handle class={style.handleH} aria-label="Resize left-center" />
			<Panel class={style.panel}>Center</Panel>
			<Handle class={style.handleH} aria-label="Resize center-right" />
			<Panel class={style.panelRight}>Right</Panel>
		</Root>
	),
});

/**
 * Nested resizables — a horizontal split where the right panel contains
 * a vertical split. Handles across boundaries support intersection zones.
 */
export const Nested = meta.story({
	name: "Nested",
	render: () => (
		<Root class={style.container} orientation="horizontal">
			<Panel class={style.panel}>Left</Panel>
			<Handle class={style.handleH} aria-label="Resize left-right" />
			<Panel class={[style.panel, style.nestedPanel]}>
				<Root class={style.nestedRoot} orientation="vertical">
					<Panel class={style.panel}>Top-right</Panel>
					<Handle class={style.handleV} aria-label="Resize top-bottom" />
					<Panel class={style.panel}>Bottom-right</Panel>
				</Root>
			</Panel>
		</Root>
	),
});

/**
 * The left panel is collapsible. Drag it fully to the left to collapse, or
 * press Enter on the handle to toggle collapse/expand.
 */
export const Collapsible = meta.story({
	name: "Collapsible",
	render: () => (
		<Root class={style.container} orientation="horizontal">
			<Panel
				collapsible
				collapsedSize={0}
				collapseThreshold={0.1}
				minSize={0.15}
				class={style.panel}
			>
				{(panel) => (
					<span
						style={{
							"font-size": "12px",
							color: panel.collapsed ? "#94a3b8" : "#334155",
						}}
					>
						{panel.collapsed ? "—" : "Sidebar"}
					</span>
				)}
			</Panel>
			<Handle class={style.handleH} aria-label="Resize sidebar" />
			<Panel class={style.panel}>Content</Panel>
		</Root>
	),
});

/**
 * Left panel is constrained to 20–50% of the available space;
 * right panel fills the remainder.
 */
export const MinMax = meta.story({
	name: "Min / Max Sizes",
	render: () => (
		<Root class={style.container} orientation="horizontal">
			<Panel minSize={0.2} maxSize={0.5} class={style.panel}>
				{() => "20% – 50%"}
			</Panel>
			<Handle class={style.handleH} aria-label="Resize panels" />
			<Panel class={style.panel}>Flexible</Panel>
		</Root>
	),
});

/**
 * Sizes can be expressed as pixel strings. The left panel starts at 200px
 * and has a 120px minimum.
 */
export const PixelSizes = meta.story({
	name: "Pixel Sizes",
	render: () => (
		<Root class={style.container} orientation="horizontal">
			<Panel initialSize="200px" minSize="120px" class={style.panel}>
				200px start
			</Panel>
			<Handle class={style.handleH} aria-label="Resize panels" />
			<Panel class={style.panel}>Flexible</Panel>
		</Root>
	),
});

/**
 * Sizes are stored in an external signal. The buttons set sizes directly;
 * the handles still work as normal.
 */
function ControlledDemo() {
	const [sizes, setSizes] = createSignal([0.5, 0.5]);

	return (
		<div class={style.demoColumn}>
			<Root
				class={style.container}
				orientation="horizontal"
				sizes={sizes()}
				onSizesChange={setSizes}
			>
				<Panel class={style.panel}>
					Left ({(sizes()[0]! * 100).toFixed(0)}%)
				</Panel>
				<Handle class={style.handleH} aria-label="Resize panels" />
				<Panel class={style.panel}>
					Right ({(sizes()[1]! * 100).toFixed(0)}%)
				</Panel>
			</Root>
			<div class={style.buttonRow}>
				{[
					["Equal", [0.5, 0.5]],
					["30 / 70", [0.3, 0.7]],
					["70 / 30", [0.7, 0.3]],
				].map(([label, value]) => (
					<button
						type="button"
						onClick={() => setSizes(value as number[])}
						class={style.smallButton}
					>
						{label as string}
					</button>
				))}
			</div>
			<p class={style.sizesLabel}>
				sizes: [
				{sizes()
					.map((s) => s.toFixed(2))
					.join(", ")}
				]
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

function ProgrammaticContextDemo() {
	const ctx = useContext();
	return (
		<div class={style.ctxColumn}>
			<div class={style.ctxLabel}>
				sizes: [
				{ctx
					.sizes()
					.map((s) => s.toFixed(2))
					.join(", ")}
				]
			</div>
			<div class={style.buttonRow}>
				{[
					["Collapse left", () => ctx.collapse(0)],
					["Expand left", () => ctx.expand(0)],
					["Equal split", () => ctx.resize(0, 0.5)],
				].map(([label, action]) => (
					<button
						type="button"
						onClick={action as () => void}
						class={[style.smallButton, style.ctxButton]}
					>
						{label as string}
					</button>
				))}
			</div>
		</div>
	);
}

/**
 * Demonstrates `useContext` to programmatically resize, collapse, and expand
 * panels from outside the handle.
 */
export const ProgrammaticContext = meta.story({
	name: "Programmatic (Context)",
	render: () => (
		<Root class={style.wideRoot} orientation="horizontal">
			<Panel
				collapsible
				collapsedSize={0}
				collapseThreshold={0.05}
				minSize={0.15}
				class={style.sidebarPanel}
			>
				Sidebar
			</Panel>
			<Handle class={style.handleH} aria-label="Resize" />
			<Panel class={style.contentPanel}>
				<div class={style.panelContainerInner}>
					<ProgrammaticContextDemo />
				</div>
			</Panel>
		</Root>
	),
});

function PanelInfo() {
	const ctx = usePanelContext();
	return (
		<div class={style.panelInfo}>
			<div>size: {ctx.size().toFixed(3)}</div>
			<div>collapsed: {String(ctx.collapsed())}</div>
			<div>collapsible: {String(ctx.collapsible())}</div>
		</div>
	);
}

/**
 * `usePanelContext` exposes per-panel state such as current size and collapse status.
 */
export const PanelContextStory = meta.story({
	name: "Panel Context",
	render: () => (
		<Root class={style.container} orientation="horizontal">
			<Panel
				collapsible
				collapsedSize={0}
				collapseThreshold={0.1}
				minSize={0.15}
				class={style.panel}
			>
				<PanelInfo />
			</Panel>
			<Handle class={style.handleH} aria-label="Resize" />
			<Panel class={style.panel}>
				<PanelInfo />
			</Panel>
		</Root>
	),
});

/**
 * Tab to the handle and use:
 * - Arrow keys to resize in small steps
 * - Shift + Arrow to jump to min/max
 * - Enter to collapse/expand (when a collapsible panel is adjacent)
 */
export const KeyboardOnly = meta.story({
	name: "Keyboard Navigation",
	render: () => (
		<div class={style.kbdColumn}>
			<p class={style.kbdLabel}>
				Tab to the handle, then use arrow keys to resize. Shift+Arrow jumps to
				the edge. Enter toggles collapse.
			</p>
			<Root class={style.container} orientation="horizontal">
				<Panel
					collapsible
					collapsedSize={0}
					collapseThreshold={0.1}
					minSize={0.2}
					class={style.panel}
				>
					Collapsible
				</Panel>
				<Handle class={style.handleHNoFocus} aria-label="Resize panels" />
				<Panel class={style.panel}>Main</Panel>
			</Root>
		</div>
	),
});
