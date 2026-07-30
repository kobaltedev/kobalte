import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Content, Root, Trigger } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Collapsible",
	tags: ["autodocs"],
});

export default meta;

function Chevron() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class={style.collapsible__chevron}
		>
			<path d="M6 9l6 6 6-6" />
		</svg>
	);
}

/** Basic expand/collapse panel. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.collapsible__root}>
			<Trigger class={style.collapsible__trigger}>
				<span>What is Kobalte?</span>
				<Chevron />
			</Trigger>
			<Content class={style.collapsible__content}>
				<p class={style.collapsible__contentText}>
					Kobalte is a UI toolkit for building accessible web apps and design
					systems with SolidJS. It provides a set of low-level UI components and
					primitives which can be the foundation for your design system
					implementation.
				</p>
			</Content>
		</Root>
	),
});

/** `defaultOpen` pre-opens the panel on mount without controlling state. */
export const DefaultOpen = meta.story({
	name: "Default Open",
	render: () => (
		<Root defaultOpen class={style.collapsible__root}>
			<Trigger class={style.collapsible__trigger}>
				<span>Open by default</span>
				<Chevron />
			</Trigger>
			<Content class={style.collapsible__content}>
				<p class={style.collapsible__contentText}>
					This panel was open on mount via the <code>defaultOpen</code> prop. It
					is still uncontrolled — clicking the trigger toggles it normally.
				</p>
			</Content>
		</Root>
	),
});

/** `disabled` prevents the trigger from toggling. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root disabled class={style.collapsible__root}>
			<Trigger class={style.collapsible__trigger}>
				<span>Cannot be toggled</span>
				<Chevron />
			</Trigger>
			<Content class={style.collapsible__content}>
				<p class={style.collapsible__contentText}>
					This content is not reachable when disabled.
				</p>
			</Content>
		</Root>
	),
});

/**
 * Smooth expand/collapse using the CSS `grid-template-rows` trick.
 * `forceMount` keeps content in the DOM so the exit animation plays before unmount.
 * `data-[expanded]` / `data-[closed]` drive the transition.
 */
export const Animated = meta.story({
	name: "Animated",
	render: () => (
		<Root class={style.collapsible__root} forceMount>
			<Trigger class={style.collapsible__trigger}>
				<span>Animated collapsible</span>
				<Chevron />
			</Trigger>
			<Content class={style["collapsible__content--animated"]}>
				<div class={style.collapsible__animatedInner}>
					<p class={style.collapsible__contentText}>
						This content animates open and closed using a CSS{" "}
						<code>grid-template-rows</code> transition. The{" "}
						<code>--kb-collapsible-content-height</code> CSS variable is also
						available for custom animations.
					</p>
				</div>
			</Content>
		</Root>
	),
});

function ControlledDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<div class={style.collapsible__demo}>
			<Root
				open={open()}
				onOpenChange={setOpen}
				class={style.collapsible__root}
			>
				<Trigger class={style.collapsible__trigger}>
					<span>Controlled panel</span>
					<Chevron />
				</Trigger>
				<Content class={style.collapsible__content}>
					<p class={style.collapsible__contentText}>
						State is controlled externally. The button below also toggles it.
					</p>
				</Content>
			</Root>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				class={style.collapsible__button}
			>
				{open() ? "Close" : "Open"} from outside
			</button>
		</div>
	);
}

/**
 * Pass `open` + `onOpenChange` for fully controlled state.
 * The button and the Controls panel both drive the open state.
 */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
