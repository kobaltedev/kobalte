import type { JSX, ValidComponent } from "@solidjs/web";
import { omit, type ParentProps } from "solid-js";

import { createNumberFormatter } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface StatisticValueOptions {
	/** The numeric value to display, formatted for the current locale. */
	value?: number;

	/**
	 * Options for formatting `value`.
	 * @default {}
	 */
	formatOptions?: Intl.NumberFormatOptions;
}

export interface StatisticValueCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	"aria-live": "polite";
	"aria-atomic": "true";
}

export interface StatisticValueRenderProps extends StatisticValueCommonProps {
	children: JSX.Element;
}

export type StatisticValueProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ParentProps<StatisticValueOptions> &
	Partial<StatisticValueCommonProps<ElementOf<T>>>;

/**
 * The statistic's value. Rendered as a `polite` live region so updates
 * (e.g. a value refreshed from a real-time data source) are announced to
 * screen reader users without stealing focus.
 *
 * Formats `value` for the current locale via `formatOptions`. Pass
 * children directly instead when the value can't be expressed as an
 * `Intl.NumberFormat` (e.g. a custom unit) — children take precedence.
 */
export function StatisticValue<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StatisticValueProps<T>>,
) {
	const p = props as StatisticValueProps;

	const formatter = createNumberFormatter(() => p.formatOptions ?? {});

	const content = () =>
		p.children ?? (p.value != null ? formatter().format(p.value) : undefined);

	const others = omit(p, "value", "formatOptions", "children");

	return (
		<Polymorphic<StatisticValueRenderProps>
			as="div"
			aria-live="polite"
			aria-atomic="true"
			{...others}
		>
			{content()}
		</Polymorphic>
	);
}
