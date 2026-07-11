import { Checkbox } from "@kobalte/core/checkbox";
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
							aria-label={`Remove ${tag}`}
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
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem" }}>
			<Chip class={style.chip} onClick={() => alert("Showing all React repos")}>
				React
			</Chip>
			<Chip class={style.chip} onClick={() => alert("Showing all Solid repos")}>
				Solid
			</Chip>
		</div>
	);
}

/**
 * Selectable (filter) chips, built the same way MUI Joy's `Chip` does it
 * (https://v7.mui.com/joy-ui/react-chip/#with-a-checkbox): `Chip` stays a
 * static container, and a real `Checkbox` — stretched to cover the whole
 * chip — owns the interaction and ARIA semantics for the selected state.
 */
export function SelectableExample() {
	const options = ["React", "Solid", "Vue"];

	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem" }}>
			<For each={options}>
				{(option) => (
					<Chip class={style.chip}>
						<Checkbox class={style.chip__checkbox}>
							<Checkbox.Input
								class={style["chip__checkbox-input"]}
								style={{
									position: "absolute",
									inset: "0",
									margin: "0",
									width: "auto",
									height: "auto",
									padding: "0",
									border: "0",
									overflow: "visible",
									clip: "auto",
									"clip-path": "none",
									"white-space": "normal",
								}}
							/>
							<Checkbox.Label class={style["chip__checkbox-label"]}>
								{option}
							</Checkbox.Label>
						</Checkbox>
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
