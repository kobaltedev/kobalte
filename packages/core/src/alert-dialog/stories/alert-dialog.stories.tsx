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
	title: "Components/AlertDialog",
	tags: ["autodocs"],
});

export default meta;

/** Interrupts the user with an important message requiring acknowledgement. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={style["alert-dialog__trigger"]}>Open alert</Trigger>
			<Portal>
				<Overlay class={style["alert-dialog__overlay"]} />
				<Content class={style["alert-dialog__content"]}>
					<CloseButton class={style["alert-dialog__close"]} aria-label="Close">
						✕
					</CloseButton>
					<Title class={style["alert-dialog__title"]}>Session timeout</Title>
					<Description
						class={`${style["alert-dialog__description"]} ${style["alert-dialog__description--mb"]}`}
					>
						Your session is about to expire. You will be logged out in 2
						minutes.
					</Description>
					<div class={style["alert-dialog__footer"]}>
						<CloseButton class={style["alert-dialog__cancel-btn"]}>
							Dismiss
						</CloseButton>
						<button type="button" class={style["alert-dialog__action-btn"]}>
							Stay signed in
						</button>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});

/** Destructive confirmation — confirms an irreversible action before proceeding. */
export const Destructive = meta.story({
	name: "Destructive",
	render: () => (
		<Root>
			<Trigger class={style["alert-dialog__destructive-trigger"]}>
				Delete account
			</Trigger>
			<Portal>
				<Overlay class={style["alert-dialog__overlay"]} />
				<Content class={style["alert-dialog__content"]}>
					<Title class={style["alert-dialog__title"]}>Delete account</Title>
					<Description
						class={`${style["alert-dialog__description"]} ${style["alert-dialog__description--mb"]}`}
					>
						This action cannot be undone. Your account and all associated data
						will be permanently deleted.
					</Description>
					<div class={style["alert-dialog__footer"]}>
						<CloseButton class={style["alert-dialog__cancel-btn"]}>
							Cancel
						</CloseButton>
						<button
							type="button"
							class={style["alert-dialog__destructive-action"]}
						>
							Delete account
						</button>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});

/** Controlled open state driven by an external signal. */
function ControlledDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<div class={style["alert-dialog__wrapper"]}>
			<div class={style["alert-dialog__row"]}>
				<Root open={open()} onOpenChange={setOpen}>
					<Trigger class={style["alert-dialog__trigger"]}>
						Controlled alert
					</Trigger>
					<Portal>
						<Overlay class={style["alert-dialog__overlay"]} />
						<Content class={style["alert-dialog__content"]}>
							<Title class={style["alert-dialog__title"]}>
								Controlled alert
							</Title>
							<Description
								class={`${style["alert-dialog__description"]} ${style["alert-dialog__description--mb"]}`}
							>
								Open state is managed externally.
							</Description>
							<div class={style["alert-dialog__footer"]}>
								<button
									type="button"
									class={style["alert-dialog__action-btn"]}
									onClick={() => setOpen(false)}
								>
									Acknowledge
								</button>
							</div>
						</Content>
					</Portal>
				</Root>
				<button
					type="button"
					class={style["alert-dialog__trigger"]}
					onClick={() => setOpen((o) => !o)}
				>
					{open() ? "Force close" : "Force open"}
				</button>
			</div>
			<p class={style["alert-dialog__state"]}>
				State: <strong>{open() ? "open" : "closed"}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
