/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/badge/src/Badge.tsx
 */

import type { ValidComponent } from "@solidjs/web";
import { omit } from "solid-js";
import { Polymorphic, type PolymorphicProps } from "../polymorphic";

export interface BadgeRootOptions {
	/**
	 * Accessible text description of the badge if child is not text.
	 */
	textValue?: string;
}

export interface BadgeRootCommonProps {
	"aria-label"?: string;
}

export interface BadgeRootRenderProps extends BadgeRootCommonProps {
	role: "status";
}

export type BadgeRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = BadgeRootOptions & Partial<BadgeRootCommonProps>;

export function BadgeRoot<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, BadgeRootProps<T>>,
) {
	const others = omit(props as BadgeRootProps, "textValue", "aria-label");

	return (
		<Polymorphic<BadgeRootRenderProps>
			as="span"
			role="status"
			aria-label={(props as BadgeRootProps)["aria-label"] ?? props.textValue}
			{...others}
		/>
	);
}
