import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Arrow,
	CloseButton,
	Content,
	Description,
	Portal,
	Root,
	Title,
	Trigger,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Popover",
	tags: ["autodocs"],
});

export default meta;

/** A basic popover opened by a button. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={style.popover__trigger}>Open</Trigger>
			<Portal>
				<Content class={style.popover__content}>
					<CloseButton class={style.popover__close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.popover__title}>Popover title</Title>
					<Description class={style.popover__description}>
						This is the popover description providing additional context.
					</Description>
				</Content>
			</Portal>
		</Root>
	),
});

/** Arrow pointing toward the trigger. */
export const WithArrow = meta.story({
	name: "With Arrow",
	render: () => (
		<Root>
			<Trigger class={style.popover__trigger}>With Arrow</Trigger>
			<Portal>
				<Content class={style.popover__content}>
					<Arrow class={style.popover__arrow} />
					<CloseButton class={style.popover__close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.popover__title}>With arrow</Title>
					<Description class={style.popover__description}>
						The arrow points to the trigger element.
					</Description>
				</Content>
			</Portal>
		</Root>
	),
});

/** Placement options — popover opens at the specified side. */
export const Placements = meta.story({
	name: "Placements",
	render: () => (
		<div class={style.popover__wrapper}>
			{(["top", "bottom", "left", "right"] as const).map((side) => (
				<Root placement={side}>
					<Trigger class={style.popover__trigger}>{side}</Trigger>
					<Portal>
						<Content class={style.popover__content}>
							<Title class={style.popover__title}>{side}</Title>
							<Description class={style.popover__description}>
								Placed at {side}.
							</Description>
						</Content>
					</Portal>
				</Root>
			))}
		</div>
	),
});

/** `modal` traps focus and blocks outside interaction. */
export const Modal = meta.story({
	name: "Modal",
	render: () => (
		<Root modal>
			<Trigger class={style.popover__trigger}>Modal</Trigger>
			<Portal>
				<Content class={style.popover__content}>
					<CloseButton class={style.popover__close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.popover__title}>Modal popover</Title>
					<Description class={style.popover__description}>
						Focus is trapped and outside content is hidden from assistive tech.
					</Description>
				</Content>
			</Portal>
		</Root>
	),
});

/** Controlled open state with external signal. */
function ControlledDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<div class={style["popover__controlled-wrapper"]}>
			<div class={style["popover__controlled-row"]}>
				<Root open={open()} onOpenChange={setOpen}>
					<Trigger class={style.popover__trigger}>Controlled</Trigger>
					<Portal>
						<Content class={style.popover__content}>
							<CloseButton class={style.popover__close} aria-label="Close">
								✕
							</CloseButton>
							<Title class={style.popover__title}>Controlled</Title>
							<Description class={style.popover__description}>
								Open state is managed externally.
							</Description>
						</Content>
					</Portal>
				</Root>
				<button
					type="button"
					class={style.popover__trigger}
					onClick={() => setOpen((o) => !o)}
				>
					{open() ? "Force close" : "Force open"}
				</button>
			</div>
			<p class={style.popover__state}>
				State: <strong>{open() ? "open" : "closed"}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** A form inside a popover — common pattern for quick edits. */
export const WithForm = meta.story({
	name: "With Form",
	render: () => (
		<Root>
			<Trigger class={style.popover__trigger}>Edit profile</Trigger>
			<Portal>
				<Content
					class={[style.popover__content, style["popover__content--wide"]]}
				>
					<CloseButton class={style.popover__close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.popover__title}>Edit profile</Title>
					<div class={style.popover__form}>
						<label class={style.popover__label} for="pop-name">
							Display name
						</label>
						<input
							id="pop-name"
							type="text"
							placeholder="Jane Doe"
							class={style.popover__input}
						/>
						<label class={style.popover__label} for="pop-bio">
							Bio
						</label>
						<textarea
							id="pop-bio"
							rows={2}
							placeholder="A short bio..."
							class={style.popover__textarea}
						/>
						<button type="button" class={style["popover__save-btn"]}>
							Save
						</button>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});
