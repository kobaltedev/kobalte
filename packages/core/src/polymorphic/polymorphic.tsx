/* @refresh reload */

import type { OverrideProps } from "@kobalte/utils";
import {
	type ComponentProps,
	type JSX,
	type ValidComponent,
	splitProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";

export type { OverrideComponentProps, OverrideProps } from "@kobalte/utils";

/* -------------------------------------------------------------------------------------------------
 * Polymorphic
 * -----------------------------------------------------------------------------------------------*/

export type ElementOf<T> = T extends HTMLElement
	? T
	: T extends keyof HTMLElementTagNameMap
		? HTMLElementTagNameMap[T]
		: any;

/**
 * Polymorphic attribute.
 */
export interface PolymorphicAttributes<T extends ValidComponent> {
	as?: T | keyof JSX.HTMLElementTags;
}

/**
 * Props used by a polymorphic component.
 */
export type PolymorphicProps<
	T extends ValidComponent,
	Props extends {} = {},
> = OverrideProps<
	ComponentProps<T>, // Override props from custom/tag component with our own
	Props & // Accept custom props of our own component
		PolymorphicAttributes<T>
>;

/**
 * Helper type to get the exact props in Polymnorphic `as` callback.
 */
export type PolymorphicCallbackProps<
	CustomProps extends {},
	Options extends {},
	RenderProps extends {},
> = Omit<CustomProps, keyof Options | keyof RenderProps> & RenderProps;

/**
 * A utility component that render its `as` prop.
 */
export function Polymorphic<RenderProps>(
	props: RenderProps & PolymorphicAttributes<ValidComponent>,
): JSX.Element {
	const [local, others] = splitProps(props, ["as"]);

	if (!local.as) {
		throw new Error(
			"[kobalte]: Polymorphic is missing the required `as` prop.",
		);
	}

	return (
		// @ts-ignore: Props are valid but not worth calculating
		<Dynamic {...others} component={local.as} />
	);
}
