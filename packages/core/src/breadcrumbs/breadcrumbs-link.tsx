/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/breadcrumbs/src/useBreadcrumbItem.ts
 */

import { Component, ValidComponent, splitProps } from "solid-js";

import * as Link from "../link";
import { PolymorphicProps } from "../polymorphic";

export interface BreadcrumbsLinkOptions extends Link.LinkRootOptions {
	/** Whether the breadcrumb link represents the current page. */
	current?: boolean;
}

export interface BreadcrumbsLinkCommonProps {
	/** Whether the breadcrumb link is disabled. */
	disabled: boolean;
	"aria-current": string | undefined;
}

export interface BreadcrumbsLinkRenderProps extends BreadcrumbsLinkCommonProps {
	"data-current": string | undefined;
}

export type BreadcrumbsLinkProps = BreadcrumbsLinkOptions &
	Partial<BreadcrumbsLinkCommonProps>;

/**
 * The breadcrumbs link.
 */
export function BreadcrumbsLink<T extends ValidComponent = "a">(
	props: PolymorphicProps<T, BreadcrumbsLinkProps>,
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
