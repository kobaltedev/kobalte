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
} from "../index";

const meta = preview.meta({
	title: "Components/Popover",
	tags: ["autodocs"],
});

export default meta;

const triggerClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const contentClass =
	"z-50 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-md outline-none font-sans";

const closeClass =
	"absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

/** A basic popover opened by a button. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={triggerClass}>Open</Trigger>
			<Portal>
				<Content class={contentClass}>
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="mb-1 text-sm font-semibold text-slate-900">
						Popover title
					</Title>
					<Description class="text-xs text-slate-500">
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
			<Trigger class={triggerClass}>With Arrow</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Arrow class="fill-white [filter:drop-shadow(0_1px_0_rgb(226_232_240))]" />
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="mb-1 text-sm font-semibold text-slate-900">
						With arrow
					</Title>
					<Description class="text-xs text-slate-500">
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
		<div class="flex flex-wrap gap-2 font-sans">
			{(["top", "bottom", "left", "right"] as const).map((side) => (
				<Root placement={side}>
					<Trigger class={triggerClass}>{side}</Trigger>
					<Portal>
						<Content class={contentClass}>
							<Title class="text-sm font-semibold text-slate-900">{side}</Title>
							<Description class="text-xs text-slate-500 mt-1">
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
			<Trigger class={triggerClass}>Modal</Trigger>
			<Portal>
				<Content class={contentClass}>
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="mb-1 text-sm font-semibold text-slate-900">
						Modal popover
					</Title>
					<Description class="text-xs text-slate-500">
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
		<div class="flex flex-col gap-3 font-sans">
			<div class="flex items-center gap-2">
				<Root open={open()} onOpenChange={setOpen}>
					<Trigger class={triggerClass}>Controlled</Trigger>
					<Portal>
						<Content class={contentClass}>
							<CloseButton class={closeClass} aria-label="Close">
								✕
							</CloseButton>
							<Title class="mb-1 text-sm font-semibold text-slate-900">
								Controlled
							</Title>
							<Description class="text-xs text-slate-500">
								Open state is managed externally.
							</Description>
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

/** A form inside a popover — common pattern for quick edits. */
export const WithForm = meta.story({
	name: "With Form",
	render: () => (
		<Root>
			<Trigger class={triggerClass}>Edit profile</Trigger>
			<Portal>
				<Content class={`${contentClass} w-80`}>
					<CloseButton class={closeClass} aria-label="Close">
						✕
					</CloseButton>
					<Title class="mb-3 text-sm font-semibold text-slate-900">
						Edit profile
					</Title>
					<div class="flex flex-col gap-2">
						<label class="text-xs text-slate-600" for="pop-name">
							Display name
						</label>
						<input
							id="pop-name"
							type="text"
							placeholder="Jane Doe"
							class="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<label class="text-xs text-slate-600" for="pop-bio">
							Bio
						</label>
						<textarea
							id="pop-bio"
							rows={2}
							placeholder="A short bio..."
							class="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button class="mt-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
							Save
						</button>
					</div>
				</Content>
			</Portal>
		</Root>
	),
});
