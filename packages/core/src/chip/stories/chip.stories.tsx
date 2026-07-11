import { createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import * as Checkbox from "../../checkbox";
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

/** Passing `onClick` makes the chip keyboard-operable (`role="button"`, focusable, Enter/Space activate it). Use this for one-off actions, not selection — see "Selectable" for that. */
export const Clickable = meta.story({
	name: "Clickable",
	render: () => (
		<div class="flex flex-wrap gap-2 font-sans">
			<Root
				class={`${baseClass} ${clickableClass}`}
				onClick={() => alert("React repos")}
			>
				React
			</Root>
			<Root
				class={`${baseClass} ${clickableClass}`}
				onClick={() => alert("Solid repos")}
			>
				Solid
			</Root>
		</div>
	),
});

/**
 * `Chip` has no built-in `selected`/`pressed` prop. Selectable (filter) chips are built by
 * composing `Chip` with `Checkbox` — the same approach MUI Joy's `Chip` uses
 * (https://v7.mui.com/joy-ui/react-chip/#with-a-checkbox). A real checkbox input, stretched to
 * invisibly cover the whole chip, owns interaction and ARIA state; the chip reacts to the nested
 * checkbox's `data-checked` via the CSS `:has()` selector — no extra JS wiring needed.
 */
function SelectableDemo() {
	const options = ["React", "Solid", "Vue", "Svelte"];

	const overlayStyle = {
		position: "absolute",
		inset: "0",
		margin: "0",
		width: "auto",
		height: "auto",
		padding: "0",
		border: "0",
		overflow: "visible",
		clip: "auto",
		"clip-path": "none",
		"white-space": "normal",
	} as const;

	return (
		<div class="flex flex-wrap gap-2 font-sans">
			<For each={options}>
				{(option) => (
					<Root
						class={`${baseClass} relative has-[[data-checked]]:bg-blue-600 has-[[data-checked]]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-500`}
					>
						<Checkbox.Root class="contents">
							<Checkbox.Input
								class="opacity-0 cursor-pointer"
								style={overlayStyle}
							/>
							<Checkbox.Label class="pointer-events-none">
								{option}
							</Checkbox.Label>
						</Checkbox.Root>
					</Root>
				)}
			</For>
		</div>
	);
}

export const Selectable = meta.story({
	name: "Selectable",
	render: () => <SelectableDemo />,
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
