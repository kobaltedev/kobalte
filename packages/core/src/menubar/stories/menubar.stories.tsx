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
} from "../index";

const meta = preview.meta({
	title: "Components/Menubar",
	tags: ["autodocs"],
});

export default meta;

const rootClass =
	"flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1 py-1 shadow-sm font-sans";

const triggerClass =
	"rounded px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[expanded]:bg-slate-100 data-[expanded]:text-slate-900";

const contentClass =
	"min-w-[180px] rounded-md border border-slate-200 bg-white py-1 shadow-md outline-none z-50 text-sm";

const itemClass =
	"relative flex cursor-default select-none items-center rounded px-3 py-1.5 text-slate-700 outline-none hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const checkboxItemClass =
	"relative flex cursor-default select-none items-center pl-8 pr-3 py-1.5 text-slate-700 outline-none hover:bg-slate-100 data-[disabled]:opacity-50";

const itemIndicatorClass = "absolute left-2 flex h-4 w-4 items-center justify-center";

const labelClass = "px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400";

const separatorClass = "my-1 h-px bg-slate-200";

/** Desktop-style menubar with File, Edit, and View menus. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={rootClass}>
			<Menu>
				<Trigger class={triggerClass}>File</Trigger>
				<Portal>
					<Content class={contentClass}>
						<Item class={itemClass}>New file</Item>
						<Item class={itemClass}>Open…</Item>
						<Item class={itemClass}>Save</Item>
						<Separator class={separatorClass} />
						<Item class={itemClass} disabled>
							Export (disabled)
						</Item>
						<Separator class={separatorClass} />
						<Item class={itemClass}>Exit</Item>
					</Content>
				</Portal>
			</Menu>
			<Menu>
				<Trigger class={triggerClass}>Edit</Trigger>
				<Portal>
					<Content class={contentClass}>
						<Item class={itemClass}>Undo</Item>
						<Item class={itemClass}>Redo</Item>
						<Separator class={separatorClass} />
						<Item class={itemClass}>Cut</Item>
						<Item class={itemClass}>Copy</Item>
						<Item class={itemClass}>Paste</Item>
					</Content>
				</Portal>
			</Menu>
			<Menu>
				<Trigger class={triggerClass}>View</Trigger>
				<Portal>
					<Content class={contentClass}>
						<Item class={itemClass}>Zoom in</Item>
						<Item class={itemClass}>Zoom out</Item>
						<Separator class={separatorClass} />
						<Item class={itemClass}>Full screen</Item>
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
		<Root class={rootClass}>
			<Menu>
				<Trigger class={triggerClass}>Edit</Trigger>
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
		<Root class={rootClass}>
			<Menu>
				<Trigger class={triggerClass}>View</Trigger>
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
						<CheckboxItem class={checkboxItemClass} checked={lineNum()} onChange={setLineNum}>
							<ItemIndicator class={itemIndicatorClass}>✓</ItemIndicator>
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
		<Root class={rootClass}>
			<Menu>
				<Trigger class={triggerClass}>Appearance</Trigger>
				<Portal>
					<Content class={contentClass}>
						<RadioGroup value={theme()} onChange={setTheme}>
							<GroupLabel class={labelClass}>Theme</GroupLabel>
							{["light", "dark", "system"].map((t) => (
								<RadioItem class={checkboxItemClass} value={t}>
									<ItemIndicator class={itemIndicatorClass}>●</ItemIndicator>
									<ItemLabel class="capitalize">{t}</ItemLabel>
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
		<Root class={rootClass}>
			<Menu>
				<Trigger class={triggerClass}>File</Trigger>
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
			</Menu>
		</Root>
	),
});

/** Items with a secondary description line. */
export const WithDescriptions = meta.story({
	name: "With Descriptions",
	render: () => (
		<Root class={rootClass}>
			<Menu>
				<Trigger class={triggerClass}>Deploy</Trigger>
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
			<Root class={rootClass}>
				<Menu>
					<Trigger class={triggerClass}>File</Trigger>
					<Portal>
						<Content class={contentClass}>
							<Item class={itemClass}>New file</Item>
							<Item class={itemClass}>Open…</Item>
							<Item class={itemClass}>Save</Item>
							<Item class={itemClass}>Save as…</Item>
							<Separator class={separatorClass} />
							<Item class={itemClass}>Close tab</Item>
						</Content>
					</Portal>
				</Menu>
				<Menu>
					<Trigger class={triggerClass}>Edit</Trigger>
					<Portal>
						<Content class={contentClass}>
							<Item class={itemClass}>Undo</Item>
							<Item class={itemClass}>Redo</Item>
							<Separator class={separatorClass} />
							<Group>
								<GroupLabel class={labelClass}>Clipboard</GroupLabel>
								<Item class={itemClass}>Cut</Item>
								<Item class={itemClass}>Copy</Item>
								<Item class={itemClass}>Paste</Item>
							</Group>
						</Content>
					</Portal>
				</Menu>
				<Menu>
					<Trigger class={triggerClass}>View</Trigger>
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
							<Separator class={separatorClass} />
							<RadioGroup value={theme()} onChange={setTheme}>
								<GroupLabel class={labelClass}>Theme</GroupLabel>
								{["light", "dark", "system"].map((t) => (
									<RadioItem class={checkboxItemClass} value={t}>
										<ItemIndicator class={itemIndicatorClass}>●</ItemIndicator>
										<ItemLabel class="capitalize">{t}</ItemLabel>
									</RadioItem>
								))}
							</RadioGroup>
						</Content>
					</Portal>
				</Menu>
				<Menu>
					<Trigger class={triggerClass}>Help</Trigger>
					<Portal>
						<Content class={contentClass}>
							<Item class={itemClass}>Documentation</Item>
							<Item class={itemClass}>Keyboard shortcuts</Item>
							<Separator class={separatorClass} />
							<Item class={itemClass}>About</Item>
						</Content>
					</Portal>
				</Menu>
			</Root>
		);
	},
});
