import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Separator } from "../../separator/index.tsx";
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
} from "../index.ts";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Primitives/Menu",
	tags: ["autodocs"],
});

export default meta;

/**
 * Menu is the internal primitive that powers DropdownMenu, ContextMenu, and Menubar.
 * Use those higher-level components for most cases; use Menu directly only when
 * building a custom menu composition.
 */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={style.menu__trigger}>Options ▾</Trigger>
			<Portal>
				<Content class={style.menu__content}>
					<Item class={style.menu__item}>New file</Item>
					<Item class={style.menu__item}>Open file…</Item>
					<Item class={style.menu__item}>Save</Item>
					<Separator class={style.menu__separator} />
					<Item class={style.menu__item} disabled>
						Export (disabled)
					</Item>
					<Separator class={style.menu__separator} />
					<Item class={style.menu__item}>Close</Item>
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
			<Trigger class={style.menu__trigger}>Edit ▾</Trigger>
			<Portal>
				<Content class={style.menu__content}>
					<Group>
						<GroupLabel class={style.menu__label}>Clipboard</GroupLabel>
						<Item class={style.menu__item}>Cut</Item>
						<Item class={style.menu__item}>Copy</Item>
						<Item class={style.menu__item}>Paste</Item>
					</Group>
					<Separator class={style.menu__separator} />
					<Group>
						<GroupLabel class={style.menu__label}>History</GroupLabel>
						<Item class={style.menu__item}>Undo</Item>
						<Item class={style.menu__item}>Redo</Item>
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
			<Trigger class={style.menu__trigger}>View ▾</Trigger>
			<Portal>
				<Content class={style.menu__content}>
					<CheckboxItem
						class={style["menu__checkbox-item"]}
						checked={spell()}
						onChange={setSpell}
					>
						<ItemIndicator class={style["menu__item-indicator"]}>
							✓
						</ItemIndicator>
						<ItemLabel>Spell check</ItemLabel>
					</CheckboxItem>
					<CheckboxItem
						class={style["menu__checkbox-item"]}
						checked={wrap()}
						onChange={setWrap}
					>
						<ItemIndicator class={style["menu__item-indicator"]}>
							✓
						</ItemIndicator>
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
			<Trigger class={style.menu__trigger}>Font: {size()} ▾</Trigger>
			<Portal>
				<Content class={style.menu__content}>
					<RadioGroup value={size()} onChange={setSize}>
						<GroupLabel class={style.menu__label}>Size</GroupLabel>
						{["small", "medium", "large"].map((s) => (
							<RadioItem class={style["menu__checkbox-item"]} value={s}>
								<ItemIndicator class={style["menu__item-indicator"]}>
									●
								</ItemIndicator>
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
			<Trigger class={style.menu__trigger}>File ▾</Trigger>
			<Portal>
				<Content class={style.menu__content}>
					<Item class={style.menu__item}>New file</Item>
					<Sub>
						<SubTrigger class={style.menu__item}>Open recent ▸</SubTrigger>
						<Portal>
							<SubContent class={style.menu__content}>
								<Item class={style.menu__item}>project.tsx</Item>
								<Item class={style.menu__item}>index.html</Item>
								<Item class={style.menu__item}>styles.css</Item>
							</SubContent>
						</Portal>
					</Sub>
					<Separator class={style.menu__separator} />
					<Item class={style.menu__item}>Exit</Item>
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
			<Trigger class={style.menu__trigger}>Actions ▾</Trigger>
			<Portal>
				<Content class={style.menu__content}>
					<Item class={[style.menu__item, style["menu__item--flex-col"]]}>
						<ItemLabel class={style["menu__item-label"]}>Publish</ItemLabel>
						<ItemDescription class={style["menu__item-description"]}>
							Deploy to production
						</ItemDescription>
					</Item>
					<Item class={[style.menu__item, style["menu__item--flex-col"]]}>
						<ItemLabel class={style["menu__item-label"]}>Preview</ItemLabel>
						<ItemDescription class={style["menu__item-description"]}>
							Build a preview deployment
						</ItemDescription>
					</Item>
					<Separator class={style.menu__separator} />
					<Item class={[style.menu__item, style["menu__item--destructive"]]}>
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
		<div class={style.menu__wrapper}>
			<div class={style.menu__row}>
				<Root open={open()} onOpenChange={setOpen}>
					<Trigger class={style.menu__trigger}>Menu ▾</Trigger>
					<Portal>
						<Content class={style.menu__content}>
							<Item class={style.menu__item}>Action A</Item>
							<Item class={style.menu__item}>Action B</Item>
						</Content>
					</Portal>
				</Root>
				<button
					type="button"
					class={style.menu__trigger}
					onClick={() => setOpen((o) => !o)}
				>
					{open() ? "Force close" : "Force open"}
				</button>
			</div>
			<p class={style.menu__state}>
				State: <strong>{open() ? "open" : "closed"}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
