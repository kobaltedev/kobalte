import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Arrow, Content, Portal, Root, Trigger } from "../index";

const meta = preview.meta({
	title: "Components/Tooltip",
	tags: ["autodocs"],
});

export default meta;


const triggerClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 transition-colors";

const contentClass =
	"z-50 rounded-md bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-700 shadow-sm animate-in fade-in-0 zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95";

const arrowClass = "fill-white";


/** A basic tooltip that appears on hover and focus. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<div class="flex items-center justify-center h-32 font-sans">
			<Root>
				<Trigger class={triggerClass}>Hover me</Trigger>
				<Portal>
					<Content class={contentClass}>
						<Arrow class={arrowClass} />
						This is a tooltip
					</Content>
				</Portal>
			</Root>
		</div>
	),
});

/** `openDelay` / `closeDelay` control timing in milliseconds. */
export const CustomDelay = meta.story({
	name: "Custom Delay",
	render: () => (
		<div class="flex items-center justify-center gap-4 h-32 font-sans">
			<Root openDelay={0} closeDelay={0}>
				<Trigger class={triggerClass}>Instant</Trigger>
				<Portal>
					<Content class={contentClass}>Opens immediately</Content>
				</Portal>
			</Root>
			<Root openDelay={1000} closeDelay={500}>
				<Trigger class={triggerClass}>Slow</Trigger>
				<Portal>
					<Content class={contentClass}>Opens after 1 s</Content>
				</Portal>
			</Root>
		</div>
	),
});

/** `placement` controls where the tooltip appears relative to the trigger. */
export const Placements = meta.story({
	name: "Placements",
	render: () => (
		<div class="grid grid-cols-3 gap-4 place-items-center h-64 w-72 mx-auto font-sans">
			{(["top", "bottom", "left", "right"] as const).map((placement) => (
				<Root placement={placement} openDelay={0}>
					<Trigger class={`${triggerClass} text-xs px-2 py-1`}>
						{placement}
					</Trigger>
					<Portal>
						<Content class={contentClass}>
							<Arrow class={arrowClass} />
							{placement}
						</Content>
					</Portal>
				</Root>
			))}
		</div>
	),
});

/** `triggerOnFocusOnly` only shows the tooltip on keyboard focus, not hover. */
export const FocusOnly = meta.story({
	name: "Focus Only",
	render: () => (
		<div class="flex items-center justify-center h-32 font-sans">
			<Root triggerOnFocusOnly openDelay={0}>
				<Trigger class={triggerClass}>Focus me (Tab)</Trigger>
				<Portal>
					<Content class={contentClass}>Only appears on focus</Content>
				</Portal>
			</Root>
		</div>
	),
});

/** `disabled` prevents the tooltip from opening. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<div class="flex items-center justify-center h-32 font-sans">
			<Root disabled>
				<Trigger class={`${triggerClass} opacity-50 cursor-not-allowed`}>
					Disabled trigger
				</Trigger>
				<Portal>
					<Content class={contentClass}>You won't see this</Content>
				</Portal>
			</Root>
		</div>
	),
});

/** Controlled open state via `open` and `onOpenChange`. */
function ControlledDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<div class="flex flex-col items-center gap-4 font-sans">
			<Root open={open()} onOpenChange={setOpen} openDelay={0}>
				<Trigger class={triggerClass}>Hover or toggle</Trigger>
				<Portal>
					<Content class={contentClass}>Controlled tooltip</Content>
				</Portal>
			</Root>
			<div class="flex items-center gap-3">
				<span class="text-xs text-slate-500">
					State: <strong>{open() ? "open" : "closed"}</strong>
				</span>
				<button
					type="button"
					class="rounded px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
					onClick={() => setOpen((v) => !v)}
				>
					Toggle
				</button>
			</div>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Tooltip on a non-button element using `as`. */
export const AsSpan = meta.story({
	name: "As Span",
	render: () => (
		<div class="flex items-center justify-center h-32 font-sans">
			<Root openDelay={0}>
				<Trigger
					as="span"
					class="cursor-default underline decoration-dotted underline-offset-2 text-sm text-slate-700"
				>
					Hover this text
				</Trigger>
				<Portal>
					<Content class={contentClass}>Trigger rendered as a span</Content>
				</Portal>
			</Root>
		</div>
	),
});
