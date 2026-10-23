import { callHandler } from "@kobalte/utils";
import type { ComponentProps, JSX } from "@solidjs/web";
import { createSignal, omit, onSettled, Show, untrack } from "solid-js";
import { useTagsInputContext } from "./tags-input-context";
import { useTagsInputItemContext } from "./tags-input-item-context";

export interface TagsInputItemInputOptions {}

export type TagsInputItemInputProps = TagsInputItemInputOptions &
	ComponentProps<"input">;

/**
 * The text field used to edit an existing tag's value. Only rendered while
 * that tag is being edited (see `TagsInput.Item`'s `editable` behavior).
 */
export function TagsInputItemInput(props: TagsInputItemInputProps) {
	const context = useTagsInputContext();
	const itemContext = useTagsInputItemContext();

	return (
		<Show when={context.editingIndex() === itemContext.index()}>
			<TagsInputItemInputField {...props} />
		</Show>
	);
}

function TagsInputItemInputField(props: TagsInputItemInputProps) {
	let ref: HTMLInputElement | undefined;

	const context = useTagsInputContext();
	const itemContext = useTagsInputItemContext();

	const others = omit(props, "ref", "onInput", "onKeyDown", "onBlur");

	// Intentionally a one-time snapshot to seed the local edit buffer, not a
	// live binding — the tag keeps its committed value until `commit()`.
	const [draft, setDraft] = createSignal(untrack(() => itemContext.value()));

	const commit = () => {
		if (!context.editTagAt(itemContext.index(), draft())) {
			setDraft(itemContext.value());
		}

		context.setEditingIndex(undefined);
		context.focusItemAt(itemContext.index());
	};

	const cancel = () => {
		setDraft(itemContext.value());
		context.setEditingIndex(undefined);
		context.focusItemAt(itemContext.index());
	};

	const onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
		callHandler(
			e as InputEvent & { currentTarget: HTMLInputElement; target: Element },
			props.onInput as
				| JSX.EventHandlerUnion<HTMLInputElement, InputEvent>
				| undefined,
		);
		setDraft((e.target as HTMLInputElement).value);
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (
		e,
	) => {
		callHandler(e, props.onKeyDown);

		// Prevent Enter/Escape (and any other key) from bubbling up into
		// `TagsInput.Item`'s own keydown handler, which would otherwise
		// re-interpret them (e.g. re-opening edit mode right after Enter
		// just committed it).
		e.stopPropagation();

		if (e.key === "Enter") {
			e.preventDefault();
			commit();
		} else if (e.key === "Escape") {
			e.preventDefault();
			cancel();
		}
	};

	const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (e) => {
		callHandler(
			e as FocusEvent & { currentTarget: HTMLInputElement; target: Element },
			props.onBlur as
				| JSX.EventHandlerUnion<HTMLInputElement, FocusEvent>
				| undefined,
		);
		commit();
	};

	onSettled(() => {
		ref?.focus();
		ref?.select();
	});

	return (
		<input
			ref={[(el) => (ref = el), props.ref]}
			value={draft()}
			type="text"
			onInput={onInput}
			onKeyDown={onKeyDown}
			onBlur={onBlur}
			{...others}
		/>
	);
}
