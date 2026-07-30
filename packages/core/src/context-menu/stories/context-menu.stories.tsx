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
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/ContextMenu",
	tags: ["autodocs"],
});

export default meta;

/** Right-click the shaded area to open the context menu. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root>
			<Trigger class={style["context-menu__trigger-area"]}>
				Right-click me
			</Trigger>
			<Portal>
				<Content class={style["context-menu__content"]}>
					<Item class={style["context-menu__item"]}>Back</Item>
					<Item class={style["context-menu__item"]}>Forward</Item>
					<Item class={style["context-menu__item"]}>Reload</Item>
					<Separator class={style["context-menu__separator"]} />
					<Item class={style["context-menu__item"]}>Save as…</Item>
					<Item class={style["context-menu__item"]}>Print…</Item>
					<Separator class={style["context-menu__separator"]} />
					<Item class={style["context-menu__item"]} disabled>
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
			<Trigger class={style["context-menu__trigger-area"]}>
				Right-click me
			</Trigger>
			<Portal>
				<Content class={style["context-menu__content"]}>
					<Group>
						<GroupLabel class={style["context-menu__label"]}>Text</GroupLabel>
						<Item class={style["context-menu__item"]}>Bold</Item>
						<Item class={style["context-menu__item"]}>Italic</Item>
						<Item class={style["context-menu__item"]}>Underline</Item>
					</Group>
					<Separator class={style["context-menu__separator"]} />
					<Group>
						<GroupLabel class={style["context-menu__label"]}>
							Paragraph
						</GroupLabel>
						<Item class={style["context-menu__item"]}>Align left</Item>
						<Item class={style["context-menu__item"]}>Center</Item>
						<Item class={style["context-menu__item"]}>Align right</Item>
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
			<Trigger class={style["context-menu__trigger-area"]}>
				Right-click me
			</Trigger>
			<Portal>
				<Content class={style["context-menu__content"]}>
					<GroupLabel class={style["context-menu__label"]}>View</GroupLabel>
					<CheckboxItem
						class={style["context-menu__checkbox-item"]}
						checked={rulers()}
						onChange={setRulers}
					>
						<ItemIndicator class={style["context-menu__item-indicator"]}>
							✓
						</ItemIndicator>
						<ItemLabel>Rulers</ItemLabel>
					</CheckboxItem>
					<CheckboxItem
						class={style["context-menu__checkbox-item"]}
						checked={grid()}
						onChange={setGrid}
					>
						<ItemIndicator class={style["context-menu__item-indicator"]}>
							✓
						</ItemIndicator>
						<ItemLabel>Grid</ItemLabel>
					</CheckboxItem>
					<CheckboxItem
						class={style["context-menu__checkbox-item"]}
						checked={snap()}
						onChange={setSnap}
					>
						<ItemIndicator class={style["context-menu__item-indicator"]}>
							✓
						</ItemIndicator>
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
			<Trigger class={style["context-menu__trigger-area"]}>
				Right-click me
			</Trigger>
			<Portal>
				<Content class={style["context-menu__content"]}>
					<RadioGroup value={zoom()} onChange={setZoom}>
						<GroupLabel class={style["context-menu__label"]}>Zoom</GroupLabel>
						{["50%", "75%", "100%", "125%", "150%"].map((z) => (
							<RadioItem class={style["context-menu__checkbox-item"]} value={z}>
								<ItemIndicator class={style["context-menu__item-indicator"]}>
									●
								</ItemIndicator>
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
			<Trigger class={style["context-menu__trigger-area"]}>
				Right-click me
			</Trigger>
			<Portal>
				<Content class={style["context-menu__content"]}>
					<Item class={style["context-menu__item"]}>Cut</Item>
					<Item class={style["context-menu__item"]}>Copy</Item>
					<Item class={style["context-menu__item"]}>Paste</Item>
					<Separator class={style["context-menu__separator"]} />
					<Sub>
						<SubTrigger class={style["context-menu__item"]}>Share ▸</SubTrigger>
						<Portal>
							<SubContent class={style["context-menu__content"]}>
								<Item class={style["context-menu__item"]}>Email link</Item>
								<Item class={style["context-menu__item"]}>Copy link</Item>
								<Item class={style["context-menu__item"]}>Twitter</Item>
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
		<div class={style["context-menu__wrapper"]}>
			<Root onOpenChange={setOpen}>
				<Trigger class={style["context-menu__trigger-area"]}>
					Right-click me
				</Trigger>
				<Portal>
					<Content class={style["context-menu__content"]}>
						<Item class={style["context-menu__item"]}>Action A</Item>
						<Item class={style["context-menu__item"]}>Action B</Item>
					</Content>
				</Portal>
			</Root>
			<span class={style["context-menu__state"]}>
				Menu state: <strong>{open() ? "open" : "closed"}</strong>
			</span>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
