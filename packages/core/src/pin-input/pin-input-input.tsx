import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { usePinInputContext } from "./pin-input-root-provider";
import { getValueBeforeInput, isValidValue } from "./utils";

export type PinInputInputProps = {
	children?: JSX.Element;
	index: number;
};

export type PinInputInputCommonProps<T extends HTMLElement = HTMLElement> = {
	id?: string;
	style?: JSX.CSSProperties | string;
};

export type PinInputInputRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PinInputInputProps & Partial<PinInputInputCommonProps<ElementOf<T>>>;

const parseValue = (current: string, next: string) => {
	let nextValue = next;
	if (current[0] === next[0]) {
		nextValue = next[1];
	} else if (current[0] === next[1]) {
		nextValue = next[0];
	}
	return nextValue.split("")[nextValue.length - 1];
};

export function PinInputInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, PinInputInputRootProps<T>>,
) {
	const context = usePinInputContext();

	const inputType = () => (context.inputMode === "numeric" ? "tel" : "text");

	const focusOnNewIndex = () => {
		context
			.inputElements()
			[context.focusedIndex()]?.focus({ preventScroll: true });
	};

	const clearActiveFocusedValue = () => {
		context.setValues((prev) => {
			const values = [...prev];
			values[context.focusedIndex()] = "";
			return values;
		});
	};

	const onBackSpaceKeyHandler = () => {
		if (context.values()[context.focusedIndex()] !== "") {
			// if value is present on current focused element
			clearActiveFocusedValue();
		} else {
			// go back by one index...
			context.setFocusedIndex(Math.max(context.focusedIndex() - 1, 0));
			if (context.focusedIndex() === -1) {
				return;
			}
			focusOnNewIndex();
			clearActiveFocusedValue();
		}
	};

	const onPasteHandler = (pastedValue: string) => {
		const filledValuesLength = context
			.values()
			.filter((value) => value?.trim() !== "").length;
		const startIndex = Math.min(context.focusedIndex(), filledValuesLength);
		const left =
			startIndex > 0
				? context.valuesAsString().substring(0, context.focusedIndex())
				: "";
		const right = pastedValue.substring(
			0,
			context.values().length - startIndex,
		);

		const value = left + right;

		context.setValues((prev) => {
			const values = [...prev];
			for (let i = 0; i < value.length; i++) {
				values[startIndex + i] = value[i] || "";
			}
			return values;
		});
		context.inputElements()[context.focusedIndex()].value =
			context.values()[context.focusedIndex()];
		const updatedFilledValuesLength = context
			.values()
			.filter((value) => value?.trim() !== "").length;

		context.setFocusedIndex(
			Math.min(updatedFilledValuesLength, context.values().length - 1),
		);
		focusOnNewIndex();
	};

	const onEnterKeyHandler = () => {
		const filledValuesLength = context
			.values()
			.filter((value) => value?.trim() !== "").length;
		if (context.values().length === filledValuesLength) {
			context.onValueComplete?.({
				values: context.values(),
				valueAsString: context.valuesAsString(),
			});
			context.hiddenInputRef?.form?.requestSubmit();
		}
	};

	return (
		<Polymorphic
			as="input"
			id={props.index.toString()}
			ref={(el: HTMLInputElement) => {
				context.setInputElements((elements) => {
					elements[props.index] = el;
					return elements;
				});
			}}
			aria-label={`Pin code ${props.index + 1} of ${context.values().length}`}
			type={context.mask ? "password" : inputType()}
			value={context.values()[props.index] || ""}
			inputMode={
				context.otp || context.inputMode === "numeric" ? "numeric" : "text"
			}
			readonly={context.readOnly}
			autoCapitalize="none"
			placeholder={
				context.focusedIndex() === props.index ? "" : context.placeholder
			}
			autoComplete={context.otp ? "one-time-code" : "off"}
			disabled={context.disabled}
			data-disabled={context.disabled}
			onBeforeInput={(event: InputEvent) => {
				const value = getValueBeforeInput(event);
				const isValid = isValidValue(value, context.inputMode, context.pattern);

				if (!isValid) {
					event.preventDefault();
					context.onValueInvalid?.({ value, focusedIndex: props.index });
					return;
				}

				if (value.length > 2 && event.currentTarget) {
					(event.currentTarget as HTMLInputElement).setSelectionRange(
						0,
						1,
						"forward",
					);
				}
			}}
			onInput={(event: InputEvent) => {
				const currentTarget = event.currentTarget as HTMLInputElement;
				const { value } = currentTarget;
				if (!currentTarget) {
					return;
				}

				if (event.inputType === "insertFromPaste" || value.length > 2) {
					// trigger paste
					// send({ type: "INPUT.PASTE", value })
					currentTarget.value = value[0];
					onPasteHandler(value);

					event.preventDefault();
					return;
				}

				if (event.inputType === "deleteContentBackward") {
					onBackSpaceKeyHandler();
					return;
				}

				if (context.focusedIndex() === context.values().length - 1) {
					context.setValues((prev) => {
						const values = [...prev];
						values[context.focusedIndex()] = parseValue(
							context.values()[context.focusedIndex()],
							value,
						);
						return values;
					});
					context.inputElements()[context.focusedIndex()].value =
						context.values()[context.focusedIndex()];
				} else {
					context.setValues((prev) => {
						const values = [...prev];
						values[context.focusedIndex()] = parseValue(
							context.values()[context.focusedIndex()],
							value,
						);
						return values;
					});
					context.inputElements()[context.focusedIndex()].value =
						context.values()[context.focusedIndex()];
					context.setFocusedIndex(
						Math.min(context.focusedIndex() + 1, context.values().length - 1),
					);
					focusOnNewIndex();
				}
			}}
			onKeyDown={(event: KeyboardEvent) => {
				if (
					event.defaultPrevented ||
					event.ctrlKey ||
					event.altKey ||
					event.metaKey ||
					event.isComposing
				) {
					return;
				}

				if (event.key === "Backspace") {
					onBackSpaceKeyHandler();
					event.preventDefault();
				}

				if (event.key === "Delete") {
					context.setValues((prev) => {
						const values = [...prev];
						values[context.focusedIndex()] = "";
						return values;
					});
					event.preventDefault();
				}

				if (event.key === "ArrowLeft") {
					context.setFocusedIndex(Math.max(context.focusedIndex() - 1, 0));
					context
						.inputElements()
						[context.focusedIndex()]?.focus({ preventScroll: true });
					event.preventDefault();
				}

				if (event.key === "ArrowRight") {
					context.setFocusedIndex(
						Math.min(context.focusedIndex() + 1, context.values().length - 1),
					);
					context
						.inputElements()
						[context.focusedIndex()]?.focus({ preventScroll: true });
					event.preventDefault();
				}

				if (event.key === "Enter") {
					onEnterKeyHandler();
					event.preventDefault();
				}
			}}
			onFocus={() => {
				context.setFocusedIndex(props.index);
			}}
			onBlur={() => context.setFocusedIndex(-1)}
			{...props}
		>
			{props.children}
		</Polymorphic>
	);
}
