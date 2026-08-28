/**
 * Color utilities used by the color components.
 */

export type {
	Color,
	ColorAxes,
	ColorChannel,
	ColorChannelRange,
	ColorFormat,
	ColorIntlTranslations,
	ColorSpace,
} from "@solid-primitives/utils/colors";
export {
	COLOR_INTL_TRANSLATIONS,
	colorScale,
	colorToOKLCH,
	complement,
	contrastRatio,
	darken,
	desaturate,
	detectColorFormat,
	getColorChannels,
	isReadable,
	isValidColor,
	lighten,
	mix,
	normalizeColor,
	normalizeHue,
	parseColor,
	perceptualColorScale,
	saturate,
	tryParseColor,
} from "@solid-primitives/utils/colors";
