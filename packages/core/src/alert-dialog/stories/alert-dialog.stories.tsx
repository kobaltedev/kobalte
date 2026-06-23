import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { CloseButton, Content, Description, Overlay, Portal, Root, Title, Trigger } from "../index";

const meta = preview.meta({
	title: "Components/AlertDialog",
	tags: ["autodocs"],
});

export default meta;

const triggerClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const overlayClass =
	"fixed inset-0 z-50 bg-black/40 backdrop-blur-sm";

const contentClass =
	"fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-6 shadow-xl outline-none font-sans";

const closeClass =
	"absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

const cancelBtnClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

/** Interrupts the user with an important message requiring acknowledgement. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={triggerClass}>Open alert</Trigger>
			<Portal>
				<Overlay class={overlayClass} />
				<Content class={contentClass}>
					<CloseButton class={closeClass} aria-label="Close">✕</CloseButton>
					<Title class="mb-1 text-base font-semibold text-slate-900">Session timeout</Title>
					<Description class="text-sm text-slate-500 mb-4">
						Your session is about to expire. You will be logged out in 2 minutes.
					</Description>
					<div class="flex justify-end gap-2">
						<CloseButton class={cancelBtnClass}>Dismiss</CloseButton>
						<button class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
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
			<Trigger class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
				Delete account
			</Trigger>
			<Portal>
				<Overlay class={overlayClass} />
				<Content class={contentClass}>
					<Title class="mb-1 text-base font-semibold text-slate-900">Delete account</Title>
					<Description class="text-sm text-slate-500 mb-4">
						This action cannot be undone. Your account and all associated data will be permanently deleted.
					</Description>
					<div class="flex justify-end gap-2">
						<CloseButton class={cancelBtnClass}>Cancel</CloseButton>
						<button class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
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
		<div class="flex flex-col gap-3 font-sans">
			<div class="flex items-center gap-2">
				<Root open={open()} onOpenChange={setOpen}>
					<Trigger class={triggerClass}>Controlled alert</Trigger>
					<Portal>
						<Overlay class={overlayClass} />
						<Content class={contentClass}>
							<Title class="mb-1 text-base font-semibold text-slate-900">Controlled alert</Title>
							<Description class="text-sm text-slate-500 mb-4">
								Open state is managed externally.
							</Description>
							<div class="flex justify-end">
								<button
									class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
									onClick={() => setOpen(false)}
								>
									Acknowledge
								</button>
							</div>
						</Content>
					</Portal>
				</Root>
				<button class={triggerClass} onClick={() => setOpen((o) => !o)}>
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
