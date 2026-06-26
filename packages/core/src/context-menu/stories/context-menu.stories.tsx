import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	CheckboxItem,
	Content,
	Group,
	GroupLabel,
	Item,
	ItemIndicator,
	ItemLabel,
	Portal,
	RadioGroup,
	RadioItem,
	Root,
	Separator,
	Sub,
	SubContent,
	SubTrigger,
	Trigger,
} from "../index";

const meta = preview.meta({
	title: "Components/ContextMenu",
	tags: ["autodocs"],
});

export default meta;

const contentClass =
	"min-w-[180px] rounded-md border border-slate-200 bg-white py-1 shadow-md outline-none z-50 font-sans text-sm";

const itemClass =
	"relative flex cursor-default select-none items-center rounded px-3 py-1.5 text-slate-700 outline-none hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const labelClass =
	"px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400";

const separatorClass = "my-1 h-px bg-slate-200";

const checkboxItemClass =
	"relative flex cursor-default select-none items-center pl-8 pr-3 py-1.5 text-slate-700 outline-none hover:bg-slate-100";

const itemIndicatorClass =
	"absolute left-2 flex h-4 w-4 items-center justify-center";

const triggerAreaClass =
	"flex h-32 w-64 select-none items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400 font-sans";

/** Right-click the shaded area to open the context menu. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={triggerAreaClass}>Right-click me</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Item class={itemClass}>Back</Item>
					<Item class={itemClass}>Forward</Item>
					<Item class={itemClass}>Reload</Item>
					<Separator class={separatorClass} />
					<Item class={itemClass}>Save as…</Item>
					<Item class={itemClass}>Print…</Item>
					<Separator class={separatorClass} />
					<Item class={itemClass} disabled>
						View source (disabled)
					</Item>
				</Content>
			</Portal>
		</Root>
	),
});

/** Groups organise related items under a label. */
export const WithGroups = meta.story({
	name: "With Groups",
	render: () => (
		<Root>
			<Trigger class={triggerAreaClass}>Right-click me</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Group>
						<GroupLabel class={labelClass}>Text</GroupLabel>
						<Item class={itemClass}>Bold</Item>
						<Item class={itemClass}>Italic</Item>
						<Item class={itemClass}>Underline</Item>
					</Group>
					<Separator class={separatorClass} />
					<Group>
						<GroupLabel class={labelClass}>Paragraph</GroupLabel>
						<Item class={itemClass}>Align left</Item>
						<Item class={itemClass}>Center</Item>
						<Item class={itemClass}>Align right</Item>
					</Group>
				</Content>
			</Portal>
		</Root>
	),
});

/** Checkbox items that toggle independently. */
function CheckboxDemo() {
	const [rulers, setRulers] = createSignal(false);
	const [grid, setGrid] = createSignal(true);
	const [snap, setSnap] = createSignal(true);

	return (
		<Root>
			<Trigger class={triggerAreaClass}>Right-click me</Trigger>
			<Portal>
				<Content class={contentClass}>
					<GroupLabel class={labelClass}>View</GroupLabel>
					<CheckboxItem
						class={checkboxItemClass}
						checked={rulers()}
						onChange={setRulers}
					>
						<ItemIndicator class={itemIndicatorClass}>✓</ItemIndicator>
						<ItemLabel>Rulers</ItemLabel>
					</CheckboxItem>
					<CheckboxItem
						class={checkboxItemClass}
						checked={grid()}
						onChange={setGrid}
					>
						<ItemIndicator class={itemIndicatorClass}>✓</ItemIndicator>
						<ItemLabel>Grid</ItemLabel>
					</CheckboxItem>
					<CheckboxItem
						class={checkboxItemClass}
						checked={snap()}
						onChange={setSnap}
					>
						<ItemIndicator class={itemIndicatorClass}>✓</ItemIndicator>
						<ItemLabel>Snap to grid</ItemLabel>
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

/** Radio group for exclusive selection. */
function RadioDemo() {
	const [zoom, setZoom] = createSignal("100%");

	return (
		<Root>
			<Trigger class={triggerAreaClass}>Right-click me</Trigger>
			<Portal>
				<Content class={contentClass}>
					<RadioGroup value={zoom()} onChange={setZoom}>
						<GroupLabel class={labelClass}>Zoom</GroupLabel>
						{["50%", "75%", "100%", "125%", "150%"].map((z) => (
							<RadioItem class={checkboxItemClass} value={z}>
								<ItemIndicator class={itemIndicatorClass}>●</ItemIndicator>
								<ItemLabel>{z}</ItemLabel>
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

/** Sub-menu that opens on hover from a parent item. */
export const WithSubMenu = meta.story({
	name: "With Sub-menu",
	render: () => (
		<Root>
			<Trigger class={triggerAreaClass}>Right-click me</Trigger>
			<Portal>
				<Content class={contentClass}>
					<Item class={itemClass}>Cut</Item>
					<Item class={itemClass}>Copy</Item>
					<Item class={itemClass}>Paste</Item>
					<Separator class={separatorClass} />
					<Sub>
						<SubTrigger class={itemClass}>Share ▸</SubTrigger>
						<Portal>
							<SubContent class={contentClass}>
								<Item class={itemClass}>Email link</Item>
								<Item class={itemClass}>Copy link</Item>
								<Item class={itemClass}>Twitter</Item>
							</SubContent>
						</Portal>
					</Sub>
				</Content>
			</Portal>
		</Root>
	),
});

/** Observing open state changes via `onOpenChange`. */
function ControlledDemo() {
	const [open, setOpen] = createSignal(false);

	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root onOpenChange={setOpen}>
				<Trigger class={triggerAreaClass}>Right-click me</Trigger>
				<Portal>
					<Content class={contentClass}>
						<Item class={itemClass}>Action A</Item>
						<Item class={itemClass}>Action B</Item>
					</Content>
				</Portal>
			</Root>
			<span class="text-xs text-slate-500">
				Menu state: <strong>{open() ? "open" : "closed"}</strong>
			</span>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
