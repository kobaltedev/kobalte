/*
 * Drawer stories for Kobalte.
 *
 * Snap-point architecture and drag behaviour are adapted from
 * corvu/drawer (MIT) by Jasmin Noetzli:
 * https://github.com/corvudev/corvu/tree/main/packages/drawer
 */

import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.ts";
import {
	CloseButton,
	Content,
	Description,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger,
	useContext,
} from "../index";

const meta = preview.meta({
	title: "Components/Drawer",
	tags: ["autodocs"],
});

export default meta;

// ─── Shared CSS values ────────────────────────────────────────────────────────

const triggerClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const closeClass =
	"absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

const actionClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const cancelClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

// Easing from corvu's own demo — gives the drawer a snappy native feel
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION = "350ms";

// DrawerOverlay drives opacity from openPercentage automatically.
// We only need to supply the CSS transition and base appearance.
const overlayStyle: Record<string, string> = {
	position: "fixed",
	inset: "0",
	"z-index": "50",
	"background-color": "rgba(0,0,0,0.4)",
	"backdrop-filter": "blur(2px)",
	// The JS-controlled opacity will animate via this transition.
	transition: `opacity ${DURATION} ${EASE}`,
};

// ─── Side helpers ─────────────────────────────────────────────────────────────

function sideContentStyle(
	side: "left" | "right" | "top" | "bottom",
	size = "320px",
): Record<string, string> {
	const base: Record<string, string> = {
		position: "fixed",
		"z-index": "50",
		background: "#fff",
		outline: "none",
		"font-family": "sans-serif",
		"overflow-y": "auto",
		transition: `transform ${DURATION} ${EASE}`,
	};
	switch (side) {
		case "right":
			return {
				...base,
				top: "0",
				right: "0",
				height: "100%",
				width: size,
				"border-left": "1px solid #e2e8f0",
				"box-shadow": "-4px 0 24px rgba(0,0,0,0.08)",
			};
		case "left":
			return {
				...base,
				top: "0",
				left: "0",
				height: "100%",
				width: size,
				"border-right": "1px solid #e2e8f0",
				"box-shadow": "4px 0 24px rgba(0,0,0,0.08)",
			};
		case "top":
			return {
				...base,
				top: "0",
				left: "0",
				width: "100%",
				height: size,
				"border-bottom": "1px solid #e2e8f0",
				"box-shadow": "0 4px 24px rgba(0,0,0,0.08)",
				"overflow-y": "hidden",
			};
		case "bottom":
			return {
				...base,
				bottom: "0",
				left: "0",
				width: "100%",
				height: size,
				"border-top": "1px solid #e2e8f0",
				"box-shadow": "0 -4px 24px rgba(0,0,0,0.08)",
				"overflow-y": "hidden",
				"border-radius": "12px 12px 0 0",
			};
	}
}

// Visual drag handle shown in bottom/top drawers
const DragHandle = () => (
	<div
		style={{
			width: "48px",
			height: "4px",
			background: "#cbd5e1",
			"border-radius": "9999px",
			margin: "0 auto 16px",
			cursor: "grab",
		}}
	/>
);

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Drawer slides in from the bottom — default mobile-native feel, draggable to dismiss. */
export const Bottom = meta.story({
	name: "Bottom",
	render: () => (
		<Root side="bottom" snapPoints={[0, 0.5, 1]}>
			<Trigger class={triggerClass}>Open bottom drawer</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content
					style={{ ...sideContentStyle("bottom"), padding: "16px 24px 32px" }}
				>
					<DragHandle />
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="text-base font-semibold text-slate-900 mb-1">
						Bottom drawer
					</Title>
					<Description class="text-sm text-slate-500 mb-4">
						Drag the handle or swipe down to dismiss. This drawer has three snap
						points: half-height, full-height, and closed.
					</Description>
					<div class="flex flex-col gap-2">
						<p class="text-sm text-slate-700">
							Content placed here is fully interactive. Scrollable areas work
							alongside the drag gesture without conflicts.
						</p>
					</div>
					<div class="flex justify-end gap-2 mt-6">
						<CloseButton class={cancelClass}>Cancel</CloseButton>
						<button type="button" class={actionClass}>
							Confirm
						</button>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});

/** Right-side drawer — common for detail panels and settings. */
export const Right = meta.story({
	name: "Right",
	render: () => (
		<Root side="right">
			<Trigger class={triggerClass}>Open right drawer</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content style={{ ...sideContentStyle("right"), padding: "24px" }}>
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="text-base font-semibold text-slate-900 mb-1">
						Right drawer
					</Title>
					<Description class="text-sm text-slate-500 mb-4">
						Slides in from the right. Drag left (or swipe) to dismiss.
					</Description>
					<nav class="flex flex-col gap-1 mt-2">
						{["Dashboard", "Projects", "Team", "Settings", "Help"].map(
							(item) => (
								<button
									type="button"
									class="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors text-left w-full"
								>
									{item}
								</button>
							),
						)}
					</nav>
				</Content>
			</Portal>
		</Root>
	),
});

/** Left-side drawer — navigation panel pattern. */
export const Left = meta.story({
	name: "Left",
	render: () => (
		<Root side="left">
			<Trigger class={triggerClass}>Open left drawer</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content style={{ ...sideContentStyle("left"), padding: "24px" }}>
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="text-base font-semibold text-slate-900 mb-1">
						Left drawer
					</Title>
					<Description class="text-sm text-slate-500 mb-4">
						Slides in from the left. Drag right to dismiss.
					</Description>
					<nav class="flex flex-col gap-1 mt-2">
						{["Home", "Inbox", "Projects", "Reports", "Settings"].map(
							(item) => (
								<button
									type="button"
									class="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors text-left w-full"
								>
									{item}
								</button>
							),
						)}
					</nav>
				</Content>
			</Portal>
		</Root>
	),
});

/** Top drawer — search or notifications panel. */
export const Top = meta.story({
	name: "Top",
	render: () => (
		<Root side="top">
			<Trigger class={triggerClass}>Open top drawer</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content
					style={{
						...sideContentStyle("top", "160px"),
						padding: "24px",
						display: "flex",
						"flex-direction": "column",
						"justify-content": "flex-end",
					}}
				>
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="text-base font-semibold text-slate-900 mb-2">
						Search
					</Title>
					<div class="flex gap-2">
						<input
							type="search"
							placeholder="Search…"
							autofocus
							class="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button type="button" class={actionClass}>
							Go
						</button>
					</div>
					<DragHandle />
				</Content>
			</Portal>
		</Root>
	),
});

/**
 * Demonstrates multiple snap points. The drawer can settle at 40% height
 * (peek) or 100% height (expanded) — drag to transition between them.
 */
export const SnapPoints = meta.story({
	name: "Snap Points",
	render: () => (
		<Root side="bottom" snapPoints={[0, 0.4, 1]} defaultSnapPoint={0.4}>
			<Trigger class={triggerClass}>Open with snap points</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content
					style={{
						...sideContentStyle("bottom", "70vh"),
						padding: "16px 24px 48px",
					}}
				>
					<DragHandle />
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="text-base font-semibold text-slate-900 mb-1">
						Snap points
					</Title>
					<Description class="text-sm text-slate-500 mb-4">
						This drawer has three snap points: <strong>closed (0)</strong>,{" "}
						<strong>peek (40%)</strong>, and <strong>expanded (100%)</strong>.
						Drag to snap between them. Opening snaps to the peek position.
					</Description>
					<SnapPointInfo />
					<div class="mt-6 flex flex-col gap-3 overflow-y-auto">
						{Array.from({ length: 12 }, (_, i) => (
							<div class="h-10 rounded-lg bg-slate-100 flex items-center px-3 text-sm text-slate-500">
								List item {i + 1} — scroll freely once expanded
							</div>
						))}
					</div>
				</Content>
			</Portal>
		</Root>
	),
});

function SnapPointInfo() {
	const ctx = useContext();
	return (
		<div class="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 font-mono grid grid-cols-2 gap-x-4 gap-y-1">
			<span class="text-slate-400">activeSnapPoint</span>
			<span>{String(ctx.activeSnapPoint())}</span>
			<span class="text-slate-400">openPercentage</span>
			<span>{ctx.openPercentage().toFixed(2)}</span>
			<span class="text-slate-400">translate</span>
			<span>{ctx.translate().toFixed(1)}px</span>
			<span class="text-slate-400">isDragging</span>
			<span>{String(ctx.isDragging())}</span>
			<span class="text-slate-400">transitionState</span>
			<span>{ctx.transitionState() ?? "null"}</span>
		</div>
	);
}

/**
 * Controlled open state — open/close from an external signal.
 */
function ControlledDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<div class="flex flex-col gap-3 font-sans">
			<div class="flex items-center gap-2">
				<Root side="right" open={open()} onOpenChange={setOpen}>
					<Trigger class={triggerClass}>Controlled drawer</Trigger>
					<Portal>
						<Overlay style={overlayStyle} />
						<Content style={{ ...sideContentStyle("right"), padding: "24px" }}>
							<CloseButton class={closeClass} aria-label="Close">
								✕
							</CloseButton>
							<Title class="text-base font-semibold text-slate-900 mb-1">
								Controlled
							</Title>
							<Description class="text-sm text-slate-500 mb-4">
								Open state is driven by an external signal.
							</Description>
							<div class="flex justify-end mt-4">
								<button
									type="button"
									class={actionClass}
									onClick={() => setOpen(false)}
								>
									Done
								</button>
							</div>
						</Content>
					</Portal>
				</Root>
				<button
					type="button"
					class={triggerClass}
					onClick={() => setOpen((o) => !o)}
				>
					{open() ? "Force close" : "Force open"}
				</button>
			</div>
			<p class="text-xs text-slate-500">
				State: <strong>{open() ? "open" : "closed"}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Programmatically snap to a different snap point using `setActiveSnapPoint`. */
function ProgrammaticSnapDemo() {
	const ctx = useContext();
	return (
		<div class="flex flex-col gap-3">
			<p class="text-sm text-slate-600">
				Current: <strong>{String(ctx.activeSnapPoint())}</strong> (
				{(ctx.openPercentage() * 100).toFixed(0)}% open)
			</p>
			<div class="flex gap-2">
				<button
					type="button"
					class={cancelClass}
					onClick={() => ctx.setActiveSnapPoint(0.4)}
				>
					Peek (40%)
				</button>
				<button
					type="button"
					class={actionClass}
					onClick={() => ctx.setActiveSnapPoint(1)}
				>
					Expand (100%)
				</button>
			</div>
		</div>
	);
}

export const ProgrammaticSnap = meta.story({
	name: "Programmatic Snap",
	render: () => (
		<Root side="bottom" snapPoints={[0, 0.4, 1]} defaultSnapPoint={1}>
			<Trigger class={triggerClass}>Open drawer</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content
					style={{
						...sideContentStyle("bottom", "60vh"),
						padding: "16px 24px 32px",
					}}
				>
					<DragHandle />
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="text-base font-semibold text-slate-900 mb-1">
						Programmatic snap
					</Title>
					<Description class="text-sm text-slate-500 mb-4">
						Snap to a specific point using `setActiveSnapPoint` from context —
						no dragging needed.
					</Description>
					<ProgrammaticSnapDemo />
				</Content>
			</Portal>
		</Root>
	),
});

/** Drawer with a form — right-side editing panel. */
export const WithForm = meta.story({
	name: "With Form",
	render: () => (
		<Root side="right">
			<Trigger class={triggerClass}>Edit profile</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content style={{ ...sideContentStyle("right"), padding: "24px" }}>
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="text-base font-semibold text-slate-900 mb-1">
						Edit profile
					</Title>
					<Description class="text-sm text-slate-500 mb-4">
						Update your display name and bio.
					</Description>
					<div class="flex flex-col gap-3">
						<div class="flex flex-col gap-1">
							<label class="text-xs font-medium text-slate-600" for="drw-name">
								Display name
							</label>
							<input
								id="drw-name"
								type="text"
								placeholder="Jane Doe"
								class="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div class="flex flex-col gap-1">
							<label class="text-xs font-medium text-slate-600" for="drw-bio">
								Bio
							</label>
							<textarea
								id="drw-bio"
								rows={4}
								placeholder="A short bio…"
								class="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div class="flex justify-end gap-2 mt-2">
							<CloseButton class={cancelClass}>Cancel</CloseButton>
							<button type="button" class={actionClass}>
								Save changes
							</button>
						</div>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});

/** Non-modal — background content stays interactive, no overlay. */
export const NonModal = meta.story({
	name: "Non-Modal",
	render: () => (
		<Root side="right" modal={false}>
			<Trigger class={triggerClass}>Open non-modal</Trigger>
			<Portal>
				<Content style={{ ...sideContentStyle("right"), padding: "24px" }}>
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="text-base font-semibold text-slate-900 mb-1">
						Non-modal drawer
					</Title>
					<Description class="text-sm text-slate-500">
						Focus is not trapped and the background stays interactive — no
						overlay is shown.
					</Description>
				</Content>
			</Portal>
		</Root>
	),
});
