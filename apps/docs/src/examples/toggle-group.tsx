import { ToggleGroup } from "@kobalte/core";

import { JSXElement, createSignal } from "solid-js";
import style from "./toggle-group.module.css";

export function BasicExample() {
	return (
		<ToggleGroup.Root class={style["toggle-group"]}>
			<ToggleGroup.Item class={style["toggle-group__item"]} value="bold" aria-label="Bold">
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 5h6a3.5 3.5 0 0 1 0 7H7zm6 7h1a3.5 3.5 0 0 1 0 7H7v-7"
					/>
					<title>Bold</title>
				</svg>
			</ToggleGroup.Item>
			<ToggleGroup.Item class={style["toggle-group__item"]} value="italic" aria-label="Italic">
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5h6M7 19h6m1-14l-4 14"
					/>
					<title>Italic</title>
				</svg>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				class={style["toggle-group__item"]}
				value="underline"
				aria-label="Underline"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 5v5a5 5 0 0 0 10 0V5M5 19h14"
					/>
					<title>Underline</title>
				</svg>
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	);
}

export function DefaultValueExample() {
	return (
		<ToggleGroup.Root class={style["toggle-group"]} defaultValue="bold">
			<ToggleGroup.Item class={style["toggle-group__item"]} value="bold" aria-label="Bold">
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 5h6a3.5 3.5 0 0 1 0 7H7zm6 7h1a3.5 3.5 0 0 1 0 7H7v-7"
					/>
					<title>Bold</title>
				</svg>
			</ToggleGroup.Item>
			<ToggleGroup.Item class={style["toggle-group__item"]} value="italic" aria-label="Italic">
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5h6M7 19h6m1-14l-4 14"
					/>
					<title>Italic</title>
				</svg>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				class={style["toggle-group__item"]}
				value="underline"
				aria-label="Underline"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 5v5a5 5 0 0 0 10 0V5M5 19h14"
					/>
					<title>Underline</title>
				</svg>
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal("bold");

	const list: Record<string, JSXElement> = {
		bold: <strong>{value()}</strong>,
		italic: <i>{value()}</i>,
		underline: <u>{value()}</u>,
	};

	const render = () => {
		return list[value()];
	};

	return (
		<>
			<ToggleGroup.Root class={style["toggle-group"]} value={value()} onChange={setValue}>
				<ToggleGroup.Item class={style["toggle-group__item"]} value="bold" aria-label="Bold">
					<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 5h6a3.5 3.5 0 0 1 0 7H7zm6 7h1a3.5 3.5 0 0 1 0 7H7v-7"
						/>
						<title>Bold</title>
					</svg>
				</ToggleGroup.Item>
				<ToggleGroup.Item class={style["toggle-group__item"]} value="italic" aria-label="Italic">
					<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5h6M7 19h6m1-14l-4 14"
						/>
						<title>Italic</title>
					</svg>
				</ToggleGroup.Item>
				<ToggleGroup.Item
					class={style["toggle-group__item"]}
					value="underline"
					aria-label="Underline"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 5v5a5 5 0 0 0 10 0V5M5 19h14"
						/>
						<title>Underline</title>
					</svg>
				</ToggleGroup.Item>
			</ToggleGroup.Root>
			<div class="text-sm">
				Your text style is: <span class="capitalize">{render()}.</span>
			</div>
		</>
	);
}

export function MultipleSelectionExample() {
	return (
		<ToggleGroup.Root class={style["toggle-group"]} multiple defaultValue={["bold", "underline"]}>
			<ToggleGroup.Item class={style["toggle-group__item"]} value="bold" aria-label="Bold">
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 5h6a3.5 3.5 0 0 1 0 7H7zm6 7h1a3.5 3.5 0 0 1 0 7H7v-7"
					/>
					<title>Bold</title>
				</svg>
			</ToggleGroup.Item>
			<ToggleGroup.Item class={style["toggle-group__item"]} value="italic" aria-label="Italic">
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5h6M7 19h6m1-14l-4 14"
					/>
					<title>Italic</title>
				</svg>
			</ToggleGroup.Item>
			<ToggleGroup.Item
				class={style["toggle-group__item"]}
				value="underline"
				aria-label="Underline"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 5v5a5 5 0 0 0 10 0V5M5 19h14"
					/>
					<title>Underline</title>
				</svg>
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	);
}
