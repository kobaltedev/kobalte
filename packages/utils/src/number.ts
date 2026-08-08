/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/7638f4d671e32b7aa2db110a875fe48f24b68fd0/packages/react-stately/src/utils/number.ts
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

export function roundToStepPrecision(value: number, step: number): number {
	let precision = 0;
	const stepString = step.toString();
	// Handle negative exponents in exponential notation (e.g., "1e-7" → precision 8)
	const eIndex = stepString.toLowerCase().indexOf("e-");
	if (eIndex > 0) {
		precision = Math.abs(Math.floor(Math.log10(Math.abs(step)))) + eIndex;
	} else {
		const pointIndex = stepString.indexOf(".");
		if (pointIndex >= 0) {
			precision = stepString.length - pointIndex;
		}
	}
	if (precision > 0) {
		const pow = 10 ** precision;
		value = Math.round(value * pow) / pow;
	}
	return value;
}

export function snapValueToStep(
	value: number,
	min: number | undefined,
	max: number | undefined,
	step: number,
): number {
	min = Number(min);
	max = Number(max);
	const remainder = (value - (Number.isNaN(min) ? 0 : min)) % step;
	let snappedValue = roundToStepPrecision(
		Math.abs(remainder) * 2 >= step
			? value + Math.sign(remainder) * (step - Math.abs(remainder))
			: value - remainder,
		step,
	);

	if (!Number.isNaN(min)) {
		if (snappedValue < min) {
			snappedValue = min;
		} else if (!Number.isNaN(max) && snappedValue > max) {
			snappedValue =
				min + Math.floor(roundToStepPrecision((max - min) / step, step)) * step;
		}
	} else if (!Number.isNaN(max) && snappedValue > max) {
		snappedValue = Math.floor(roundToStepPrecision(max / step, step)) * step;
	}

	// correct floating point behavior by rounding to step precision
	snappedValue = roundToStepPrecision(snappedValue, step);

	return snappedValue;
}
