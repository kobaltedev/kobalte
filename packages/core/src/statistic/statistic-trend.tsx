import { visuallyHiddenStyles } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { merge, omit, type ParentProps } from "solid-js";

import { createNumberFormatter } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	STATISTIC_INTL_TRANSLATIONS,
	type StatisticIntlTranslations,
} from "./statistic.intl";

export interface StatisticTrendOptions {
	/**
	 * The signed change represented by the trend, e.g. `0.025` for a 2.5%
	 * increase or `-0.025` for a 2.5% decrease. Its sign drives both
	 * `data-direction` and the generated accessible text.
	 */
	value: number;

	/**
	 * Options for formatting the absolute value of `value`.
	 * @default { style: "percent" }
	 */
	formatOptions?: Intl.NumberFormatOptions;

	/** The localized strings of the component. */
	translations?: StatisticIntlTranslations;
}

export interface StatisticTrendCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface StatisticTrendRenderProps extends StatisticTrendCommonProps {
	"data-direction": "increase" | "decrease" | "noChange";
	children: JSX.Element;
}

export type StatisticTrendProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ParentProps<StatisticTrendOptions> &
	Partial<StatisticTrendCommonProps<ElementOf<T>>>;

/**
 * Indicates the direction and magnitude of change for a `Statistic.Value`.
 *
 * Ships no icon or color — pass your own arrow/color as `children`, which
 * is treated as decorative (`aria-hidden`). An accessible sentence (e.g.
 * "increased by 2.5%") is generated from `value` and rendered as
 * visually-hidden text, so the accessible name doesn't depend on color or
 * icon shape alone.
 */
export function StatisticTrend<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StatisticTrendProps<T>>,
) {
	const mergedProps = merge(
		{
			translations: STATISTIC_INTL_TRANSLATIONS,
		},
		props as StatisticTrendProps,
	);

	const formatter = createNumberFormatter(
		() => mergedProps.formatOptions ?? { style: "percent" },
	);

	const direction = () => {
		if (mergedProps.value > 0) return "increase" as const;
		if (mergedProps.value < 0) return "decrease" as const;
		return "noChange" as const;
	};

	const accessibleText = () => {
		const translations =
			mergedProps.translations ?? STATISTIC_INTL_TRANSLATIONS;

		if (direction() === "noChange") {
			return translations.noChange;
		}

		const formattedValue = formatter().format(Math.abs(mergedProps.value));

		return `${translations[direction() as "increase" | "decrease"]} ${formattedValue}`;
	};

	const others = omit(
		mergedProps,
		"value",
		"formatOptions",
		"translations",
		"children",
	);

	return (
		<Polymorphic<StatisticTrendRenderProps>
			as="div"
			data-direction={direction()}
			{...others}
		>
			<span aria-hidden="true">{mergedProps.children}</span>
			<span style={visuallyHiddenStyles}>{accessibleText()}</span>
		</Polymorphic>
	);
}
