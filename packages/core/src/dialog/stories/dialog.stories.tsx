import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	CloseButton,
	Content,
	Description,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Dialog",
	tags: ["autodocs"],
});

export default meta;

/** A modal dialog opened by a button with an overlay backdrop. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={style.dialog__trigger}>Open dialog</Trigger>
			<Portal>
				<Overlay class={style.dialog__overlay} />
				<Content class={style.dialog__content}>
					<CloseButton class={style.dialog__close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.dialog__title}>Dialog title</Title>
					<Description
						class={`${style.dialog__description} ${style["dialog__description--mb"]}`}
					>
						This is the dialog description providing additional context for the
						user.
					</Description>
					<div class={style.dialog__footer}>
						<CloseButton class={style["dialog__cancel-btn"]}>
							Cancel
						</CloseButton>
						<button type="button" class={style["dialog__action-btn"]}>
							Confirm
						</button>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});

/** Non-modal dialog — background content remains interactive. */
export const NonModal = meta.story({
	name: "Non-Modal",
	render: () => (
		<Root modal={false}>
			<Trigger class={style.dialog__trigger}>Open non-modal</Trigger>
			<Portal>
				<Content class={style.dialog__content}>
					<CloseButton class={style.dialog__close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.dialog__title}>Non-modal dialog</Title>
					<Description class={style.dialog__description}>
						Background content is still interactive — no overlay is used.
					</Description>
				</Content>
			</Portal>
		</Root>
	),
});

/** Controlled open state driven by an external signal. */
function ControlledDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<div class={style.dialog__wrapper}>
			<div class={style.dialog__row}>
				<Root open={open()} onOpenChange={setOpen}>
					<Trigger class={style.dialog__trigger}>Controlled dialog</Trigger>
					<Portal>
						<Overlay class={style.dialog__overlay} />
						<Content class={style.dialog__content}>
							<CloseButton class={style.dialog__close} aria-label="Close">
								✕
							</CloseButton>
							<Title class={style.dialog__title}>Controlled</Title>
							<Description
								class={`${style.dialog__description} ${style["dialog__description--mb"]}`}
							>
								Open state is managed by an external signal.
							</Description>
							<div class={style.dialog__footer}>
								<button
									type="button"
									class={style["dialog__action-btn"]}
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
					class={style.dialog__trigger}
					onClick={() => setOpen((o) => !o)}
				>
					{open() ? "Force close" : "Force open"}
				</button>
			</div>
			<p class={style.dialog__state}>
				State: <strong>{open() ? "open" : "closed"}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Dialog with a form — common pattern for inline data entry. */
export const WithForm = meta.story({
	name: "With Form",
	render: () => (
		<Root>
			<Trigger class={style.dialog__trigger}>Edit profile</Trigger>
			<Portal>
				<Overlay class={style.dialog__overlay} />
				<Content
					class={`${style.dialog__content} ${style["dialog__content--sm"]}`}
				>
					<CloseButton class={style.dialog__close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.dialog__title}>Edit profile</Title>
					<Description
						class={`${style.dialog__description} ${style["dialog__description--mb"]}`}
					>
						Update your display name and bio.
					</Description>
					<div class={style.dialog__form}>
						<div class={style.dialog__field}>
							<label class={style.dialog__label} for="dlg-name">
								Display name
							</label>
							<input
								id="dlg-name"
								type="text"
								placeholder="Jane Doe"
								class={style.dialog__input}
							/>
						</div>
						<div class={style.dialog__field}>
							<label class={style.dialog__label} for="dlg-bio">
								Bio
							</label>
							<textarea
								id="dlg-bio"
								rows={3}
								placeholder="A short bio..."
								class={style.dialog__textarea}
							/>
						</div>
						<div class={style["dialog__form-footer"]}>
							<button type="button" class={style["dialog__cancel-btn"]}>
								Cancel
							</button>
							<button type="button" class={style["dialog__action-btn"]}>
								Save changes
							</button>
						</div>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});

/** Destructive confirmation — warn before an irreversible action. */
export const Destructive = meta.story({
	name: "Destructive",
	render: () => (
		<Root>
			<Trigger class={style["dialog__destructive-trigger"]}>
				Delete account
			</Trigger>
			<Portal>
				<Overlay class={style.dialog__overlay} />
				<Content class={style.dialog__content}>
					<CloseButton class={style.dialog__close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.dialog__title}>Delete account</Title>
					<Description
						class={`${style.dialog__description} ${style["dialog__description--mb"]}`}
					>
						This action cannot be undone. Your account and all associated data
						will be permanently deleted.
					</Description>
					<div class={style.dialog__footer}>
						<button type="button" class={style["dialog__cancel-btn"]}>
							Cancel
						</button>
						<button type="button" class={style["dialog__destructive-action"]}>
							Delete account
						</button>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});

/**
 * Toggle `defaultOpen` in the Controls panel, then **refresh the story** to
 * see the dialog start open. The prop is read only on initial mount.
 */
export const DefaultOpen = meta.story({
	name: "Default Open",
	args: { defaultOpen: false },
	argTypes: {
		defaultOpen: {
			control: "boolean",
			description: "Open on initial mount. Refresh the story after toggling.",
		},
	},
	render: (args) => (
		<Root defaultOpen={args.defaultOpen}>
			<Trigger class={style.dialog__trigger}>Re-open</Trigger>
			<Portal>
				<Overlay class={style.dialog__overlay} />
				<Content class={style.dialog__content}>
					<CloseButton class={style.dialog__close} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style.dialog__title}>Starts open</Title>
					<Description class={style.dialog__description}>
						Enable <strong>defaultOpen</strong> in the Controls panel and
						refresh to see the dialog open on load.
					</Description>
				</Content>
			</Portal>
		</Root>
	),
});
