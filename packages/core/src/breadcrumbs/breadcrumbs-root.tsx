/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/@react-aria/breadcrumbs/src/useBreadcrumbs.ts
 */

import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import {
	BreadcrumbsContext,
	BreadcrumbsContextValue,
} from "./breadcrumbs-context";
import {
	BREADCRUMBS_INTL_TRANSLATIONS,
	BreadcrumbsIntlTranslations,
} from "./breadcrumbs.intl";

export interface BreadcrumbsRootOptions extends AsChildProp {
	/**
	 * The visual separator between each breadcrumb item.
	 * It will be used as the default children of `Breadcrumbs.Separator`.
	 */
	separator?: string | JSX.Element;

	/** The localized strings of the component. */
	translations?: BreadcrumbsIntlTranslations;
}

export interface BreadcrumbsRootProps
	extends OverrideComponentProps<"nav", BreadcrumbsRootOptions> {}

/**
 * Breadcrumbs show hierarchy and navigational context for a user’s location within an application.
 */
export function BreadcrumbsRoot(props: BreadcrumbsRootProps) {
	const mergedProps = mergeDefaultProps(
		{
			separator: "/",
			translations: BREADCRUMBS_INTL_TRANSLATIONS,
		},
		props,
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
			<Polymorphic
				as="nav"
				aria-label={local.translations?.breadcrumbs}
				{...others}
			/>
		</BreadcrumbsContext.Provider>
	);
}
