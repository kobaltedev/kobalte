import {
	type ConfigColorMode,
	type MaybeConfigColorMode,
	useColorMode,
} from "@kobalte/core/color-mode";
import { Select } from "@kobalte/core/select";
import { type JSX, createSignal, onMount } from "solid-js";

import { DesktopIcon, MoonIcon, SunIcon } from "./icons";

interface ThemeOption {
	value: ConfigColorMode;
	label: string;
	icon: (clazz: string) => JSX.Element;
}

const THEME_OPTIONS: ThemeOption[] = [
	{
		value: "light",
		label: "Light",
		icon: (clazz: string) => <SunIcon class={clazz} />,
	},
	{
		value: "dark",
		label: "Dark",
		icon: (clazz: string) => <MoonIcon class={clazz} />,
	},
	{
		value: "system",
		label: "System",
		icon: (clazz: string) => <DesktopIcon class={clazz} />,
	},
];

function parseCookie(): MaybeConfigColorMode {
	const match = document.cookie.match(/(^| )kb-color-mode=([^;]+)/);
	return match?.[2] as MaybeConfigColorMode;
}

export function ThemeSelector() {
	const { colorMode, setColorMode } = useColorMode();
	const [selectedTheme, setSelectedTheme] = createSignal<ThemeOption>();

	onMount(() => {
		setSelectedTheme(
			THEME_OPTIONS.find((option) => option.value === parseCookie()),
		);
	});

	return (
		<Select<ThemeOption>
			options={THEME_OPTIONS}
			optionValue="value"
			optionTextValue="label"
			value={selectedTheme() ?? THEME_OPTIONS[0]}
			onChange={(option) => {
				setSelectedTheme(option);
				setColorMode(option.value);
			}}
			gutter={8}
			sameWidth={false}
			placement="bottom"
			itemComponent={(props) => (
				<Select.Item
					item={props.item}
					class="flex items-center space-x-2 px-3 py-1 text-sm outline-none ui-selected:text-sky-700 ui-highlighted:bg-zinc-100 transition-colors cursor-default dark:ui-selected:text-sky-400 dark:ui-highlighted:bg-zinc-700"
				>
					{props.item.rawValue.icon("h-4 w-4")}
					<Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
				</Select.Item>
			)}
		>
			<Select.Trigger
				aria-label="toggle color mode"
				class="flex p-2.5 rounded-md cursor-pointer items-center justify-center transition text-zinc-700 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
			>
				<Select.Value<ThemeOption>>
					{(state) => state.selectedOption().icon("h-5 w-5")}
				</Select.Value>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class="bg-white border border-zinc-300 rounded shadow-md py-1 z-50 dark:text-zinc-300 dark:bg-zinc-800 dark:border-none dark:shadow-none select-none">
					<Select.Listbox />
				</Select.Content>
			</Select.Portal>
		</Select>
	);
}
