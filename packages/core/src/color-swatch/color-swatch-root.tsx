import { mergeDefaultProps } from "@kobalte/utils";
import { combineStyle } from "@solid-primitives/props";
import {
	type JSX,
	type ValidComponent,
	createUniqueId,
	splitProps,
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

	const [local, others] = splitProps(mergedProps, [
		"style",
		"value",
		"colorName",
		"aria-label",
		"translations",
	]);

	const ariaLabel = () => {
		const colorName =
			local.colorName ??
			(local.value.getChannelValue("alpha") === 0
				? local.translations.transparent
				: local.value.getColorName(COLOR_INTL_TRANSLATIONS));

		return [colorName, local["aria-label"]].filter(Boolean).join(", ");
	};

	return (
		<Polymorphic<ColorSwatchRootRenderProps>
			as="div"
			role="img"
			aria-roledescription={local.translations.roleDescription}
			aria-label={ariaLabel()}
			style={combineStyle(
				{
					"background-color": local.value.toString("css"),
					"forced-color-adjust": "none",
				},
				local.style,
			)}
			{...others}
		/>
	);
}
