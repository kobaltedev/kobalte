import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { CloseButton, Content, Description, Overlay, Portal, Root, Title, Trigger } from "../index";

const meta = preview.meta({
	title: "Components/Dialog",
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

const actionBtnClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const cancelBtnClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

/** A modal dialog opened by a button with an overlay backdrop. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={triggerClass}>Open dialog</Trigger>
			<Portal>
				<Overlay class={overlayClass} />
				<Content class={contentClass}>
					<CloseButton class={closeClass} aria-label="Close">✕</CloseButton>
					<Title class="mb-1 text-base font-semibold text-slate-900">Dialog title</Title>
					<Description class="text-sm text-slate-500 mb-4">
						This is the dialog description providing additional context for the user.
					</Description>
					<div class="flex justify-end gap-2">
						<CloseButton class={cancelBtnClass}>Cancel</CloseButton>
						<button class={actionBtnClass}>Confirm</button>
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
			<Trigger class={triggerClass}>Open non-modal</Trigger>
			<Portal>
				<Content class={contentClass}>
					<CloseButton class={closeClass} aria-label="Close">✕</CloseButton>
					<Title class="mb-1 text-base font-semibold text-slate-900">Non-modal dialog</Title>
					<Description class="text-sm text-slate-500">
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
		<div class="flex flex-col gap-3 font-sans">
			<div class="flex items-center gap-2">
				<Root open={open()} onOpenChange={setOpen}>
					<Trigger class={triggerClass}>Controlled dialog</Trigger>
					<Portal>
						<Overlay class={overlayClass} />
						<Content class={contentClass}>
							<CloseButton class={closeClass} aria-label="Close">✕</CloseButton>
							<Title class="mb-1 text-base font-semibold text-slate-900">Controlled</Title>
							<Description class="text-sm text-slate-500 mb-4">
								Open state is managed by an external signal.
							</Description>
							<div class="flex justify-end">
								<button class={actionBtnClass} onClick={() => setOpen(false)}>
									Done
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

/** Dialog with a form — common pattern for inline data entry. */
export const WithForm = meta.story({
	name: "With Form",
	render: () => (
		<Root>
			<Trigger class={triggerClass}>Edit profile</Trigger>
			<Portal>
				<Overlay class={overlayClass} />
				<Content class={`${contentClass} max-w-sm`}>
					<CloseButton class={closeClass} aria-label="Close">✕</CloseButton>
					<Title class="mb-1 text-base font-semibold text-slate-900">Edit profile</Title>
					<Description class="text-sm text-slate-500 mb-4">
						Update your display name and bio.
					</Description>
					<div class="flex flex-col gap-3">
						<div class="flex flex-col gap-1">
							<label class="text-xs font-medium text-slate-600" for="dlg-name">
								Display name
							</label>
							<input
								id="dlg-name"
								type="text"
								placeholder="Jane Doe"
								class="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div class="flex flex-col gap-1">
							<label class="text-xs font-medium text-slate-600" for="dlg-bio">
								Bio
							</label>
							<textarea
								id="dlg-bio"
								rows={3}
								placeholder="A short bio..."
								class="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div class="flex justify-end gap-2 mt-1">
							<button class={cancelBtnClass}>Cancel</button>
							<button class={actionBtnClass}>Save changes</button>
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
			<Trigger class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
				Delete account
			</Trigger>
			<Portal>
				<Overlay class={overlayClass} />
				<Content class={contentClass}>
					<CloseButton class={closeClass} aria-label="Close">✕</CloseButton>
					<Title class="mb-1 text-base font-semibold text-slate-900">Delete account</Title>
					<Description class="text-sm text-slate-500 mb-4">
						This action cannot be undone. Your account and all associated data will be permanently deleted.
					</Description>
					<div class="flex justify-end gap-2">
						<button class={cancelBtnClass}>Cancel</button>
						<button class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
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
		defaultOpen: { control: "boolean", description: "Open on initial mount. Refresh the story after toggling." },
	},
	render: (args) => (
		<Root defaultOpen={args.defaultOpen}>
			<Trigger class={triggerClass}>Re-open</Trigger>
			<Portal>
				<Overlay class={overlayClass} />
				<Content class={contentClass}>
					<CloseButton class={closeClass} aria-label="Close">✕</CloseButton>
					<Title class="mb-1 text-base font-semibold text-slate-900">Starts open</Title>
					<Description class="text-sm text-slate-500">
						Enable <strong>defaultOpen</strong> in the Controls panel and refresh to see the dialog open on load.
					</Description>
				</Content>
			</Portal>
		</Root>
	),
});
