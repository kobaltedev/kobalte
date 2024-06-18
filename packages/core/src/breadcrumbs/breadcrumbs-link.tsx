/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/breadcrumbs/src/useBreadcrumbItem.ts
 */

import { type Component, type ValidComponent, splitProps } from "solid-js";

import * as Link from "../link";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

export interface BreadcrumbsLinkOptions {
	/** Whether the breadcrumb link represents the current page. */
	current?: boolean;
}

export interface BreadcrumbsLinkCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	/** Whether the breadcrumb link is disabled. */
	disabled: boolean;
	"aria-current": string | undefined;
}

export interface BreadcrumbsLinkRenderProps extends BreadcrumbsLinkCommonProps {
	"data-current": string | undefined;
}

export type BreadcrumbsLinkProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = BreadcrumbsLinkOptions & Partial<BreadcrumbsLinkCommonProps<ElementOf<T>>>;

/**
 * The breadcrumbs link.
 */
export function BreadcrumbsLink<T extends ValidComponent = "a">(
	props: PolymorphicProps<T, BreadcrumbsLinkProps<T>>,
) {
	const [local, others] = splitProps(props as BreadcrumbsLinkProps, [
		"current",
		"disabled",
		"aria-current",
	]);

	const ariaCurrent = () => {
		if (!local.current) {
			return undefined;
		}

		return local["aria-current"] || "page";
	};

	return (
		<Link.Root<
			Component<
				Omit<BreadcrumbsLinkRenderProps, keyof Link.LinkRootRenderProps>
			>
		>
			disabled={local.disabled || local.current}
			aria-current={ariaCurrent()}
			data-current={local.current ? "" : undefined}
			{...others}
		/>
	);
}
