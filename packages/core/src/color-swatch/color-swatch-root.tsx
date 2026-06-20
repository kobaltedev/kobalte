import { mergeDefaultProps } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type JSX,
	type ValidComponent,
	createUniqueId,
	omit,
} from "solid-js";
import { COLOR_INTL_TRANSLATIONS } from "../colors";
import type { Color } from "../colors";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	COLOR_SWATCH_INTL_TRANSLATIONS,
	type ColorSwatchIntlTranslations,
} from "./color-swatch.intl";

export interface ColorSwatchRootOptions {
	/** The color value to display in the swatch. */
	value: Color;

	/**
	 * A localized accessible name for the color.
	 * By default, a description is generated from the color value,
	 * but this can be overridden if you have a more specific color
	 * name (e.g. Pantone colors).
	 */
	colorName?: string;

	/** The localized strings of the component. */
	translations?: ColorSwatchIntlTranslations;
}

export interface ColorSwatchRootCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	style?: JSX.CSSProperties | string;
	"aria-label"?: string;
}

export interface ColorSwatchRootRenderProps extends ColorSwatchRootCommonProps {
	role: "img";
}

export type ColorSwatchRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ColorSwatchRootOptions & Partial<ColorSwatchRootCommonProps<ElementOf<T>>>;

export function ColorSwatchRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ColorSwatchRootProps<T>>,
) {
	const defaultId = `colorswatch-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{ id: defaultId, translations: COLOR_SWATCH_INTL_TRANSLATIONS },
		props as ColorSwatchRootProps,
	);

	const others = omit(mergedProps, "style", "value", "colorName", "aria-label", "translations");

	const ariaLabel = () => {
		const colorName =
			mergedProps.colorName ??
			(mergedProps.value.getChannelValue("alpha") === 0
				? mergedProps.translations.transparent
				: mergedProps.value.getColorName(COLOR_INTL_TRANSLATIONS));

		return [colorName, mergedProps["aria-label"]].filter(Boolean).join(", ");
	};

	return (
		<Polymorphic<ColorSwatchRootRenderProps>
			as="div"
			role="img"
			aria-roledescription={mergedProps.translations.roleDescription}
			aria-label={ariaLabel()}
			style={combineStyle(
				{
					"background-color": mergedProps.value.toString("css"),
					"forced-color-adjust": "none",
				},
				mergedProps.style,
			)}
			{...others}
		/>
	);
}
