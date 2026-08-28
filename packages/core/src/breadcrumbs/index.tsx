import {
	type BreadcrumbsLinkCommonProps,
	type BreadcrumbsLinkOptions,
	type BreadcrumbsLinkProps,
	type BreadcrumbsLinkRenderProps,
	BreadcrumbsLink as Link,
} from "./breadcrumbs-link.tsx";
import {
	type BreadcrumbsRootOptions,
	type BreadcrumbsRootProps,
	BreadcrumbsRoot as Root,
} from "./breadcrumbs-root.tsx";
import {
	type BreadcrumbsSeparatorCommonProps,
	type BreadcrumbsSeparatorOptions,
	type BreadcrumbsSeparatorProps,
	type BreadcrumbsSeparatorRenderProps,
	BreadcrumbsSeparator as Separator,
} from "./breadcrumbs-separator.tsx";

export type {
	BreadcrumbsLinkCommonProps,
	BreadcrumbsLinkOptions,
	BreadcrumbsLinkProps,
	BreadcrumbsLinkRenderProps,
	BreadcrumbsRootOptions,
	BreadcrumbsRootProps,
	BreadcrumbsSeparatorCommonProps,
	BreadcrumbsSeparatorOptions,
	BreadcrumbsSeparatorProps,
	BreadcrumbsSeparatorRenderProps,
};
export { Link, Root, Separator };

export const Breadcrumbs = Object.assign(Root, {
	Link,
	Separator,
});

/**
 * API will most change
 */
export {
	type BreadcrumbsContextValue,
	useBreadcrumbsContext,
} from "./breadcrumbs-context.tsx";
