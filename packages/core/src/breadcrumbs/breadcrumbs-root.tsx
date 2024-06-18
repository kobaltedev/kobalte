/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/breadcrumbs/src/useBreadcrumbs.ts
 */

import { mergeDefaultProps } from "@kobalte/utils";
import { type JSX, type ValidComponent, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	BreadcrumbsContext,
	type BreadcrumbsContextValue,
} from "./breadcrumbs-context";
import {
	BREADCRUMBS_INTL_TRANSLATIONS,
	type BreadcrumbsIntlTranslations,
} from "./breadcrumbs.intl";

export interface BreadcrumbsRootOptions {
	/**
	 * The visual separator between each breadcrumb item.
	 * It will be used as the default children of `Breadcrumbs.Separator`.
	 */
	separator?: string | JSX.Element;

	/** The localized strings of the component. */
	translations?: BreadcrumbsIntlTranslations;
}

export interface BreadcrumbsRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface BreadcrumbsRootRenderProps extends BreadcrumbsRootCommonProps {
	"aria-label": string;
}

export type BreadcrumbsRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = BreadcrumbsRootOptions & Partial<BreadcrumbsRootCommonProps<ElementOf<T>>>;

/**
 * Breadcrumbs show hierarchy and navigational context for a user’s location within an application.
 */
export function BreadcrumbsRoot<T extends ValidComponent = "nav">(
	props: PolymorphicProps<T, BreadcrumbsRootProps<T>>,
) {
	const mergedProps = mergeDefaultProps(
		{
			separator: "/",
			translations: BREADCRUMBS_INTL_TRANSLATIONS,
		},
		props as BreadcrumbsRootProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"separator",
		"translations",
	]);

	const context: BreadcrumbsContextValue = {
		separator: () => local.separator,
	};

	return (
		<BreadcrumbsContext.Provider value={context}>
			<Polymorphic<BreadcrumbsRootRenderProps>
				as="nav"
				aria-label={local.translations.breadcrumbs}
				{...others}
			/>
		</BreadcrumbsContext.Provider>
	);
}
