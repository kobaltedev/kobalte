/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/badge/src/Badge.tsx
 */

import { type ValidComponent, splitProps } from "solid-js";
import { Polymorphic, type PolymorphicProps } from "../polymorphic";

export interface BadgeRootOptions {
	/**
	 * Accessible text description of the badge if child is not text.
	 */
	textValue?: string;
}

export interface BadgeRootCommonProps<T extends HTMLElement = HTMLElement> {
	"aria-label"?: string;
}

export interface BadgeRootRenderProps extends BadgeRootCommonProps {}

export type BadgeRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = BadgeRootOptions & Partial<BadgeRootCommonProps>;

export function BadgeRoot<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, BadgeRootProps<T>>,
) {
	const [local, others] = splitProps(props, ["textValue"]);

	return (
		<Polymorphic<BadgeRootRenderProps>
			as="span"
			role="status"
			aria-label={local.textValue}
			{...others}
		>
			{others.children}
		</Polymorphic>
	);
}
