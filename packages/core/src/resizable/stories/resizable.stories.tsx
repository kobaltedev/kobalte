/*
 * Resizable stories for Kobalte.
 *
 * Resize algorithms adapted from corvu/resizable (MIT) by Jasmin Noetzli:
 * https://github.com/corvudev/corvu/tree/main/packages/resizable
 */

import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview";
import {
	Handle,
	Panel,
	Root,
	useContext,
	usePanelContext,
} from "../index";

const meta = preview.meta({
	title: "Components/Resizable",
	tags: ["autodocs"],
});

export default meta;


const panelStyle: Record<string, string> = {
	display: "flex",
	"align-items": "center",
	"justify-content": "center",
	"font-family": "sans-serif",
	"font-size": "13px",
	color: "#64748b",
	background: "#f8fafc",
	"border-radius": "6px",
	border: "1px solid #e2e8f0",
};

const handleHStyle: Record<string, string> = {
	width: "5px",
	background: "#e2e8f0",
	cursor: "col-resize",
	"border-radius": "3px",
	transition: "background 150ms",
	"flex-shrink": "0",
};

const handleVStyle: Record<string, string> = {
	height: "5px",
	background: "#e2e8f0",
	cursor: "row-resize",
	"border-radius": "3px",
	transition: "background 150ms",
	"flex-shrink": "0",
};

const containerStyle: Record<string, string> = {
	width: "600px",
	height: "300px",
	"border-radius": "8px",
	overflow: "hidden",
	border: "1px solid #e2e8f0",
	"box-shadow": "0 1px 3px rgba(0,0,0,0.06)",
	"font-family": "sans-serif",
};


/** Two panels side by side. Drag the handle or use arrow keys to resize. */
export const Horizontal = meta.story({
	name: "Horizontal",
	render: () => (
		<Root style={containerStyle} orientation="horizontal">
			<Panel style={panelStyle}>Left</Panel>
			<Handle
				style={handleHStyle}
				aria-label="Resize panels"
			/>
			<Panel style={panelStyle}>Right</Panel>
		</Root>
	),
});


/** Two panels stacked. Drag the handle or use arrow keys to resize. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<Root style={containerStyle} orientation="vertical">
			<Panel style={panelStyle}>Top</Panel>
			<Handle
				style={handleVStyle}
				aria-label="Resize panels"
			/>
			<Panel style={panelStyle}>Bottom</Panel>
		</Root>
	),
});


/** Three panels with independent handles. Drag either handle to redistribute. */
export const ThreePanels = meta.story({
	name: "Three Panels",
	render: () => (
		<Root style={containerStyle} orientation="horizontal">
			<Panel style={{ ...panelStyle, background: "#eff6ff" }}>Left</Panel>
			<Handle style={handleHStyle} aria-label="Resize left-center" />
			<Panel style={panelStyle}>Center</Panel>
			<Handle style={handleHStyle} aria-label="Resize center-right" />
			<Panel style={{ ...panelStyle, background: "#f0fdf4" }}>Right</Panel>
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
		<Root style={containerStyle} orientation="horizontal">
			<Panel style={panelStyle}>Left</Panel>
			<Handle style={handleHStyle} aria-label="Resize left-right" />
			<Panel style={{ padding: 0, overflow: "hidden" }}>
				<Root
					style={{ width: "100%", height: "100%", "border-radius": 0 }}
					orientation="vertical"
				>
					<Panel style={panelStyle}>Top-right</Panel>
					<Handle style={handleVStyle} aria-label="Resize top-bottom" />
					<Panel style={panelStyle}>Bottom-right</Panel>
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
		<Root style={containerStyle} orientation="horizontal">
			<Panel
				collapsible
				collapsedSize={0}
				collapseThreshold={0.1}
				minSize={0.15}
				style={panelStyle}
			>
				{(panel) => (
					<span style={{ "font-size": "12px", color: panel.collapsed ? "#94a3b8" : "#334155" }}>
						{panel.collapsed ? "—" : "Sidebar"}
					</span>
				)}
			</Panel>
			<Handle style={handleHStyle} aria-label="Resize sidebar" />
			<Panel style={panelStyle}>Content</Panel>
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
		<Root style={containerStyle} orientation="horizontal">
			<Panel minSize={0.2} maxSize={0.5} style={panelStyle}>
				{() => "20% – 50%"}
			</Panel>
			<Handle style={handleHStyle} aria-label="Resize panels" />
			<Panel style={panelStyle}>Flexible</Panel>
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
		<Root style={containerStyle} orientation="horizontal">
			<Panel initialSize="200px" minSize="120px" style={panelStyle}>
				200px start
			</Panel>
			<Handle style={handleHStyle} aria-label="Resize panels" />
			<Panel style={panelStyle}>Flexible</Panel>
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
		<div style={{ display: "flex", "flex-direction": "column", gap: "12px", "font-family": "sans-serif" }}>
			<Root
				style={containerStyle}
				orientation="horizontal"
				sizes={sizes()}
				onSizesChange={setSizes}
			>
				<Panel style={panelStyle}>Left ({(sizes()[0]! * 100).toFixed(0)}%)</Panel>
				<Handle style={handleHStyle} aria-label="Resize panels" />
				<Panel style={panelStyle}>Right ({(sizes()[1]! * 100).toFixed(0)}%)</Panel>
			</Root>
			<div style={{ display: "flex", gap: "8px" }}>
				{[
					["Equal", [0.5, 0.5]],
					["30 / 70", [0.3, 0.7]],
					["70 / 30", [0.7, 0.3]],
				].map(([label, value]) => (
					<button
						type="button"
						onClick={() => setSizes(value as number[])}
						style={{
							padding: "4px 12px",
							"font-size": "12px",
							"border-radius": "6px",
							border: "1px solid #e2e8f0",
							background: "#fff",
							cursor: "pointer",
						}}
					>
						{label as string}
					</button>
				))}
			</div>
			<p style={{ "font-size": "12px", color: "#94a3b8", margin: 0 }}>
				sizes: [{sizes().map((s) => s.toFixed(2)).join(", ")}]
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
		<div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
			<div style={{ "font-size": "12px", color: "#64748b", "font-family": "sans-serif" }}>
				sizes: [{ctx.sizes().map((s) => s.toFixed(2)).join(", ")}]
			</div>
			<div style={{ display: "flex", gap: "8px" }}>
				{[
					["Collapse left", () => ctx.collapse(0)],
					["Expand left", () => ctx.expand(0)],
					["Equal split", () => ctx.resize(0, 0.5)],
				].map(([label, action]) => (
					<button
						type="button"
						onClick={action as () => void}
						style={{
							padding: "4px 12px",
							"font-size": "12px",
							"border-radius": "6px",
							border: "1px solid #e2e8f0",
							background: "#fff",
							cursor: "pointer",
							"font-family": "sans-serif",
						}}
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
		<Root style={{ width: "600px", "font-family": "sans-serif" }} orientation="horizontal">
			<Panel
				collapsible
				collapsedSize={0}
				collapseThreshold={0.05}
				minSize={0.15}
				style={{ ...containerStyle, width: "auto", "flex-basis": undefined, "border-radius": 0 }}
			>
				Sidebar
			</Panel>
			<Handle style={handleHStyle} aria-label="Resize" />
			<Panel
				style={{ ...containerStyle, width: "auto", "flex-basis": undefined, "border-radius": 0 }}
			>
				<div style={{ padding: "16px" }}>
					<ProgrammaticContextDemo />
				</div>
			</Panel>
		</Root>
	),
});


function PanelInfo() {
	const ctx = usePanelContext();
	return (
		<div style={{ padding: "12px", "font-size": "12px", "font-family": "monospace", color: "#475569" }}>
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
		<Root style={containerStyle} orientation="horizontal">
			<Panel collapsible collapsedSize={0} collapseThreshold={0.1} minSize={0.15} style={panelStyle}>
				<PanelInfo />
			</Panel>
			<Handle style={handleHStyle} aria-label="Resize" />
			<Panel style={panelStyle}>
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
		<div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
			<p style={{ margin: 0, "font-size": "12px", color: "#64748b", "font-family": "sans-serif" }}>
				Tab to the handle, then use arrow keys to resize. Shift+Arrow jumps to the edge. Enter toggles collapse.
			</p>
			<Root style={containerStyle} orientation="horizontal">
				<Panel
					collapsible
					collapsedSize={0}
					collapseThreshold={0.1}
					minSize={0.2}
					style={panelStyle}
				>
					Collapsible
				</Panel>
				<Handle
					style={{
						...handleHStyle,
						outline: "none",
						"box-shadow": "none",
					}}
					aria-label="Resize panels"
				/>
				<Panel style={panelStyle}>Main</Panel>
			</Root>
		</div>
	),
});
