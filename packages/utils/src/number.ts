/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/ff3e690fffc6c54367b8057e28a0e5b9211f37b5/packages/@react-stately/utils/src/number.ts
 */

/**
 * Takes a value and forces it to the closest min/max if it's outside. Also forces it to the closest valid step.
 */
export function clamp(
	value: number,
	min = Number.NEGATIVE_INFINITY,
	max = Number.POSITIVE_INFINITY,
): number {
	return Math.min(Math.max(value, min), max);
}

export function snapValueToStep(
	value: number,
	min: number,
	max: number,
	step: number,
): number {
	const remainder = (value - (Number.isNaN(min) ? 0 : min)) % step;
	let snappedValue =
		Math.abs(remainder) * 2 >= step
			? value + Math.sign(remainder) * (step - Math.abs(remainder))
			: value - remainder;

	if (!Number.isNaN(min)) {
		if (snappedValue < min) {
			snappedValue = min;
		} else if (!Number.isNaN(max) && snappedValue > max) {
			snappedValue = min + Math.floor((max - min) / step) * step;
		}
	} else if (!Number.isNaN(max) && snappedValue > max) {
		snappedValue = Math.floor(max / step) * step;
	}

	// correct floating point behavior by rounding to step precision
	const string = step.toString();
	const index = string.indexOf(".");
	const precision = index >= 0 ? string.length - index : 0;

	if (precision > 0) {
		const pow = 10 ** precision;
		snappedValue = Math.round(snappedValue * pow) / pow;
	}

	return snappedValue;
}

export const getPrecision = (n: number) => {
	let e = 1;
	let precision = 0;
	while (Math.round(n * e) / e !== n) {
		e *= 10;
		precision++;
	}

	return precision;
};
