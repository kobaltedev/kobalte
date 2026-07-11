import { createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Delete, Root } from "../index";

const meta = preview.meta({
	title: "Components/Chip",
	tags: ["autodocs"],
});

export default meta;

const baseClass =
	"inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium bg-slate-100 text-slate-700";

const clickableClass =
	"data-[clickable]:cursor-pointer data-[clickable]:hover:bg-slate-200 data-[clickable]:focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500";

const disabledClass =
	"data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";

const deleteButtonClass =
	"inline-flex items-center justify-center rounded-full size-4 hover:bg-slate-300 disabled:cursor-not-allowed disabled:hover:bg-transparent";

/** A static, non-interactive chip — no role or tabindex is added since no `onClick` is provided. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<div class="flex gap-2 font-sans">
			<Root class={baseClass}>Design</Root>
			<Root class={baseClass}>Engineering</Root>
			<Root class={baseClass}>Product</Root>
		</div>
	),
});

/** Passing `onClick` makes the chip keyboard-operable (`role="button"`, focusable, Enter/Space activate it). */
function ClickableDemo() {
	const [selected, setSelected] = createSignal<string[]>([]);
	const options = ["React", "Solid", "Vue", "Svelte"];

	const toggle = (value: string) => {
		setSelected((prev) =>
			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
		);
	};

	return (
		<div class="flex flex-wrap gap-2 font-sans">
			<For each={options}>
				{(option) => (
					<Root
						class={`${baseClass} ${clickableClass} ${
							selected().includes(option) ? "bg-blue-600 text-white" : ""
						}`}
						onClick={() => toggle(option)}
					>
						{option}
					</Root>
				)}
			</For>
		</div>
	);
}

export const Clickable = meta.story({
	name: "Clickable",
	render: () => <ClickableDemo />,
});

/** `Chip.Delete` stops its click from bubbling to `Chip.Root`, so removal and selection can coexist. */
function DeletableDemo() {
	const [tags, setTags] = createSignal(["urgent", "bug", "frontend"]);

	const remove = (tag: string) => {
		setTags((prev) => prev.filter((t) => t !== tag));
	};

	return (
		<div class="flex flex-wrap gap-2 font-sans">
			<For each={tags()}>
				{(tag) => (
					<Root class={baseClass}>
						{tag}
						<Delete
							class={deleteButtonClass}
							onClick={() => remove(tag)}
							aria-label={`Remove ${tag}`}
						>
							✕
						</Delete>
					</Root>
				)}
			</For>
		</div>
	);
}

export const Deletable = meta.story({
	name: "Deletable",
	render: () => <DeletableDemo />,
});

/** `disabled` on `Chip.Root` cascades to a nested `Chip.Delete` automatically. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<div class="flex gap-2 font-sans">
			<Root class={`${baseClass} ${disabledClass}`} disabled onClick={() => {}}>
				Archived
			</Root>
			<Root class={`${baseClass} ${disabledClass}`} disabled>
				Archived
				<Delete class={deleteButtonClass}>✕</Delete>
			</Root>
		</div>
	),
});

/** Decorators are just children — no dedicated slot component is needed. */
export const WithDecorators = meta.story({
	name: "With Decorators",
	render: () => (
		<div class="flex gap-2 font-sans">
			<Root class={baseClass}>
				<span aria-hidden="true">●</span>
				Online
			</Root>
			<Root class={`${baseClass} ${clickableClass}`} onClick={() => {}}>
				<span aria-hidden="true">★</span>
				Favorite
			</Root>
		</div>
	),
});
