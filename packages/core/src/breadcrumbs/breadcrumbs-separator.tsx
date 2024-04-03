import { OverrideComponentProps } from "@kobalte/utils";

import { JSX, ValidComponent } from "solid-js";
import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { useBreadcrumbsContext } from "./breadcrumbs-context";

export interface BreadcrumbsSeparatorOptions {}

export interface BreadcrumbsSeparatorCommonProps {}

export interface BreadcrumbsSeparatorRenderProps
	extends BreadcrumbsSeparatorCommonProps {
	children: JSX.Element;
	"aria-hidden": "true";
}

export type BreadcrumbsSeparatorProps = BreadcrumbsSeparatorOptions &
	Partial<BreadcrumbsSeparatorCommonProps>;

/**
 * The visual separator between each breadcrumb items.
 * It will not be visible by screen readers.
 */
export function BreadcrumbsSeparator<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, BreadcrumbsSeparatorProps>,
) {
	const context = useBreadcrumbsContext();

	return (
		<Polymorphic<BreadcrumbsSeparatorRenderProps>
			as="span"
			children={context.separator()}
			aria-hidden="true"
			{...(props as BreadcrumbsSeparatorProps)}
		/>
	);
}
