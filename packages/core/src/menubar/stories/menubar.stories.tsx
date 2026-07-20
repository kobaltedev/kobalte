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
	Menu,
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
	title: "Components/Menubar",
	tags: ["autodocs"],
});

export default meta;

/** Desktop-style menubar with File, Edit, and View menus. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.menubar__root}>
			<Menu>
				<Trigger class={style.menubar__trigger}>File</Trigger>
				<Portal>
					<Content class={style.menubar__content}>
						<Item class={style.menubar__item}>New file</Item>
						<Item class={style.menubar__item}>Open…</Item>
						<Item class={style.menubar__item}>Save</Item>
						<Separator class={style.menubar__separator} />
						<Item class={style.menubar__item} disabled>
							Export (disabled)
						</Item>
						<Separator class={style.menubar__separator} />
						<Item class={style.menubar__item}>Exit</Item>
					</Content>
				</Portal>
			</Menu>
			<Menu>
				<Trigger class={style.menubar__trigger}>Edit</Trigger>
				<Portal>
					<Content class={style.menubar__content}>
						<Item class={style.menubar__item}>Undo</Item>
						<Item class={style.menubar__item}>Redo</Item>
						<Separator class={style.menubar__separator} />
						<Item class={style.menubar__item}>Cut</Item>
						<Item class={style.menubar__item}>Copy</Item>
						<Item class={style.menubar__item}>Paste</Item>
					</Content>
				</Portal>
			</Menu>
			<Menu>
				<Trigger class={style.menubar__trigger}>View</Trigger>
				<Portal>
					<Content class={style.menubar__content}>
						<Item class={style.menubar__item}>Zoom in</Item>
						<Item class={style.menubar__item}>Zoom out</Item>
						<Separator class={style.menubar__separator} />
						<Item class={style.menubar__item}>Full screen</Item>
					</Content>
				</Portal>
			</Menu>
		</Root>
	),
});

/** Grouped items separated by labels. */
export const WithGroups = meta.story({
	name: "With Groups",
	render: () => (
		<Root class={style.menubar__root}>
			<Menu>
				<Trigger class={style.menubar__trigger}>Edit</Trigger>
				<Portal>
					<Content class={style.menubar__content}>
						<Group>
							<GroupLabel class={style.menubar__label}>Clipboard</GroupLabel>
							<Item class={style.menubar__item}>Cut</Item>
							<Item class={style.menubar__item}>Copy</Item>
							<Item class={style.menubar__item}>Paste</Item>
						</Group>
						<Separator class={style.menubar__separator} />
						<Group>
							<GroupLabel class={style.menubar__label}>History</GroupLabel>
							<Item class={style.menubar__item}>Undo</Item>
							<Item class={style.menubar__item}>Redo</Item>
						</Group>
					</Content>
				</Portal>
			</Menu>
		</Root>
	),
});

/** Checkbox items retain their checked state across menu open/close cycles. */
function CheckboxDemo() {
	const [spell, setSpell] = createSignal(true);
	const [wrap, setWrap] = createSignal(false);
	const [lineNum, setLineNum] = createSignal(true);

	return (
		<Root class={style.menubar__root}>
			<Menu>
				<Trigger class={style.menubar__trigger}>View</Trigger>
				<Portal>
					<Content class={style.menubar__content}>
						<CheckboxItem
							class={style.menubar__checkboxItem}
							checked={spell()}
							onChange={setSpell}
						>
							<ItemIndicator class={style.menubar__itemIndicator}>
								✓
							</ItemIndicator>
							<ItemLabel>Spell check</ItemLabel>
						</CheckboxItem>
						<CheckboxItem
							class={style.menubar__checkboxItem}
							checked={wrap()}
							onChange={setWrap}
						>
							<ItemIndicator class={style.menubar__itemIndicator}>
								✓
							</ItemIndicator>
							<ItemLabel>Word wrap</ItemLabel>
						</CheckboxItem>
						<CheckboxItem
							class={style.menubar__checkboxItem}
							checked={lineNum()}
							onChange={setLineNum}
						>
							<ItemIndicator class={style.menubar__itemIndicator}>
								✓
							</ItemIndicator>
							<ItemLabel>Line numbers</ItemLabel>
						</CheckboxItem>
					</Content>
				</Portal>
			</Menu>
		</Root>
	);
}

export const CheckboxItems = meta.story({
	name: "Checkbox Items",
	render: () => <CheckboxDemo />,
});

/** Radio items for mutually exclusive selection within a menu. */
function RadioDemo() {
	const [theme, setTheme] = createSignal("system");

	return (
		<Root class={style.menubar__root}>
			<Menu>
				<Trigger class={style.menubar__trigger}>Appearance</Trigger>
				<Portal>
					<Content class={style.menubar__content}>
						<RadioGroup value={theme()} onChange={setTheme}>
							<GroupLabel class={style.menubar__label}>Theme</GroupLabel>
							{["light", "dark", "system"].map((t) => (
								<RadioItem class={style.menubar__checkboxItem} value={t}>
									<ItemIndicator class={style.menubar__itemIndicator}>
										●
									</ItemIndicator>
									<ItemLabel class={style.menubar__capitalize}>{t}</ItemLabel>
								</RadioItem>
							))}
						</RadioGroup>
					</Content>
				</Portal>
			</Menu>
		</Root>
	);
}

export const RadioItems = meta.story({
	name: "Radio Items",
	render: () => <RadioDemo />,
});

/** A nested sub-menu triggered on hover inside a menubar menu. */
export const WithSubMenu = meta.story({
	name: "With Sub-menu",
	render: () => (
		<Root class={style.menubar__root}>
			<Menu>
				<Trigger class={style.menubar__trigger}>File</Trigger>
				<Portal>
					<Content class={style.menubar__content}>
						<Item class={style.menubar__item}>New file</Item>
						<Sub>
							<SubTrigger class={style.menubar__item}>Open recent ▸</SubTrigger>
							<Portal>
								<SubContent class={style.menubar__content}>
									<Item class={style.menubar__item}>project.tsx</Item>
									<Item class={style.menubar__item}>index.html</Item>
									<Item class={style.menubar__item}>styles.css</Item>
								</SubContent>
							</Portal>
						</Sub>
						<Separator class={style.menubar__separator} />
						<Item class={style.menubar__item}>Exit</Item>
					</Content>
				</Portal>
			</Menu>
		</Root>
	),
});

/** Items with a secondary description line. */
export const WithDescriptions = meta.story({
	name: "With Descriptions",
	render: () => (
		<Root class={style.menubar__root}>
			<Menu>
				<Trigger class={style.menubar__trigger}>Deploy</Trigger>
				<Portal>
					<Content class={style.menubar__content}>
						<Item
							class={`${style.menubar__item} ${style["menubar__item--flex-col"]}`}
						>
							<ItemLabel class={style.menubar__itemLabel}>Publish</ItemLabel>
							<ItemDescription class={style.menubar__itemDescription}>
								Deploy to production
							</ItemDescription>
						</Item>
						<Item
							class={`${style.menubar__item} ${style["menubar__item--flex-col"]}`}
						>
							<ItemLabel class={style.menubar__itemLabel}>Preview</ItemLabel>
							<ItemDescription class={style.menubar__itemDescription}>
								Build a preview deployment
							</ItemDescription>
						</Item>
						<Separator class={style.menubar__separator} />
						<Item
							class={`${style.menubar__item} ${style["menubar__item--destructive"]}`}
						>
							<ItemLabel>Delete project</ItemLabel>
						</Item>
					</Content>
				</Portal>
			</Menu>
		</Root>
	),
});

/** Full application-style menubar with File, Edit, View, and Help menus. */
export const FullExample = meta.story({
	name: "Full Example",
	render: () => {
		const [spell, setSpell] = createSignal(true);
		const [wrap, setWrap] = createSignal(false);
		const [theme, setTheme] = createSignal("system");

		return (
			<Root class={style.menubar__root}>
				<Menu>
					<Trigger class={style.menubar__trigger}>File</Trigger>
					<Portal>
						<Content class={style.menubar__content}>
							<Item class={style.menubar__item}>New file</Item>
							<Item class={style.menubar__item}>Open…</Item>
							<Item class={style.menubar__item}>Save</Item>
							<Item class={style.menubar__item}>Save as…</Item>
							<Separator class={style.menubar__separator} />
							<Item class={style.menubar__item}>Close tab</Item>
						</Content>
					</Portal>
				</Menu>
				<Menu>
					<Trigger class={style.menubar__trigger}>Edit</Trigger>
					<Portal>
						<Content class={style.menubar__content}>
							<Item class={style.menubar__item}>Undo</Item>
							<Item class={style.menubar__item}>Redo</Item>
							<Separator class={style.menubar__separator} />
							<Group>
								<GroupLabel class={style.menubar__label}>Clipboard</GroupLabel>
								<Item class={style.menubar__item}>Cut</Item>
								<Item class={style.menubar__item}>Copy</Item>
								<Item class={style.menubar__item}>Paste</Item>
							</Group>
						</Content>
					</Portal>
				</Menu>
				<Menu>
					<Trigger class={style.menubar__trigger}>View</Trigger>
					<Portal>
						<Content class={style.menubar__content}>
							<CheckboxItem
								class={style.menubar__checkboxItem}
								checked={spell()}
								onChange={setSpell}
							>
								<ItemIndicator class={style.menubar__itemIndicator}>
									✓
								</ItemIndicator>
								<ItemLabel>Spell check</ItemLabel>
							</CheckboxItem>
							<CheckboxItem
								class={style.menubar__checkboxItem}
								checked={wrap()}
								onChange={setWrap}
							>
								<ItemIndicator class={style.menubar__itemIndicator}>
									✓
								</ItemIndicator>
								<ItemLabel>Word wrap</ItemLabel>
							</CheckboxItem>
							<Separator class={style.menubar__separator} />
							<RadioGroup value={theme()} onChange={setTheme}>
								<GroupLabel class={style.menubar__label}>Theme</GroupLabel>
								{["light", "dark", "system"].map((t) => (
									<RadioItem class={style.menubar__checkboxItem} value={t}>
										<ItemIndicator class={style.menubar__itemIndicator}>
											●
										</ItemIndicator>
										<ItemLabel class={style.menubar__capitalize}>{t}</ItemLabel>
									</RadioItem>
								))}
							</RadioGroup>
						</Content>
					</Portal>
				</Menu>
				<Menu>
					<Trigger class={style.menubar__trigger}>Help</Trigger>
					<Portal>
						<Content class={style.menubar__content}>
							<Item class={style.menubar__item}>Documentation</Item>
							<Item class={style.menubar__item}>Keyboard shortcuts</Item>
							<Separator class={style.menubar__separator} />
							<Item class={style.menubar__item}>About</Item>
						</Content>
					</Portal>
				</Menu>
			</Root>
		);
	},
});
