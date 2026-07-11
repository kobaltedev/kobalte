/*
 * Portions of this file are based on code from mui/material-ui.
 * MIT License, Copyright (c) 2018 Google, Inc.
 *
 * Credits to the MUI team:
 * https://github.com/mui/material-ui/blob/master/packages/mui-joy/src/Divider/Divider.tsx
 */

import { mergeDefaultProps, mergeRefs, type Orientation } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createSignal, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createTagName } from "../primitives";

export interface DividerRootOptions {
	/** The orientation of the divider. */
	orientation?: Orientation;

	/**
	 * Shrink or stretch the line based on the orientation.
	 * This is exposed as a `data-inset` attribute so consuming CSS can
	 * react to it (e.g. to align the divider with surrounding content).
	 */
	inset?: "none" | "context" | (string & {});
}

export interface DividerRootCommonProps<T extends HTMLElement = HTMLElement> {
	ref: T | ((el: T) => void);
}

export interface DividerRootRenderProps extends DividerRootCommonProps {
	role: "separator" | undefined;
	"aria-orientation": "vertical" | undefined;
	"data-orientation": Orientation | undefined;
	"data-inset": string | undefined;
}

export type DividerRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DividerRootOptions & Partial<DividerRootCommonProps<ElementOf<T>>>;

/**
 * A thin line, with optional content (e.g. text or an icon), that groups
 * content in lists and layouts.
 */
export function DividerRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DividerRootProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement | undefined>(undefined, {
		ownedWrite: true,
	});

	const mergedProps = mergeDefaultProps(
		{
			orientation: "horizontal",
		},
		props as DividerRootProps,
	);

	const others = omit(mergedProps, "ref", "orientation", "inset");

	const tagName = createTagName(ref, () => "div");

	return (
		<Polymorphic<DividerRootRenderProps>
			as="div"
			ref={mergeRefs(setRef, mergedProps.ref)}
			role={tagName() !== "hr" ? "separator" : undefined}
			aria-orientation={
				mergedProps.orientation === "vertical" ? "vertical" : undefined
			}
			data-orientation={mergedProps.orientation}
			data-inset={mergedProps.inset}
			{...others}
		/>
	);
}
