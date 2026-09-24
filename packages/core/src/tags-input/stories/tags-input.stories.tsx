import { createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import * as TagsInput from "../index";
import { useTagsInputContext } from "../tags-input-context";

const meta = preview.meta({
	title: "Components/TagsInput",
	tags: ["autodocs"],
});

export default meta;

const controlClass =
	"flex flex-wrap items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-1.5 " +
	"data-[focus]:border-blue-500 data-[focus]:ring-2 data-[focus]:ring-blue-500/20 " +
	"data-[disabled]:cursor-not-allowed data-[disabled]:bg-slate-50 data-[disabled]:opacity-60 " +
	"data-[invalid]:border-red-500";

const itemClass =
	"group flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-sm text-slate-700 " +
	"outline-none data-[highlighted]:ring-2 data-[highlighted]:ring-blue-500 data-[disabled]:opacity-50";

const inputClass =
	"min-w-[100px] flex-1 border-none bg-transparent px-1 py-0.5 text-sm text-slate-900 outline-none " +
	"placeholder:text-slate-400 disabled:cursor-not-allowed";

const deleteTriggerClass =
	"flex h-4 w-4 items-center justify-center rounded-full text-slate-400 " +
	"hover:bg-slate-200 hover:text-slate-600 disabled:pointer-events-none";

// Renders one `TagsInput.Item` per current tag. Reads the list straight from
// the root's context so it stays correct as tags are added, removed or edited.
function TagsExampleItems() {
	const context = useTagsInputContext();

	return (
		<For each={context.value()} keyed={false}>
			{(value, index) => (
				<TagsInput.Item value={value()} index={index} class={itemClass}>
					<TagsInput.ItemPreview class="flex items-center gap-1">
						<TagsInput.ItemText />
						<TagsInput.ItemDeleteTrigger class={deleteTriggerClass}>
							×
						</TagsInput.ItemDeleteTrigger>
					</TagsInput.ItemPreview>
					<TagsInput.ItemInput class="w-16 bg-transparent text-sm outline-none" />
				</TagsInput.Item>
			)}
		</For>
	);
}

/** Basic tags input with a couple of default tags. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<TagsInput.Root defaultValue={["Solid", "Kobalte"]} class="w-80 font-sans">
			<TagsInput.Label class="mb-1 block text-sm font-medium text-slate-700">
				Tags
			</TagsInput.Label>
			<TagsInput.Control class={controlClass}>
				<TagsExampleItems />
				<TagsInput.Input class={inputClass} placeholder="Add a tag…" />
			</TagsInput.Control>
		</TagsInput.Root>
	),
});

/** Controlled value, with a live readout and a clear-all trigger. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => {
		const [value, setValue] = createSignal<string[]>(["red", "green"]);

		return (
			<div class="flex w-80 flex-col gap-2 font-sans">
				<TagsInput.Root value={value()} onChange={setValue}>
					<TagsInput.Label class="mb-1 block text-sm font-medium text-slate-700">
						Colors
					</TagsInput.Label>
					<TagsInput.Control class={controlClass}>
						<TagsExampleItems />
						<TagsInput.Input class={inputClass} placeholder="Add a color…" />
					</TagsInput.Control>
					<TagsInput.ClearTrigger class="mt-1 self-start text-xs text-slate-500 hover:text-slate-700 disabled:opacity-50">
						Clear all
					</TagsInput.ClearTrigger>
				</TagsInput.Root>
				<p class="text-xs text-slate-500">Value: {JSON.stringify(value())}</p>
			</div>
		);
	},
});

/**
 * Custom delimiter (space) plus paste-splitting: paste a space-separated list
 * of values and each one becomes its own tag.
 */
export const DelimiterAndPaste = meta.story({
	name: "Delimiter & Paste",
	render: () => (
		<div class="flex w-80 flex-col gap-2 font-sans">
			<TagsInput.Root delimiter=" " addOnPaste>
				<TagsInput.Label class="mb-1 block text-sm font-medium text-slate-700">
					Keywords
				</TagsInput.Label>
				<TagsInput.Control class={controlClass}>
					<TagsExampleItems />
					<TagsInput.Input
						class={inputClass}
						placeholder="Type a space or paste a list…"
					/>
				</TagsInput.Control>
			</TagsInput.Root>
			<p class="text-xs text-slate-500">
				Try pasting: <code>solid kobalte tailwind</code>
			</p>
		</div>
	),
});

/** Caps the number of tags and shows how many remain. */
export const MaxTags = meta.story({
	name: "Max Tags",
	render: () => {
		const MAX = 5;
		const [value, setValue] = createSignal<string[]>(["a", "b", "c"]);

		return (
			<div class="flex w-80 flex-col gap-2 font-sans">
				<TagsInput.Root value={value()} onChange={setValue} max={MAX}>
					<TagsInput.Label class="mb-1 block text-sm font-medium text-slate-700">
						Up to {MAX} tags
					</TagsInput.Label>
					<TagsInput.Control class={controlClass}>
						<TagsExampleItems />
						<TagsInput.Input class={inputClass} placeholder="Add a tag…" />
					</TagsInput.Control>
				</TagsInput.Root>
				<p class="text-xs text-slate-500">
					{value().length} / {MAX} tags used
				</p>
			</div>
		);
	},
});

/** Rejects tags already used elsewhere on the page (case-insensitive) via `validate`. */
export const Validate = meta.story({
	name: "Validate",
	render: () => {
		const reserved = ["admin", "root"];
		const [rejected, setRejected] = createSignal<string | null>(null);

		return (
			<div class="flex w-80 flex-col gap-2 font-sans">
				<TagsInput.Root
					validate={({ value }) => {
						const ok = !reserved.includes(value.toLowerCase());
						setRejected(ok ? null : value);
						return ok;
					}}
				>
					<TagsInput.Label class="mb-1 block text-sm font-medium text-slate-700">
						Usernames
					</TagsInput.Label>
					<TagsInput.Control class={controlClass}>
						<TagsExampleItems />
						<TagsInput.Input class={inputClass} placeholder="Add a username…" />
					</TagsInput.Control>
				</TagsInput.Root>
				<p class="text-xs text-slate-500">
					Reserved: {reserved.join(", ")}
					{rejected() && (
						<span class="ml-1 text-red-600">— "{rejected()}" is reserved</span>
					)}
				</p>
			</div>
		);
	},
});

/** Existing tags can't be edited or removed, but new ones can still be added. */
export const NotEditable = meta.story({
	name: "Not Editable",
	render: () => (
		<TagsInput.Root
			defaultValue={["Solid", "Kobalte"]}
			editable={false}
			class="w-80 font-sans"
		>
			<TagsInput.Label class="mb-1 block text-sm font-medium text-slate-700">
				Tags (existing ones are locked)
			</TagsInput.Label>
			<TagsInput.Control class={controlClass}>
				<TagsExampleItems />
				<TagsInput.Input class={inputClass} placeholder="Add a tag…" />
			</TagsInput.Control>
		</TagsInput.Root>
	),
});

/** Label, description, error message, validation state, disabled, and read-only. */
export const FormControls = meta.story({
	name: "Form Controls",
	render: () => {
		const [value, setValue] = createSignal<string[]>([]);
		const isInvalid = () => value().length === 0;

		return (
			<div class="flex flex-col gap-10 font-sans">
				{/* Validation */}
				<div class="flex w-80 flex-col gap-1.5">
					<TagsInput.Root
						value={value()}
						onChange={setValue}
						required
						validationState={isInvalid() ? "invalid" : "valid"}
					>
						<TagsInput.Label class="text-sm font-medium text-slate-700">
							Skills
						</TagsInput.Label>
						<div class="mt-1">
							<TagsInput.Control class={controlClass}>
								<TagsExampleItems />
								<TagsInput.Input
									class={inputClass}
									placeholder="Add a skill…"
								/>
							</TagsInput.Control>
						</div>
						<TagsInput.Description class="mt-1 text-xs text-slate-500">
							Add at least one skill.
						</TagsInput.Description>
						<TagsInput.ErrorMessage class="mt-1 text-xs text-red-600">
							At least one skill is required.
						</TagsInput.ErrorMessage>
					</TagsInput.Root>
				</div>

				{/* Disabled */}
				<div class="flex w-80 flex-col gap-1.5">
					<TagsInput.Root defaultValue={["Solid", "Kobalte"]} disabled>
						<TagsInput.Label class="text-sm font-medium text-slate-400">
							Disabled
						</TagsInput.Label>
						<div class="mt-1">
							<TagsInput.Control class={controlClass}>
								<TagsExampleItems />
								<TagsInput.Input class={inputClass} />
							</TagsInput.Control>
						</div>
					</TagsInput.Root>
				</div>

				{/* Read-only */}
				<div class="flex w-80 flex-col gap-1.5">
					<TagsInput.Root defaultValue={["Solid", "Kobalte"]} readOnly>
						<TagsInput.Label class="text-sm font-medium text-slate-700">
							Read-only
						</TagsInput.Label>
						<div class="mt-1">
							<TagsInput.Control class={controlClass}>
								<TagsExampleItems />
								<TagsInput.Input class={inputClass} />
							</TagsInput.Control>
						</div>
						<TagsInput.Description class="mt-1 text-xs text-slate-500">
							These tags can't be added to or removed.
						</TagsInput.Description>
					</TagsInput.Root>
				</div>
			</div>
		);
	},
});
