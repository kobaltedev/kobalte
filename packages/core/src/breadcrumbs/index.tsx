import {
	type BreadcrumbsLinkCommonProps,
	type BreadcrumbsLinkOptions,
	type BreadcrumbsLinkProps,
	type BreadcrumbsLinkRenderProps,
	BreadcrumbsLink as Link,
} from "./breadcrumbs-link";
import {
	type BreadcrumbsRootOptions,
	type BreadcrumbsRootProps,
	BreadcrumbsRoot as Root,
} from "./breadcrumbs-root";
import {
	type BreadcrumbsSeparatorCommonProps,
	type BreadcrumbsSeparatorOptions,
	type BreadcrumbsSeparatorProps,
	type BreadcrumbsSeparatorRenderProps,
	BreadcrumbsSeparator as Separator,
} from "./breadcrumbs-separator";

export type {
	BreadcrumbsLinkOptions,
	BreadcrumbsLinkCommonProps,
	BreadcrumbsLinkRenderProps,
	BreadcrumbsLinkProps,
	BreadcrumbsRootOptions,
	BreadcrumbsRootProps,
	BreadcrumbsSeparatorOptions,
	BreadcrumbsSeparatorCommonProps,
	BreadcrumbsSeparatorRenderProps,
	BreadcrumbsSeparatorProps,
};
export { Link, Root, Separator };

export const Breadcrumbs = Object.assign(Root, {
	Link,
	Separator,
});

/**
 * API will most probably change
 */
export {
	useBreadcrumbsContext,
	type BreadcrumbsContextValue,
} from "./breadcrumbs-context";
