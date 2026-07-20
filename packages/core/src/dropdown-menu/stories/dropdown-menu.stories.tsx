import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	CheckboxItem,
	Content,
	Group,
	GroupLabel,
	Item,
	ItemDescription,
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
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/DropdownMenu",
	tags: ["autodocs"],
});

export default meta;

/** Basic dropdown with a list of items. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={style["dropdown-menu__trigger"]}>Options ▾</Trigger>
			<Portal>
				<Content class={style["dropdown-menu__content"]}>
					<Item class={style["dropdown-menu__item"]}>New file</Item>
					<Item class={style["dropdown-menu__item"]}>Open file…</Item>
					<Item class={style["dropdown-menu__item"]}>Save</Item>
					<Separator class={style["dropdown-menu__separator"]} />
					<Item class={style["dropdown-menu__item"]} disabled>
						Export (disabled)
					</Item>
					<Separator class={style["dropdown-menu__separator"]} />
					<Item class={style["dropdown-menu__item"]}>Close</Item>
				</Content>
			</Portal>
		</Root>
	),
});

/** Items grouped under a labelled section. */
export const WithGroups = meta.story({
	name: "With Groups",
	render: () => (
		<Root>
			<Trigger class={style["dropdown-menu__trigger"]}>Edit ▾</Trigger>
			<Portal>
				<Content class={style["dropdown-menu__content"]}>
					<Group>
						<GroupLabel class={style["dropdown-menu__label"]}>
							Clipboard
						</GroupLabel>
						<Item class={style["dropdown-menu__item"]}>Cut</Item>
						<Item class={style["dropdown-menu__item"]}>Copy</Item>
						<Item class={style["dropdown-menu__item"]}>Paste</Item>
					</Group>
					<Separator class={style["dropdown-menu__separator"]} />
					<Group>
						<GroupLabel class={style["dropdown-menu__label"]}>
							History
						</GroupLabel>
						<Item class={style["dropdown-menu__item"]}>Undo</Item>
						<Item class={style["dropdown-menu__item"]}>Redo</Item>
					</Group>
				</Content>
			</Portal>
		</Root>
	),
});

/** Checkbox items that retain checked state. */
function CheckboxDemo() {
	const [spell, setSpell] = createSignal(true);
	const [wrap, setWrap] = createSignal(false);
	const [lineNum, setLineNum] = createSignal(true);

	return (
		<Root>
			<Trigger class={style["dropdown-menu__trigger"]}>View ▾</Trigger>
			<Portal>
				<Content class={style["dropdown-menu__content"]}>
					<CheckboxItem
						class={style["dropdown-menu__checkbox-item"]}
						checked={spell()}
						onChange={setSpell}
					>
						<ItemIndicator class={style["dropdown-menu__item-indicator"]}>
							✓
						</ItemIndicator>
						<ItemLabel>Spell check</ItemLabel>
					</CheckboxItem>
					<CheckboxItem
						class={style["dropdown-menu__checkbox-item"]}
						checked={wrap()}
						onChange={setWrap}
					>
						<ItemIndicator class={style["dropdown-menu__item-indicator"]}>
							✓
						</ItemIndicator>
						<ItemLabel>Word wrap</ItemLabel>
					</CheckboxItem>
					<CheckboxItem
						class={style["dropdown-menu__checkbox-item"]}
						checked={lineNum()}
						onChange={setLineNum}
					>
						<ItemIndicator class={style["dropdown-menu__item-indicator"]}>
							✓
						</ItemIndicator>
						<ItemLabel>Line numbers</ItemLabel>
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

/** Radio items for exclusive selection. */
function RadioDemo() {
	const [size, setSize] = createSignal("medium");

	return (
		<Root>
			<Trigger class={style["dropdown-menu__trigger"]}>
				Font size: {size()} ▾
			</Trigger>
			<Portal>
				<Content class={style["dropdown-menu__content"]}>
					<RadioGroup value={size()} onChange={setSize}>
						<GroupLabel class={style["dropdown-menu__label"]}>Size</GroupLabel>
						{["small", "medium", "large", "xlarge"].map((s) => (
							<RadioItem
								class={style["dropdown-menu__checkbox-item"]}
								value={s}
							>
								<ItemIndicator class={style["dropdown-menu__item-indicator"]}>
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

/** A nested sub-menu triggered on hover. */
export const WithSubMenu = meta.story({
	name: "With Sub-menu",
	render: () => (
		<Root>
			<Trigger class={style["dropdown-menu__trigger"]}>File ▾</Trigger>
			<Portal>
				<Content class={style["dropdown-menu__content"]}>
					<Item class={style["dropdown-menu__item"]}>New file</Item>
					<Sub>
						<SubTrigger class={style["dropdown-menu__item"]}>
							Open recent ▸
						</SubTrigger>
						<Portal>
							<SubContent class={style["dropdown-menu__content"]}>
								<Item class={style["dropdown-menu__item"]}>project.tsx</Item>
								<Item class={style["dropdown-menu__item"]}>index.html</Item>
								<Item class={style["dropdown-menu__item"]}>styles.css</Item>
							</SubContent>
						</Portal>
					</Sub>
					<Separator class={style["dropdown-menu__separator"]} />
					<Item class={style["dropdown-menu__item"]}>Exit</Item>
				</Content>
			</Portal>
		</Root>
	),
});

/** Items with descriptive text below the label. */
export const WithDescriptions = meta.story({
	name: "With Descriptions",
	render: () => (
		<Root>
			<Trigger class={style["dropdown-menu__trigger"]}>Actions ▾</Trigger>
			<Portal>
				<Content class={style["dropdown-menu__content"]}>
					<Item
						class={`${style["dropdown-menu__item"]} ${style["dropdown-menu__item--flex-col"]}`}
					>
						<ItemLabel class={style["dropdown-menu__item-label"]}>
							Publish
						</ItemLabel>
						<ItemDescription class={style["dropdown-menu__item-description"]}>
							Deploy to production
						</ItemDescription>
					</Item>
					<Item
						class={`${style["dropdown-menu__item"]} ${style["dropdown-menu__item--flex-col"]}`}
					>
						<ItemLabel class={style["dropdown-menu__item-label"]}>
							Preview
						</ItemLabel>
						<ItemDescription class={style["dropdown-menu__item-description"]}>
							Build a preview deployment
						</ItemDescription>
					</Item>
					<Separator class={style["dropdown-menu__separator"]} />
					<Item
						class={`${style["dropdown-menu__item"]} ${style["dropdown-menu__item--destructive"]}`}
					>
						<ItemLabel>Delete project</ItemLabel>
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
		<div class={style["dropdown-menu__wrapper"]}>
			<div class={style["dropdown-menu__row"]}>
				<Root open={open()} onOpenChange={setOpen}>
					<Trigger class={style["dropdown-menu__trigger"]}>Menu ▾</Trigger>
					<Portal>
						<Content class={style["dropdown-menu__content"]}>
							<Item class={style["dropdown-menu__item"]}>Action A</Item>
							<Item class={style["dropdown-menu__item"]}>Action B</Item>
						</Content>
					</Portal>
				</Root>
				<button
					type="button"
					class={style["dropdown-menu__trigger"]}
					onClick={() => setOpen((o) => !o)}
				>
					{open() ? "Force close" : "Force open"}
				</button>
			</div>
			<p class={style["dropdown-menu__state"]}>
				State: <strong>{open() ? "open" : "closed"}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
