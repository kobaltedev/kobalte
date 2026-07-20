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
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Drawer",
	tags: ["autodocs"],
});

export default meta;

// ─── Shared CSS values ────────────────────────────────────────────────────────

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
			<Trigger class={style.trigger}>Open bottom drawer</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content
					style={{ ...sideContentStyle("bottom"), padding: "16px 24px 32px" }}
				>
					<DragHandle />
					<CloseButton class={style.close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.title}>Bottom drawer</Title>
					<Description class={style.description}>
						Drag the handle or swipe down to dismiss. This drawer has three snap
						points: half-height, full-height, and closed.
					</Description>
					<div class={style.stack}>
						<p class={style.text}>
							Content placed here is fully interactive. Scrollable areas work
							alongside the drag gesture without conflicts.
						</p>
					</div>
					<div class={style.footer}>
						<CloseButton class={style.cancel}>Cancel</CloseButton>
						<button type="button" class={style.action}>
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
			<Trigger class={style.trigger}>Open right drawer</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content style={{ ...sideContentStyle("right"), padding: "24px" }}>
					<CloseButton class={style.close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.title}>Right drawer</Title>
					<Description class={style.description}>
						Slides in from the right. Drag left (or swipe) to dismiss.
					</Description>
					<nav class={style.nav}>
						{["Dashboard", "Projects", "Team", "Settings", "Help"].map(
							(item) => (
								<button type="button" class={style.navItem}>
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
			<Trigger class={style.trigger}>Open left drawer</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content style={{ ...sideContentStyle("left"), padding: "24px" }}>
					<CloseButton class={style.close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.title}>Left drawer</Title>
					<Description class={style.description}>
						Slides in from the left. Drag right to dismiss.
					</Description>
					<nav class={style.nav}>
						{["Home", "Inbox", "Projects", "Reports", "Settings"].map(
							(item) => (
								<button type="button" class={style.navItem}>
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
			<Trigger class={style.trigger}>Open top drawer</Trigger>
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
					<CloseButton class={style.close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.titleGap}>Search</Title>
					<div class={style.row}>
						<input
							type="search"
							placeholder="Search…"
							autofocus
							class={style.searchInput}
						/>
						<button type="button" class={style.action}>
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
			<Trigger class={style.trigger}>Open with snap points</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content
					style={{
						...sideContentStyle("bottom", "70vh"),
						padding: "16px 24px 48px",
					}}
				>
					<DragHandle />
					<CloseButton class={style.close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.title}>Snap points</Title>
					<Description class={style.description}>
						This drawer has three snap points: <strong>closed (0)</strong>,{" "}
						<strong>peek (40%)</strong>, and <strong>expanded (100%)</strong>.
						Drag to snap between them. Opening snaps to the peek position.
					</Description>
					<SnapPointInfo />
					<div class={style.scrollList}>
						{Array.from({ length: 12 }, (_, i) => (
							<div class={style.listItem}>
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
		<div class={style.infoPanel}>
			<span class={style.infoLabel}>activeSnapPoint</span>
			<span>{String(ctx.activeSnapPoint())}</span>
			<span class={style.infoLabel}>openPercentage</span>
			<span>{ctx.openPercentage().toFixed(2)}</span>
			<span class={style.infoLabel}>translate</span>
			<span>{ctx.translate().toFixed(1)}px</span>
			<span class={style.infoLabel}>isDragging</span>
			<span>{String(ctx.isDragging())}</span>
			<span class={style.infoLabel}>transitionState</span>
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
		<div class={style.stackSpaced}>
			<div class={style.rowCenter}>
				<Root side="right" open={open()} onOpenChange={setOpen}>
					<Trigger class={style.trigger}>Controlled drawer</Trigger>
					<Portal>
						<Overlay style={overlayStyle} />
						<Content style={{ ...sideContentStyle("right"), padding: "24px" }}>
							<CloseButton class={style.close} aria-label="Close">
								✕
							</CloseButton>
							<Title class={style.title}>Controlled</Title>
							<Description class={style.description}>
								Open state is driven by an external signal.
							</Description>
							<div class={style.footerRight}>
								<button
									type="button"
									class={style.action}
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
					class={style.trigger}
					onClick={() => setOpen((o) => !o)}
				>
					{open() ? "Force close" : "Force open"}
				</button>
			</div>
			<p class={style.meta}>
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
		<div class={style.stackSpaced}>
			<p class={style.textSecondary}>
				Current: <strong>{String(ctx.activeSnapPoint())}</strong> (
				{(ctx.openPercentage() * 100).toFixed(0)}% open)
			</p>
			<div class={style.row}>
				<button
					type="button"
					class={style.cancel}
					onClick={() => ctx.setActiveSnapPoint(0.4)}
				>
					Peek (40%)
				</button>
				<button
					type="button"
					class={style.action}
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
			<Trigger class={style.trigger}>Open drawer</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content
					style={{
						...sideContentStyle("bottom", "60vh"),
						padding: "16px 24px 32px",
					}}
				>
					<DragHandle />
					<CloseButton class={style.close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.title}>Programmatic snap</Title>
					<Description class={style.description}>
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
			<Trigger class={style.trigger}>Edit profile</Trigger>
			<Portal>
				<Overlay style={overlayStyle} />
				<Content style={{ ...sideContentStyle("right"), padding: "24px" }}>
					<CloseButton class={style.close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.title}>Edit profile</Title>
					<Description class={style.description}>
						Update your display name and bio.
					</Description>
					<div class={style.stackForm}>
						<div class={style.stackFormGroup}>
							<label class={style.formLabel} for="drw-name">
								Display name
							</label>
							<input
								id="drw-name"
								type="text"
								placeholder="Jane Doe"
								class={style.formInput}
							/>
						</div>
						<div class={style.stackFormGroup}>
							<label class={style.formLabel} for="drw-bio">
								Bio
							</label>
							<textarea
								id="drw-bio"
								rows={4}
								placeholder="A short bio…"
								class={style.formTextarea}
							/>
						</div>
						<div class={style.footerCompact}>
							<CloseButton class={style.cancel}>Cancel</CloseButton>
							<button type="button" class={style.action}>
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
			<Trigger class={style.trigger}>Open non-modal</Trigger>
			<Portal>
				<Content style={{ ...sideContentStyle("right"), padding: "24px" }}>
					<CloseButton class={style.close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.title}>Non-modal drawer</Title>
					<Description class={style.descriptionFlush}>
						Focus is not trapped and the background stays interactive — no
						overlay is shown.
					</Description>
				</Content>
			</Portal>
		</Root>
	),
});
