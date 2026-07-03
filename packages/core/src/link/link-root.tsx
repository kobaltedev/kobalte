/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/link/src/useLink.ts
 */

import { mergeRefs } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createSignal, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createTagName } from "../primitives";

export interface LinkRootOptions {
	/** Whether the link is disabled. */
	disabled?: boolean;
}

export interface LinkRootCommonProps<T extends HTMLElement = HTMLElement> {
	ref: T | ((el: T) => void);
	href: string | undefined;
}

export interface LinkRootRenderProps extends LinkRootCommonProps {
	role: "link" | undefined;
	tabindex: number | undefined;
	"aria-disabled": "true" | undefined;
	"data-disabled": string | undefined;
}

export type LinkRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = LinkRootOptions & Partial<LinkRootCommonProps<ElementOf<T>>>;

/**
 * Link allows a user to navigate to another page or resource within a web page or application.
 */
export function LinkRoot<T extends ValidComponent = "a">(
	props: PolymorphicProps<T, LinkRootProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const others = omit(props as LinkRootProps, "ref", "href", "disabled");

	const tagName = createTagName(ref, () => "a");

	return (
		<Polymorphic<LinkRootRenderProps>
			as="a"
			ref={mergeRefs(setRef, (props as LinkRootProps).ref)}
			role={tagName() !== "a" || props.disabled ? "link" : undefined}
			tabindex={tagName() !== "a" && !props.disabled ? 0 : undefined}
			href={!props.disabled ? props.href : undefined}
			aria-disabled={props.disabled ? "true" : undefined}
			data-disabled={props.disabled ? "" : undefined}
			{...others}
		/>
	);
}
