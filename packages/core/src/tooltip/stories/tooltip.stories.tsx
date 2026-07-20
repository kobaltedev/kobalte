import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Arrow, Content, Portal, Root, Trigger } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Tooltip",
	tags: ["autodocs"],
});

export default meta;

/** A basic tooltip that appears on hover and focus. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<div class={style.tooltip__wrapper}>
			<Root>
				<Trigger class={style.tooltip__trigger}>Hover me</Trigger>
				<Portal>
					<Content class={style.tooltip__content}>
						<Arrow class={style.tooltip__arrow} />
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
		<div class={style["tooltip__delay-wrapper"]}>
			<Root openDelay={0} closeDelay={0}>
				<Trigger class={style.tooltip__trigger}>Instant</Trigger>
				<Portal>
					<Content class={style.tooltip__content}>Opens immediately</Content>
				</Portal>
			</Root>
			<Root openDelay={1000} closeDelay={500}>
				<Trigger class={style.tooltip__trigger}>Slow</Trigger>
				<Portal>
					<Content class={style.tooltip__content}>Opens after 1 s</Content>
				</Portal>
			</Root>
		</div>
	),
});

/** `placement` controls where the tooltip appears relative to the trigger. */
export const Placements = meta.story({
	name: "Placements",
	render: () => (
		<div class={style.tooltip__grid}>
			{(["top", "bottom", "left", "right"] as const).map((placement) => (
				<Root placement={placement} openDelay={0}>
					<Trigger
						class={`${style.tooltip__trigger} ${style["tooltip__trigger--small"]}`}
					>
						{placement}
					</Trigger>
					<Portal>
						<Content class={style.tooltip__content}>
							<Arrow class={style.tooltip__arrow} />
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
		<div class={style.tooltip__wrapper}>
			<Root triggerOnFocusOnly openDelay={0}>
				<Trigger class={style.tooltip__trigger}>Focus me (Tab)</Trigger>
				<Portal>
					<Content class={style.tooltip__content}>
						Only appears on focus
					</Content>
				</Portal>
			</Root>
		</div>
	),
});

/** `disabled` prevents the tooltip from opening. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<div class={style.tooltip__wrapper}>
			<Root disabled>
				<Trigger
					class={`${style.tooltip__trigger} ${style["tooltip__trigger--disabled"]}`}
				>
					Disabled trigger
				</Trigger>
				<Portal>
					<Content class={style.tooltip__content}>You won't see this</Content>
				</Portal>
			</Root>
		</div>
	),
});

/** Controlled open state via `open` and `onOpenChange`. */
function ControlledDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<div class={style["tooltip__controlled-wrapper"]}>
			<Root open={open()} onOpenChange={setOpen} openDelay={0}>
				<Trigger class={style.tooltip__trigger}>Hover or toggle</Trigger>
				<Portal>
					<Content class={style.tooltip__content}>Controlled tooltip</Content>
				</Portal>
			</Root>
			<div class={style["tooltip__controlled-row"]}>
				<span class={style.tooltip__state}>
					State: <strong>{open() ? "open" : "closed"}</strong>
				</span>
				<button
					type="button"
					class={style["tooltip__toggle-btn"]}
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
		<div class={style.tooltip__wrapper}>
			<Root openDelay={0}>
				<Trigger as="span" class={style["tooltip__span-trigger"]}>
					Hover this text
				</Trigger>
				<Portal>
					<Content class={style.tooltip__content}>
						Trigger rendered as a span
					</Content>
				</Portal>
			</Root>
		</div>
	),
});
