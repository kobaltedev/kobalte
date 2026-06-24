import preview from "../../../../../../.storybook/preview.js";
import { createTagName } from "../index";

const meta = preview.meta({
	title: "Primitives/createTagName",
	tags: ["autodocs"],
});

export default meta;

const badgeClass =
	"inline-block rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600";

/**
 * `createTagName` resolves an element's actual HTML tag by reading a DOM ref.
 * Useful when a polymorphic component needs to know its rendered tag at runtime
 * (e.g. to decide whether to add `role="button"` or fire click on Enter/Space).
 */
export const Default = meta.story({
	name: "Default",
	render: () => {
		let ref: HTMLDivElement | undefined;
		const tagName = createTagName(
			() => ref,
			() => "div",
		);
		return (
			<div class="flex flex-col gap-2 font-sans">
				<div ref={ref} class="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
					I am a <code class={badgeClass}>div</code>
				</div>
				<p class="text-xs text-slate-500">
					Resolved tag: <span class={badgeClass}>{tagName() ?? "—"}</span>
				</p>
			</div>
		);
	},
});

/** The fallback tag is used before the ref is assigned and for non-string components. */
export const WithFallback = meta.story({
	name: "With Fallback",
	render: () => {
		let ref: HTMLButtonElement | undefined;
		const tagName = createTagName(
			() => ref,
			() => "button",
		);
		return (
			<div class="flex flex-col gap-2 font-sans">
				<button
					ref={ref}
					class="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
				>
					I am a <code class={badgeClass}>button</code>
				</button>
				<p class="text-xs text-slate-500">
					Resolved tag: <span class={badgeClass}>{tagName() ?? "—"}</span>
				</p>
			</div>
		);
	},
});

/**
 * When no ref is provided, `createTagName` returns the fallback.
 * When a ref is attached, it reads the actual `tagName` from the DOM element.
 */
export const FallbackVsResolved = meta.story({
	name: "Fallback vs Resolved",
	render: () => {
		let ref: HTMLButtonElement | undefined;

		// No ref — only the fallback "span" is used
		const fallbackOnly = createTagName(() => undefined, () => "span");
		// Ref attached to a <button> — resolves to "button", ignoring the "span" fallback
		const resolved = createTagName(() => ref, () => "span");

		return (
			<div class="flex flex-col gap-3 font-sans text-sm">
				<div class="rounded-md border border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
					<span class="text-slate-500">No ref (fallback = "span")</span>
					<span class={badgeClass}>{fallbackOnly() ?? "—"}</span>
				</div>
				<div class="rounded-md border border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
					<button ref={ref} class="text-slate-700 bg-transparent outline-none">
						Button ref (fallback = "span")
					</button>
					<span class={badgeClass}>{resolved() ?? "—"}</span>
				</div>
			</div>
		);
	},
});

/** Multiple refs in the same component each get their own resolved tag. */
export const Multiple = meta.story({
	name: "Multiple",
	render: () => {
		let divRef: HTMLDivElement | undefined;
		let btnRef: HTMLButtonElement | undefined;
		let inputRef: HTMLInputElement | undefined;

		const divTag = createTagName(() => divRef);
		const btnTag = createTagName(() => btnRef);
		const inputTag = createTagName(() => inputRef);

		return (
			<div class="flex flex-col gap-2 font-sans text-sm">
				<div class="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
					<div ref={divRef} class="text-slate-700">Section</div>
					<span class="text-xs text-slate-400">tag: <span class={badgeClass}>{divTag() ?? "—"}</span></span>
				</div>
				<div class="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
					<button ref={btnRef} class="text-slate-700 outline-none bg-transparent">Action</button>
					<span class="text-xs text-slate-400">tag: <span class={badgeClass}>{btnTag() ?? "—"}</span></span>
				</div>
				<div class="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
					<input ref={inputRef} placeholder="Field" class="text-slate-700 outline-none bg-transparent" />
					<span class="text-xs text-slate-400">tag: <span class={badgeClass}>{inputTag() ?? "—"}</span></span>
				</div>
			</div>
		);
	},
});
