/*
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the ariakit team:
 * https://github.com/ariakit/ariakit/blob/8a13899ff807bbf39f3d89d2d5964042ba4d5287/packages/ariakit-react-utils/src/hooks.ts
 */

import { isString } from "@kobalte/utils";
import {
	type Accessor,
	type Component,
	createEffect,
	createSignal,
} from "solid-js";

/**
 * Returns the tag name by parsing an element ref.
 * @example
 * function Component(props) {
 *   let ref: HTMLDivElement | undefined;
 *   const tagName = createTagName(() => ref, () => "button"); // div
 *   return <div ref={ref} {...props} />;
 * }
 */
export function createTagName(
	ref: Accessor<HTMLElement | undefined>,
	fallback?: Accessor<string | Component | undefined>,
) {
	const [tagName, setTagName] = createSignal(stringOrUndefined(fallback?.()));

	createEffect(() => {
		setTagName(ref()?.tagName.toLowerCase() || stringOrUndefined(fallback?.()));
	});

	return tagName;
}

function stringOrUndefined(value: any) {
	return isString(value) ? value : undefined;
}
