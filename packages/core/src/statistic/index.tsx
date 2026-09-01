import {
	StatisticDescription as Description,
	type StatisticDescriptionCommonProps,
	type StatisticDescriptionOptions,
	type StatisticDescriptionProps,
	type StatisticDescriptionRenderProps,
} from "./statistic-description";
import {
	StatisticLabel as Label,
	type StatisticLabelCommonProps,
	type StatisticLabelOptions,
	type StatisticLabelProps,
	type StatisticLabelRenderProps,
} from "./statistic-label";
import {
	StatisticRoot as Root,
	type StatisticRootCommonProps,
	type StatisticRootOptions,
	type StatisticRootProps,
	type StatisticRootRenderProps,
} from "./statistic-root";
import {
	type StatisticTrendCommonProps,
	type StatisticTrendOptions,
	type StatisticTrendProps,
	type StatisticTrendRenderProps,
	StatisticTrend as Trend,
} from "./statistic-trend";
import {
	type StatisticValueCommonProps,
	type StatisticValueOptions,
	type StatisticValueProps,
	type StatisticValueRenderProps,
	StatisticValue as Value,
} from "./statistic-value";

export type {
	StatisticDescriptionCommonProps,
	StatisticDescriptionOptions,
	StatisticDescriptionProps,
	StatisticDescriptionRenderProps,
	StatisticLabelCommonProps,
	StatisticLabelOptions,
	StatisticLabelProps,
	StatisticLabelRenderProps,
	StatisticRootCommonProps,
	StatisticRootOptions,
	StatisticRootProps,
	StatisticRootRenderProps,
	StatisticTrendCommonProps,
	StatisticTrendOptions,
	StatisticTrendProps,
	StatisticTrendRenderProps,
	StatisticValueCommonProps,
	StatisticValueOptions,
	StatisticValueProps,
	StatisticValueRenderProps,
};

export { Description, Label, Root, Trend, Value };

export const Statistic = Object.assign(Root, {
	Description,
	Label,
	Trend,
	Value,
});

export {
	STATISTIC_INTL_TRANSLATIONS,
	type StatisticIntlTranslations,
} from "./statistic.intl";
export {
	type StatisticContextValue,
	useStatisticContext,
} from "./statistic-context";
