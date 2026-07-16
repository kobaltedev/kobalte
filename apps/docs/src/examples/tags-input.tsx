import { TagsInput, useTagsInputContext } from "@kobalte/core/tags-input";
import { createSignal, For } from "solid-js";

import style from "./tags-input.module.css";

function Tags() {
	const context = useTagsInputContext();

	return (
		<For each={context.value()} keyed={false}>
			{(value, index) => (
				<TagsInput.Item value={value()} index={index} class={style["tags-input__tag"]}>
					<TagsInput.ItemPreview>
						<TagsInput.ItemText />
						<TagsInput.ItemDeleteTrigger class={style["tags-input__tag-delete"]}>
							✕
						</TagsInput.ItemDeleteTrigger>
					</TagsInput.ItemPreview>
					<TagsInput.ItemInput class={style["tags-input__tag-edit-input"]} />
				</TagsInput.Item>
			)}
		</For>
	);
}

export function BasicExample() {
	return (
		<TagsInput defaultValue={["Solid", "Kobalte"]}>
			<TagsInput.Control class={style["tags-input__control"]}>
				<Tags />
				<TagsInput.Input
					class={style["tags-input__input"]}
					placeholder="Add a tag…"
				/>
			</TagsInput.Control>
		</TagsInput>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal(["red", "green"]);

	return (
		<>
			<TagsInput value={value()} onChange={setValue}>
				<TagsInput.Control class={style["tags-input__control"]}>
					<Tags />
					<TagsInput.Input
						class={style["tags-input__input"]}
						placeholder="Add a color…"
					/>
				</TagsInput.Control>
			</TagsInput>
			<p class="not-prose text-sm mt-4">Value: {JSON.stringify(value())}</p>
		</>
	);
}

export function DelimiterExample() {
	return (
		<TagsInput delimiter=" " addOnPaste>
			<TagsInput.Control class={style["tags-input__control"]}>
				<Tags />
				<TagsInput.Input
					class={style["tags-input__input"]}
					placeholder="Type a space, or paste a list…"
				/>
			</TagsInput.Control>
		</TagsInput>
	);
}

export function MaxExample() {
	const MAX = 3;
	const [value, setValue] = createSignal(["a", "b"]);

	return (
		<>
			<TagsInput value={value()} onChange={setValue} max={MAX}>
				<TagsInput.Control class={style["tags-input__control"]}>
					<Tags />
					<TagsInput.Input
						class={style["tags-input__input"]}
						placeholder="Add a tag…"
					/>
				</TagsInput.Control>
			</TagsInput>
			<p class="not-prose text-sm mt-4">
				{value().length} / {MAX} tags used
			</p>
		</>
	);
}

export function ValidateExample() {
	const reserved = ["admin", "root"];

	return (
		<TagsInput
			validate={({ value }) => !reserved.includes(value.toLowerCase())}
		>
			<TagsInput.Control class={style["tags-input__control"]}>
				<Tags />
				<TagsInput.Input
					class={style["tags-input__input"]}
					placeholder="Try “admin”…"
				/>
			</TagsInput.Control>
		</TagsInput>
	);
}

export function ValidationExample() {
	const [value, setValue] = createSignal<string[]>([]);

	const isInvalid = () => value().length === 0;

	return (
		<div class="flex flex-col gap-2">
			<TagsInput
				value={value()}
				onChange={setValue}
				required
				validationState={isInvalid() ? "invalid" : "valid"}
			>
				<TagsInput.Label class="text-sm font-medium text-slate-700 dark:text-slate-300">
					Skills
				</TagsInput.Label>
				<div class="mt-1">
					<TagsInput.Control class={style["tags-input__control"]}>
						<Tags />
						<TagsInput.Input
							class={style["tags-input__input"]}
							placeholder="Add a skill…"
						/>
					</TagsInput.Control>
				</div>
				<TagsInput.Description class="text-sm text-slate-500 mt-1">
					Add at least one skill.
				</TagsInput.Description>
				<TagsInput.ErrorMessage class="text-sm text-red-600 mt-1">
					At least one skill is required.
				</TagsInput.ErrorMessage>
			</TagsInput>
		</div>
	);
}

export function HTMLFormExample() {
	let formRef: HTMLFormElement | undefined;

	const onSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const formData = new FormData(formRef);
		alert(JSON.stringify(formData.getAll("fruits"), null, 2));
	};

	return (
		<form
			ref={formRef}
			onSubmit={onSubmit}
			class="flex flex-col items-center space-y-6"
		>
			<TagsInput name="fruits" defaultValue={["apple", "banana"]}>
				<TagsInput.Control class={style["tags-input__control"]}>
					<Tags />
					<TagsInput.Input
						class={style["tags-input__input"]}
						placeholder="Add a fruit…"
					/>
				</TagsInput.Control>
			</TagsInput>
			<div class="flex space-x-2">
				<button type="reset" class="kb-button">
					Reset
				</button>
				<button type="submit" class="kb-button-primary">
					Submit
				</button>
			</div>
		</form>
	);
}
