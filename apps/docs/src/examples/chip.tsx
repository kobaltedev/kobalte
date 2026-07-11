import { Chip } from "@kobalte/core/chip";
import { createSignal, For } from "solid-js";

import style from "./chip.module.css";

export function BasicExample() {
	const [tags, setTags] = createSignal(["Design", "Engineering", "Product"]);

	const removeTag = (tag: string) => {
		setTags((prev) => prev.filter((t) => t !== tag));
	};

	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem" }}>
			<For each={tags()}>
				{(tag) => (
					<Chip class={style.chip}>
						{tag}
						<Chip.Delete
							class={style["chip__delete-button"]}
							onClick={() => removeTag(tag)}
						>
							✕
						</Chip.Delete>
					</Chip>
				)}
			</For>
		</div>
	);
}

export function ClickableExample() {
	const [selected, setSelected] = createSignal<string[]>([]);
	const options = ["React", "Solid", "Vue"];

	const toggle = (option: string) => {
		setSelected((prev) =>
			prev.includes(option)
				? prev.filter((o) => o !== option)
				: [...prev, option],
		);
	};

	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem" }}>
			<For each={options}>
				{(option) => (
					<Chip
						class={style.chip}
						classList={{
							[style["chip--selected"]]: selected().includes(option),
						}}
						onClick={() => toggle(option)}
					>
						{option}
					</Chip>
				)}
			</For>
		</div>
	);
}

export function DisabledExample() {
	return (
		<Chip class={style.chip} disabled>
			Archived
			<Chip.Delete class={style["chip__delete-button"]}>✕</Chip.Delete>
		</Chip>
	);
}
