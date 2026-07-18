import {
	access,
	createGenerateId,
	mergeDefaultProps,
	mergeRefs,
	type ValidationState,
} from "@kobalte/utils";
import { createFormResetListener } from "@solid-primitives/form";
import type { ValidComponent } from "@solidjs/web";
import { createSignal, createUniqueId, omit } from "solid-js";
import {
	createFormControl,
	FORM_CONTROL_PROP_NAMES,
	FormControlContext,
	type FormControlDataSet,
} from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createControllableSignal } from "../primitives";
import { createRovingCollection } from "../primitives/create-roving-collection";
import { TagsInputContext, type TagsInputContextValue } from "./tags-input-context";

export interface TagsInputValidateDetails {
	/** The candidate tag value being validated (already trimmed/length-clamped). */
	value: string;

	/** The tags already present (excluding the candidate). */
	values: string[];
}

export interface TagsInputRootOptions {
	/** The controlled value of the tags. */
	value?: string[];

	/** The value of the tags when initially rendered. */
	defaultValue?: string[];

	/** Event handler called when the tags change. */
	onChange?: (value: string[]) => void;

	/** The controlled value of the text input used to compose a new tag. */
	inputValue?: string;

	/** The value of the text input when initially rendered. */
	defaultInputValue?: string;

	/** Event handler called when the text input value changes. */
	onInputChange?: (value: string) => void;

	/**
	 * Whether an existing tag can be edited (double click, or focus + Enter).
	 * @defaultValue true
	 */
	editable?: boolean;

	/**
	 * Whether pasting text into the input should split it by `delimiter` and
	 * add each resulting segment as its own tag.
	 * @defaultValue false
	 */
	addOnPaste?: boolean;

	/**
	 * The character (or pattern) used to split typed/pasted text into
	 * separate tags.
	 * @defaultValue ","
	 */
	delimiter?: string | RegExp;

	/**
	 * What to do with any leftover input text when the input loses focus.
	 * `"add"` commits it as a new tag, `"clear"` discards it.
	 */
	blurBehavior?: "add" | "clear";

	/**
	 * Whether the same tag value is allowed to appear more than once.
	 * @defaultValue false
	 */
	allowDuplicates?: boolean;

	/** The maximum number of tags allowed. */
	max?: number;

	/** The maximum number of characters allowed in a single tag. */
	maxLength?: number;

	/** A function that validates a candidate tag value, returning `false` to reject it. */
	validate?: (details: TagsInputValidateDetails) => boolean;

	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components (Label, Description, ErrorMessage).
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;

	/** The name of the tags input, used when submitting an HTML form. */
	name?: string;

	/** Whether the tags input should display its "valid" or "invalid" visual styling. */
	validationState?: ValidationState;

	/** Whether the user must add at least one tag before the owning form can be submitted. */
	required?: boolean;

	/** Whether the tags input is disabled. */
	disabled?: boolean;

	/** Whether the tags input is read only. */
	readOnly?: boolean;
}

export interface TagsInputRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface TagsInputRootRenderProps
	extends TagsInputRootCommonProps,
		FormControlDataSet {
	role: "group";
	"data-empty": "" | undefined;
}

export type TagsInputRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = TagsInputRootOptions & Partial<TagsInputRootCommonProps<ElementOf<T>>>;

export function TagsInputRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, TagsInputRootProps<T>>,
) {
	let ref: HTMLDivElement | undefined;

	const defaultId = `tags-input-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
			editable: true,
			addOnPaste: false,
			delimiter: ",",
			allowDuplicates: false,
			max: Number.POSITIVE_INFINITY,
		},
		props as TagsInputRootProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"value",
		"defaultValue",
		"onChange",
		"inputValue",
		"defaultInputValue",
		"onInputChange",
		"editable",
		"addOnPaste",
		"delimiter",
		"blurBehavior",
		"allowDuplicates",
		"max",
		"maxLength",
		"validate",
		...FORM_CONTROL_PROP_NAMES,
	);

	// Track controllability on first render only.
	const initialValueIsControlled = mergedProps.value !== undefined;
	const [value, setValueRaw] = createControllableSignal<string[]>({
		value: () =>
			initialValueIsControlled ? (mergedProps.value ?? []) : undefined,
		defaultValue: () => mergedProps.defaultValue ?? [],
		onChange: (v) => mergedProps.onChange?.(v),
	});

	const tags = () => value() ?? [];
	const setTags = (v: string[]) => setValueRaw(v);

	const initialInputValueIsControlled = mergedProps.inputValue !== undefined;
	const [inputValue, setInputValueRaw] = createControllableSignal<string>({
		value: () =>
			initialInputValueIsControlled ? (mergedProps.inputValue ?? "") : undefined,
		defaultValue: () => mergedProps.defaultInputValue ?? "",
		onChange: (v) => mergedProps.onInputChange?.(v),
	});
	const setInputValue = (v: string) => setInputValueRaw(v);

	const [editingIndex, setEditingIndexRaw] = createSignal<number | undefined>(
		undefined,
	);
	const setEditingIndex = (index: number | undefined) =>
		setEditingIndexRaw(index);

	const [isFocused, setIsFocused] = createSignal(false);

	const { formControlContext } = createFormControl(mergedProps);

	const isInteractive = () =>
		!formControlContext.isDisabled() && !formControlContext.isReadOnly();

	const normalizeCandidate = (raw: string) => {
		let candidate = raw.trim();

		if (mergedProps.maxLength != null) {
			candidate = candidate.slice(0, mergedProps.maxLength);
		}

		return candidate;
	};

	const addTagValue = (raw: string): boolean => {
		if (!isInteractive()) {
			return false;
		}

		const candidate = normalizeCandidate(raw);
		const current = tags();

		if (candidate === "") {
			return false;
		}

		if (current.length >= mergedProps.max) {
			return false;
		}

		if (!mergedProps.allowDuplicates && current.includes(candidate)) {
			return false;
		}

		if (
			mergedProps.validate &&
			!mergedProps.validate({ value: candidate, values: current })
		) {
			return false;
		}

		setTags([...current, candidate]);

		return true;
	};

	const removeTagAt = (index: number) => {
		if (!isInteractive()) {
			return;
		}

		const current = tags();

		if (index < 0 || index >= current.length) {
			return;
		}

		setTags([...current.slice(0, index), ...current.slice(index + 1)]);

		setEditingIndexRaw((editing) => {
			if (editing === index) {
				return undefined;
			}

			if (editing != null && editing > index) {
				return editing - 1;
			}

			return editing;
		});
	};

	const editTagAt = (index: number, raw: string): boolean => {
		if (!isInteractive()) {
			return false;
		}

		const current = tags();

		if (index < 0 || index >= current.length) {
			return false;
		}

		const candidate = normalizeCandidate(raw);

		if (candidate === "") {
			return false;
		}

		if (
			!mergedProps.allowDuplicates &&
			current.some((tag, i) => i !== index && tag === candidate)
		) {
			return false;
		}

		if (
			mergedProps.validate &&
			!mergedProps.validate({
				value: candidate,
				values: current.filter((_, i) => i !== index),
			})
		) {
			return false;
		}

		const next = [...current];
		next[index] = candidate;
		setTags(next);

		return true;
	};

	const clearTags = () => {
		if (!isInteractive()) {
			return;
		}

		setTags([]);
		setEditingIndexRaw(undefined);
	};

	const { DomCollectionProvider, listState, focusItemAt: focusRovingKey } =
		createRovingCollection();

	const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

	const focusInput = () => {
		inputRef()?.focus();
	};

	const focusItemAt = (index: number) => {
		focusRovingKey(String(index));
	};

	createFormResetListener(
		() => ref,
		() => {
			setTags(mergedProps.defaultValue ?? []);
			setInputValueRaw(mergedProps.defaultInputValue ?? "");
			setEditingIndexRaw(undefined);
		},
	);

	const context: TagsInputContextValue = {
		value: tags,
		inputValue: () => inputValue() ?? "",
		setInputValue,
		editingIndex,
		setEditingIndex,
		isEditable: () => mergedProps.editable ?? true,
		addOnPaste: () => mergedProps.addOnPaste ?? false,
		delimiter: () => mergedProps.delimiter ?? ",",
		blurBehavior: () => mergedProps.blurBehavior,
		isFocused,
		setIsFocused,
		listState,
		generateId: createGenerateId(() => access(mergedProps.id)!),
		addTagValue,
		removeTagAt,
		editTagAt,
		clearTags,
		focusInput,
		focusItemAt,
		setInputRef: (el) => setInputRef(() => el),
	};

	return (
		<FormControlContext value={formControlContext}>
			<TagsInputContext value={context}>
				<DomCollectionProvider>
					<Polymorphic<TagsInputRootRenderProps>
						as="div"
						ref={mergeRefs(
							(el) => (ref = el as HTMLDivElement),
							mergedProps.ref,
						)}
						role="group"
						id={access(mergedProps.id)}
						data-empty={tags().length === 0 ? "" : undefined}
						{...formControlContext.dataset()}
						{...others}
					/>
				</DomCollectionProvider>
			</TagsInputContext>
		</FormControlContext>
	);
}
