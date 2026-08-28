import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createMemo, createSignal, merge, omit, type Ref } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createTagName } from "../primitives";
import { CHIP_INTL_TRANSLATIONS, type ChipIntlTranslations } from "./chip.intl";
import { ChipContext, type ChipContextValue } from "./chip-context";

export interface ChipRootOptions {
	/** The localized strings of the component. */
	translations?: ChipIntlTranslations;
}

export interface ChipRootCommonProps<T extends HTMLElement = HTMLElement> {
	ref: Ref<T>;
	/** Whether the chip is disabled. */
	disabled: boolean | undefined;
	onClick?: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown?: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface ChipRootRenderProps extends ChipRootCommonProps {
	role: "button" | undefined;
	tabindex: number | undefined;
	"aria-disabled": "true" | undefined;
	"data-disabled": string | undefined;
	"data-clickable": string | undefined;
}

export type ChipRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ChipRootOptions & Partial<ChipRootCommonProps<ElementOf<T>>>;

/**
 * Chip is a compact element that represents an input, attribute, or action, such as a filter, a tag, or a contact.
 * It becomes keyboard-operable as soon as an `onClick` handler is provided.
 */
export function ChipRoot<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ChipRootProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const mergedProps = merge(
		{ translations: CHIP_INTL_TRANSLATIONS },
		props as ChipRootProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"disabled",
		"translations",
		"onClick",
		"onKeyDown",
	);

	const tagName = createTagName(ref, () => "span");

	const isNativeButton = createMemo(() => tagName() === "button");

	const isNativeLink = createMemo(
		() => tagName() === "a" && ref()?.getAttribute("href") != null,
	);

	const isNativeInteractive = createMemo(
		() => isNativeButton() || isNativeLink(),
	);

	const isClickable = createMemo(() => mergedProps.onClick != null);

	const disabled = () => mergedProps.disabled ?? false;

	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		if (disabled()) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		callHandler(e, mergedProps.onClick);
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown);

		if (disabled() || isNativeInteractive() || !isClickable()) {
			return;
		}

		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			(e.currentTarget as HTMLElement).click();
		}
	};

	const context: ChipContextValue = {
		translations: () => mergedProps.translations!,
		disabled,
	};

	return (
		<ChipContext value={context}>
			<Polymorphic<ChipRootRenderProps>
				as="span"
				ref={[setRef, mergedProps.ref]}
				disabled={isNativeButton() ? disabled() : undefined}
				role={!isNativeInteractive() && isClickable() ? "button" : undefined}
				tabindex={
					!isNativeInteractive() && isClickable() && !disabled() ? 0 : undefined
				}
				aria-disabled={!isNativeButton() && disabled() ? "true" : undefined}
				data-disabled={disabled() ? "" : undefined}
				data-clickable={isClickable() ? "" : undefined}
				onClick={onClick}
				onKeyDown={onKeyDown}
				{...others}
			/>
		</ChipContext>
	);
}
