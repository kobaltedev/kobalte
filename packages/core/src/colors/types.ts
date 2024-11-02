/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/68e305768cb829bab7b9836dded593bd731259f3/packages/%40react-types/color/src/index.d.ts
 *
 */

import type { ColorIntlTranslations } from "./intl";

/** A list of supported color formats. */
export type ColorFormat =
	| "hex"
	| "hexa"
	| "rgb"
	| "rgba"
	| "hsl"
	| "hsla"
	| "hsb"
	| "hsba";

export type ColorSpace = "rgb" | "hsl" | "hsb";

/** A list of color channels. */
export type ColorChannel =
	| "hue"
	| "saturation"
	| "brightness"
	| "lightness"
	| "red"
	| "green"
	| "blue"
	| "alpha";

export type ColorAxes = {
	xChannel: ColorChannel;
	yChannel: ColorChannel;
	zChannel: ColorChannel;
};

export interface ColorChannelRange {
	/** The minimum value of the color channel. */
	minValue: number;
	/** The maximum value of the color channel. */
	maxValue: number;
	/** The step value of the color channel, used when incrementing and decrementing. */
	step: number;
	/** The page step value of the color channel, used when incrementing and decrementing. */
	pageSize: number;
}

/** Represents a color value. */
export interface Color {
	/** Converts the color to the given color format, and returns a new Color object. */
	toFormat(format: ColorFormat): Color;
	/** Converts the color to a string in the given format. */
	toString(format?: ColorFormat | "css"): string;
	/** Returns a duplicate of the color value. */
	clone(): Color;
	/** Converts the color to hex, and returns an integer representation. */
	toHexInt(): number;
	/**
	 * Returns the numeric value for a given channel.
	 * Throws an error if the channel is unsupported in the current color format.
	 */
	getChannelValue(channel: ColorChannel): number;
	/**
	 * Sets the numeric value for a given channel, and returns a new Color object.
	 * Throws an error if the channel is unsupported in the current color format.
	 */
	withChannelValue(channel: ColorChannel, value: number): Color;
	/**
	 * Returns the minimum, maximum, and step values for a given channel.
	 */
	getChannelRange(channel: ColorChannel): ColorChannelRange;
	/**
	 * Returns a localized color channel name for a given channel and locale,
	 * for use in visual or accessibility labels.
	 */
	getChannelName(
		channel: ColorChannel,
		translations: ColorIntlTranslations,
	): string;
	/**
	 * Returns the number formatting options for the given channel.
	 */
	getChannelFormatOptions(channel: ColorChannel): Intl.NumberFormatOptions;
	/**
	 * Formats the numeric value for a given channel for display according to the provided locale.
	 */
	formatChannelValue(channel: ColorChannel): string;
	/**
	 * Returns the color space, 'rgb', 'hsb' or 'hsl', for the current color.
	 */
	getColorSpace(): ColorSpace;
	/**
	 * Returns the color space axes, xChannel, yChannel, zChannel.
	 */
	getColorSpaceAxes(xyChannels: {
		xChannel?: ColorChannel;
		yChannel?: ColorChannel;
	}): ColorAxes;
	/**
	 * Returns an array of the color channels within the current color space space.
	 */
	getColorChannels(): [ColorChannel, ColorChannel, ColorChannel];
	/**
	 * Returns a localized name for the color, for use in visual or accessibility labels.
	 */
	getColorName(translations: ColorIntlTranslations): string;
	/**
	 * Returns a localized name for the hue, for use in visual or accessibility labels.
	 */
	getHueName(translations: ColorIntlTranslations): string;
}
