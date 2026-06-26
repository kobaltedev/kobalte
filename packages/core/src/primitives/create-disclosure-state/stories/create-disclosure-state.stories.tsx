import { createSignal } from "solid-js";
import preview from "../../../../../../.storybook/preview.js";
import { createDisclosureState } from "../index";

const meta = preview.meta({
	title: "Primitives/createDisclosureState",
	tags: ["autodocs"],
});

export default meta;

const panelClass =
	"rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 font-sans";

const btnClass =
	"rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 font-sans";

/**
 * `createDisclosureState` manages open/close/toggle for any panel or overlay.
 * Use `isOpen`, `open()`, `close()`, and `toggle()` to wire up any UI.
 */
export const Default = meta.story({
	name: "Default",
	render: () => {
		const state = createDisclosureState();
		return (
			<div class="flex flex-col gap-3">
				<div class="flex gap-2">
					<button class={btnClass} onClick={state.toggle}>
						Toggle
					</button>
					<button class={btnClass} onClick={state.open}>
						Open
					</button>
					<button class={btnClass} onClick={state.close}>
						Close
					</button>
				</div>
				<p class="text-xs text-slate-500 font-sans">
					State: <strong>{state.isOpen() ? "open" : "closed"}</strong>
				</p>
				{state.isOpen() && (
					<div class={panelClass}>Panel content is visible.</div>
				)}
			</div>
		);
	},
});

/** `defaultOpen` mounts the disclosure already open without controlling state. */
export const DefaultOpen = meta.story({
	name: "Default Open",
	render: () => {
		const state = createDisclosureState({ defaultOpen: true });
		return (
			<div class="flex flex-col gap-3">
				<button class={btnClass} onClick={state.toggle}>
					Toggle
				</button>
				<p class="text-xs text-slate-500 font-sans">
					State: <strong>{state.isOpen() ? "open" : "closed"}</strong>
				</p>
				{state.isOpen() && <div class={panelClass}>Opened by default.</div>}
			</div>
		);
	},
});

/** `open` + `onOpenChange` give full external control over the disclosure state. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => {
		const [open, setOpen] = createSignal(false);
		const state = createDisclosureState({
			open,
			onOpenChange: setOpen,
		});
		return (
			<div class="flex flex-col gap-3">
				<div class="flex gap-2">
					<button class={btnClass} onClick={state.toggle}>
						Toggle (internal)
					</button>
					<button class={btnClass} onClick={() => setOpen(true)}>
						Force open (external)
					</button>
					<button class={btnClass} onClick={() => setOpen(false)}>
						Force close (external)
					</button>
				</div>
				<p class="text-xs text-slate-500 font-sans">
					Signal: <strong>{open() ? "open" : "closed"}</strong>
					{" · "}
					Disclosure: <strong>{state.isOpen() ? "open" : "closed"}</strong>
				</p>
				{state.isOpen() && (
					<div class={panelClass}>Both buttons control the same state.</div>
				)}
			</div>
		);
	},
});

/** Multiple independent disclosure states can coexist in the same scope. */
export const Multiple = meta.story({
	name: "Multiple",
	render: () => {
		const sections = ["Introduction", "Details", "Summary"].map((label) => ({
			label,
			state: createDisclosureState(),
		}));
		return (
			<div class="flex flex-col gap-2 font-sans w-72">
				{sections.map(({ label, state }) => (
					<div class="rounded-md border border-slate-200 overflow-hidden">
						<button
							class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
							onClick={state.toggle}
						>
							{label}
							<span class="text-slate-400 text-xs">
								{state.isOpen() ? "▲" : "▼"}
							</span>
						</button>
						{state.isOpen() && (
							<div class="px-4 py-3 text-sm text-slate-600 bg-slate-50 border-t border-slate-200">
								Content for {label}.
							</div>
						)}
					</div>
				))}
			</div>
		);
	},
});
