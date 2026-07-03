/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/blob/main/packages/otp-field/src/Input.tsx
 */

import { callHandler, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { isServer, type JSX, type ValidComponent } from "@solidjs/web";
import {
	createMemo,
	createRenderEffect,
	flush,
	omit,
	onSettled,
	Show,
} from "solid-js";
import { useFormControlContext } from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useOTPFieldContext } from "./otp-field-context";
import {
	createOTPFieldStyleElement,
	DEFAULT_NOSCRIPT_CSS_FALLBACK,
} from "./otp-field-style";

export interface OTPFieldInputOptions {
	/**
	 * Regex pattern for allowed characters. `null` disables validation and allows all chars.
	 * @defaultValue `'^\\d*$'`
	 */
	pattern?: string | null;

	/**
	 * CSS to inject via `<noscript>` for no-JS environments. `null` disables the fallback.
	 * @defaultValue DEFAULT_NOSCRIPT_CSS_FALLBACK
	 */
	noScriptCSSFallback?: string | null;
}

export interface OTPFieldInputCommonProps<T extends HTMLElement = HTMLElement> {
	ref: T | ((el: T) => void);
	onInput: JSX.EventHandlerUnion<T, InputEvent>;
	onFocus: JSX.EventHandlerUnion<T, FocusEvent>;
	onBlur: JSX.EventHandlerUnion<T, FocusEvent>;
	onMouseOver: JSX.EventHandlerUnion<T, MouseEvent>;
	onMouseLeave: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onKeyUp: JSX.EventHandlerUnion<T, KeyboardEvent>;
	style: JSX.CSSProperties | string;
}

export interface OTPFieldInputRenderProps
	extends OTPFieldInputCommonProps<HTMLInputElement> {
	pattern: string | undefined;
	"data-kb-otp-field-input": "";
	inputMode: "numeric";
	autocomplete: string;
	spellcheck: false;
	disabled: boolean | undefined;
	readonly: boolean | undefined;
	"aria-required": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-readonly": "true" | undefined;
	"aria-invalid": "true" | undefined;
}

export type OTPFieldInputProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = OTPFieldInputOptions & Partial<OTPFieldInputCommonProps<ElementOf<T>>>;

export function OTPFieldInput<T extends ValidComponent = "input">(
	props: PolymorphicProps<T, OTPFieldInputProps<T>>,
) {
	const mergedProps = mergeDefaultProps(
		{
			pattern: "^\\d*$",
			noScriptCSSFallback: DEFAULT_NOSCRIPT_CSS_FALLBACK,
		},
		props as OTPFieldInputProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"pattern",
		"noScriptCSSFallback",
		"onInput",
		"onFocus",
		"onBlur",
		"onMouseOver",
		"onMouseLeave",
		"onKeyDown",
		"onKeyUp",
		"style",
	);

	const previousSelection: {
		inserting: boolean;
		start: number | null;
		end: number | null;
	} = { inserting: false, start: null, end: null };

	let shiftKeyDown = false;

	let inputRef: HTMLInputElement | null = null;

	const context = useOTPFieldContext();
	const formControlContext = useFormControlContext();

	onSettled(() => {
		const cleanupStyle = createOTPFieldStyleElement();
		const handler = () => onSelectionChange();
		document.addEventListener("selectionchange", handler);

		const el = inputRef;
		const onCopy = (e: ClipboardEvent) => {
			if (!formControlContext.isReadOnly()) return;
			e.clipboardData?.setData("text/plain", context.value());
			e.preventDefault();
		};
		el?.addEventListener("copy", onCopy);

		return () => {
			cleanupStyle();
			document.removeEventListener("selectionchange", handler);
			el?.removeEventListener("copy", onCopy);
		};
	});

	// Sync value back after form reset.
	onSettled(() => {
		const el = inputRef;
		if (!el) return;
		const form = el.form;
		if (!form) return;
		const onReset = () => {
			requestAnimationFrame(() => {
				context.setValue(el.value);
			});
		};
		form.addEventListener("reset", onReset);
		return () => form.removeEventListener("reset", onReset);
	});

	// Keep the input element's value in sync with context.
	createRenderEffect(
		() => context.value(),
		(value) => {
			if (!inputRef) return;
			inputRef.value = value;
		},
	);

	const patternRegex = createMemo(() =>
		mergedProps.pattern !== null ? new RegExp(mergedProps.pattern) : undefined,
	);

	const onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (
		event,
	) => {
		callHandler(
			event,
			mergedProps.onInput as JSX.EventHandlerUnion<
				HTMLInputElement,
				InputEvent
			>,
		);
		if (event.defaultPrevented) return;

		if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
			event.currentTarget.value = context.value();
			return;
		}

		const rawValue = event.currentTarget.value;
		let finalValue = rawValue;
		const contextValue = context.value();
		const selectionSize = Math.abs(
			(previousSelection.start ?? 0) - (previousSelection.end ?? 0),
		);
		const regex = patternRegex();

		if (
			(previousSelection.inserting || selectionSize === contextValue.length) &&
			regex
		) {
			finalValue = finalValue.replace(
				new RegExp(`[^${regex.source}]`, "g"),
				"",
			);
		}
		finalValue = finalValue.slice(0, context.maxLength());

		const hasInvalidChars = !!regex && !regex.test(finalValue);
		if (
			(rawValue.length !== 0 && finalValue.length === 0) ||
			finalValue === contextValue ||
			hasInvalidChars
		) {
			event.preventDefault();
			event.currentTarget.value = contextValue;
			if (hasInvalidChars) {
				event.currentTarget.setSelectionRange(
					previousSelection.start ?? 0,
					previousSelection.end ?? 0,
				);
			}
			return;
		}

		if (finalValue.length < contextValue.length) {
			onSelectionChange(event.inputType);
		}

		context.setValue(finalValue);
	};

	const onFocus: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (
		event,
	) => {
		callHandler(
			event,
			mergedProps.onFocus as JSX.EventHandlerUnion<
				HTMLInputElement,
				FocusEvent
			>,
		);
		if (event.defaultPrevented) return;
		if (formControlContext.isReadOnly()) {
			context.setIsFocused(true);
			flush();
			event.currentTarget.setSelectionRange(0, context.value().length);
			onSelectionChange();
		} else {
			event.currentTarget.setSelectionRange(
				context.value().length,
				context.value().length,
			);
			context.setIsFocused(true);
			onSelectionChange();
		}
	};

	const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (
		event,
	) => {
		callHandler(
			event,
			mergedProps.onBlur as JSX.EventHandlerUnion<HTMLInputElement, FocusEvent>,
		);
		if (event.defaultPrevented) return;
		shiftKeyDown = false;
		context.setIsFocused(false);
		onSelectionChange();
	};

	const onMouseOver: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (
		event,
	) => {
		callHandler(
			event,
			mergedProps.onMouseOver as JSX.EventHandlerUnion<
				HTMLInputElement,
				MouseEvent
			>,
		);
		if (!event.defaultPrevented) {
			context.setIsHovered(true);
		}
	};

	const onMouseLeave: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (
		event,
	) => {
		callHandler(
			event,
			mergedProps.onMouseLeave as JSX.EventHandlerUnion<
				HTMLInputElement,
				MouseEvent
			>,
		);
		if (!event.defaultPrevented) {
			context.setIsHovered(false);
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (
		event,
	) => {
		callHandler(
			event,
			mergedProps.onKeyDown as JSX.EventHandlerUnion<
				HTMLInputElement,
				KeyboardEvent
			>,
		);
		if (event.defaultPrevented) return;
		if (event.key === "Shift") shiftKeyDown = true;
	};

	const onKeyUp: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (
		event,
	) => {
		callHandler(
			event,
			mergedProps.onKeyUp as JSX.EventHandlerUnion<
				HTMLInputElement,
				KeyboardEvent
			>,
		);
		if (event.defaultPrevented) return;
		if (event.key === "Shift") shiftKeyDown = false;
	};

	const onSelectionChange = (inputType?: string) => {
		const el = inputRef;
		if (!el) return;

		if (
			!context.isFocused() ||
			document.activeElement !== el ||
			el.selectionStart === null ||
			el.selectionEnd === null
		) {
			syncSelection({
				start: null,
				end: null,
				inserting: false,
				originalStart: el.selectionStart,
				originalEnd: el.selectionEnd,
			});
			context.setIsInserting(false);
			return;
		}

		if (formControlContext.isReadOnly()) {
			context.setActiveSlots(
				Array.from({ length: context.value().length }, (_, i) => i),
			);
			return;
		}

		const maxLength = context.maxLength();
		const inserting =
			el.value.length < maxLength && el.selectionStart === el.value.length;
		context.setIsInserting(inserting);

		if (inserting || el.selectionStart !== el.selectionEnd) {
			syncSelection({
				start: el.selectionStart,
				end: inserting ? el.selectionEnd + 1 : el.selectionEnd,
				inserting,
				originalStart: el.selectionStart,
				originalEnd: el.selectionEnd,
			});
			return;
		}

		let selectionStart = 0;
		let selectionEnd = 0;
		let direction: "forward" | "backward" | undefined;

		if (el.selectionStart === 0) {
			selectionStart = 0;
			selectionEnd = 1;
			direction = "forward";
		} else if (el.selectionStart === maxLength) {
			selectionStart = maxLength - 1;
			selectionEnd = maxLength;
			direction = "backward";
		} else {
			let startOffset = 0;
			let endOffset = 1;
			if (previousSelection.start !== null && previousSelection.end !== null) {
				const navigatedBackwards =
					el.selectionStart < previousSelection.end &&
					Math.abs(previousSelection.start - previousSelection.end) === 1;
				direction = navigatedBackwards ? "backward" : "forward";
				if (
					(navigatedBackwards &&
						!previousSelection.inserting &&
						inputType !== "deleteContentForward") ||
					(!navigatedBackwards && shiftKeyDown)
				) {
					startOffset += -1;
				}
			}
			if (shiftKeyDown && inputType === undefined) {
				endOffset += 1;
			}
			selectionStart = el.selectionStart + startOffset;
			selectionEnd = el.selectionEnd + startOffset + endOffset;
		}

		el.setSelectionRange(selectionStart, selectionEnd, direction);
		syncSelection({
			start: selectionStart,
			end: selectionEnd,
			inserting,
			originalStart: el.selectionStart,
			originalEnd: el.selectionEnd,
		});
	};

	const syncSelection = (update: {
		start: number | null;
		end: number | null;
		inserting: boolean;
		originalStart: number | null;
		originalEnd: number | null;
	}) => {
		previousSelection.inserting = update.inserting;
		previousSelection.start = update.originalStart;
		previousSelection.end = update.originalEnd;

		if (update.start === null || update.end === null) {
			context.setActiveSlots([]);
			return;
		}

		context.setActiveSlots(
			Array.from(
				{ length: update.end - update.start },
				(_, i) => update.start! + i,
			),
		);
	};

	const inputStyle = (): JSX.CSSProperties => ({
		display: "flex",
		position: "absolute",
		inset: "0",
		width: context.shiftPWManagers() ? "calc(100% + 40px)" : "100%",
		"clip-path": context.shiftPWManagers() ? "inset(0 40px 0 0)" : undefined,
		height: "100%",
		padding: "0",
		color: "transparent",
		background: "transparent",
		"caret-color": "transparent",
		border: "0 solid transparent",
		outline: "0 solid transparent",
		"box-shadow": "none",
		"line-height": "1",
		"letter-spacing": "-1em",
		"font-family": "monospace",
		"font-variant-numeric": "tabular-nums",
		"font-size": `${context.rootHeight() ?? 40}px`,
		"pointer-events": "all",
	});

	const resolvedStyle = (): JSX.CSSProperties => {
		const userStyle = mergedProps.style;
		if (!userStyle || typeof userStyle === "string") return inputStyle();
		return { ...inputStyle(), ...userStyle };
	};

	return (
		<>
			<Show when={mergedProps.noScriptCSSFallback !== null && isServer}>
				<noscript>
					<style>{mergedProps.noScriptCSSFallback}</style>
				</noscript>
			</Show>
			<Polymorphic<OTPFieldInputRenderProps>
				as="input"
				ref={mergeRefs((el) => {
					inputRef = el as HTMLInputElement;
					inputRef.value = context.value();
				}, mergedProps.ref)}
				onInput={onInput}
				onFocus={onFocus}
				onBlur={onBlur}
				onMouseOver={onMouseOver}
				onMouseLeave={onMouseLeave}
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				inputMode="numeric"
				autocomplete="one-time-code"
				spellcheck={false}
				style={resolvedStyle()}
				pattern={patternRegex()?.source}
				data-kb-otp-field-input=""
				disabled={formControlContext.isDisabled()}
				readonly={formControlContext.isReadOnly()}
				aria-required={formControlContext.isRequired() ? "true" : undefined}
				aria-disabled={formControlContext.isDisabled() ? "true" : undefined}
				aria-readonly={formControlContext.isReadOnly() ? "true" : undefined}
				aria-invalid={
					formControlContext.validationState() === "invalid"
						? "true"
						: undefined
				}
				{...others}
			/>
		</>
	);
}
