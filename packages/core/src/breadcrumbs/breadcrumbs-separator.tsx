import { OverrideComponentProps } from "@kobalte/utils";

import type { JSX, ValidComponent } from "solid-js";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useBreadcrumbsContext } from "./breadcrumbs-context";

export interface BreadcrumbsSeparatorOptions {}

export interface BreadcrumbsSeparatorCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface BreadcrumbsSeparatorRenderProps
	extends BreadcrumbsSeparatorCommonProps {
	children: JSX.Element;
	"aria-hidden": "true";
}

export type BreadcrumbsSeparatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = BreadcrumbsSeparatorOptions &
	Partial<BreadcrumbsSeparatorCommonProps<ElementOf<T>>>;

/**
 * The visual separator between each breadcrumb items.
 * It will not be visible by screen readers.
 */
export function BreadcrumbsSeparator<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, BreadcrumbsSeparatorProps<T>>,
) {
	const context = useBreadcrumbsContext();

	return (
		<Polymorphic<BreadcrumbsSeparatorRenderProps>
			as="span"
			aria-hidden="true"
			{...(props as BreadcrumbsSeparatorProps)}
		>
			{context.separator()}
		</Polymorphic>
	);
}
