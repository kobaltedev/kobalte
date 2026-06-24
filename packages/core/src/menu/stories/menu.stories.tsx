import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	MenuCheckboxItem as CheckboxItem,
	MenuContent as Content,
	MenuGroup as Group,
	MenuGroupLabel as GroupLabel,
	MenuItem as Item,
	MenuItemDescription as ItemDescription,
	MenuItemIndicator as ItemIndicator,
	MenuItemLabel as ItemLabel,
	MenuPortal as Portal,
	MenuRadioGroup as RadioGroup,
	MenuRadioItem as RadioItem,
	MenuRoot as Root,
	MenuSub as Sub,
	MenuSubContent as SubContent,
	MenuSubTrigger as SubTrigger,
	MenuTrigger as Trigger,
} from "../index";
import { Separator } from "../../separator";

const meta = preview.meta({
	title: "Primitives/Menu",
	tags: ["autodocs"],
});

export default meta;

const triggerClass =
	"inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

const contentClass =
	"min-w-[180px] rounded-md border border-slate-200 bg-white py-1 shadow-md outline-none z-50 font-sans text-sm";

const itemClass =
	"relative flex cursor-default select-none items-center rounded px-3 py-1.5 text-slate-700 outline-none hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const checkboxItemClass =
	"relative flex cursor-default select-none items-center pl-8 pr-3 py-1.5 text-slate-700 outline-none hover:bg-slate-100 data-[disabled]:opacity-50";

const itemIndicatorClass = "absolute left-2 flex h-4 w-4 items-center justify-center";

const labelClass = "px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400";

const separatorClass = "my-1 h-px bg-slate-200";

/**
 * Menu is the internal primitive that powers DropdownMenu, ContextMenu, and Menubar.
 * Use those higher-level components for most cases; use Menu directly only when
 * building a custom menu composition.
 */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={triggerClass}>Options ▾</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Item class={itemClass}>New file</Item>
					<Item class={itemClass}>Open file…</Item>
					<Item class={itemClass}>Save</Item>
					<Separator class={separatorClass} />
					<Item class={itemClass} disabled>
						Export (disabled)
					</Item>
					<Separator class={separatorClass} />
					<Item class={itemClass}>Close</Item>
				</Content>
			</Portal>
		</Root>
	),
});

/** Items grouped under labelled sections. */
export const WithGroups = meta.story({
	name: "With Groups",
	render: () => (
		<Root>
			<Trigger class={triggerClass}>Edit ▾</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Group>
						<GroupLabel class={labelClass}>Clipboard</GroupLabel>
						<Item class={itemClass}>Cut</Item>
						<Item class={itemClass}>Copy</Item>
						<Item class={itemClass}>Paste</Item>
					</Group>
					<Separator class={separatorClass} />
					<Group>
						<GroupLabel class={labelClass}>History</GroupLabel>
						<Item class={itemClass}>Undo</Item>
						<Item class={itemClass}>Redo</Item>
					</Group>
				</Content>
			</Portal>
		</Root>
	),
});

/** Checkbox items that retain checked state across open/close. */
function CheckboxDemo() {
	const [spell, setSpell] = createSignal(true);
	const [wrap, setWrap] = createSignal(false);

	return (
		<Root>
			<Trigger class={triggerClass}>View ▾</Trigger>
			<Portal>
				<Content class={contentClass}>
					<CheckboxItem class={checkboxItemClass} checked={spell()} onChange={setSpell}>
						<ItemIndicator class={itemIndicatorClass}>✓</ItemIndicator>
						<ItemLabel>Spell check</ItemLabel>
					</CheckboxItem>
					<CheckboxItem class={checkboxItemClass} checked={wrap()} onChange={setWrap}>
						<ItemIndicator class={itemIndicatorClass}>✓</ItemIndicator>
						<ItemLabel>Word wrap</ItemLabel>
					</CheckboxItem>
				</Content>
			</Portal>
		</Root>
	);
}

export const CheckboxItems = meta.story({
	name: "Checkbox Items",
	render: () => <CheckboxDemo />,
});

/** Radio items for mutually exclusive selection. */
function RadioDemo() {
	const [size, setSize] = createSignal("medium");

	return (
		<Root>
			<Trigger class={triggerClass}>Font: {size()} ▾</Trigger>
			<Portal>
				<Content class={contentClass}>
					<RadioGroup value={size()} onChange={setSize}>
						<GroupLabel class={labelClass}>Size</GroupLabel>
						{["small", "medium", "large"].map((s) => (
							<RadioItem class={checkboxItemClass} value={s}>
								<ItemIndicator class={itemIndicatorClass}>●</ItemIndicator>
								<ItemLabel class="capitalize">{s}</ItemLabel>
							</RadioItem>
						))}
					</RadioGroup>
				</Content>
			</Portal>
		</Root>
	);
}

export const RadioItems = meta.story({
	name: "Radio Items",
	render: () => <RadioDemo />,
});

/** A nested sub-menu opened on hover. */
export const WithSubMenu = meta.story({
	name: "With Sub-menu",
	render: () => (
		<Root>
			<Trigger class={triggerClass}>File ▾</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Item class={itemClass}>New file</Item>
					<Sub>
						<SubTrigger class={itemClass}>Open recent ▸</SubTrigger>
						<Portal>
							<SubContent class={contentClass}>
								<Item class={itemClass}>project.tsx</Item>
								<Item class={itemClass}>index.html</Item>
								<Item class={itemClass}>styles.css</Item>
							</SubContent>
						</Portal>
					</Sub>
					<Separator class={separatorClass} />
					<Item class={itemClass}>Exit</Item>
				</Content>
			</Portal>
		</Root>
	),
});

/** Items with a secondary description line. */
export const WithDescriptions = meta.story({
	name: "With Descriptions",
	render: () => (
		<Root>
			<Trigger class={triggerClass}>Actions ▾</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Item class={`${itemClass} flex-col items-start`}>
						<ItemLabel class="font-medium">Publish</ItemLabel>
						<ItemDescription class="text-xs text-slate-400">Deploy to production</ItemDescription>
					</Item>
					<Item class={`${itemClass} flex-col items-start`}>
						<ItemLabel class="font-medium">Preview</ItemLabel>
						<ItemDescription class="text-xs text-slate-400">Build a preview deployment</ItemDescription>
					</Item>
					<Separator class={separatorClass} />
					<Item class={`${itemClass} text-red-600 hover:bg-red-50`}>
						Delete project
					</Item>
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
					<Trigger class={triggerClass}>Menu ▾</Trigger>
					<Portal>
						<Content class={contentClass}>
							<Item class={itemClass}>Action A</Item>
							<Item class={itemClass}>Action B</Item>
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
