import type { InputMode } from "./types";

export const getValueBeforeInput = (event: InputEvent) => {
	const { selectionStart, selectionEnd, value } =
		event.currentTarget as HTMLInputElement;
	return (
		value.slice(0, selectionStart!) +
		(event as any).data +
		value.slice(selectionEnd!)
	);
};

const REGEX = {
	numeric: /^[0-9]+$/,
	alphabetic: /^[A-Za-z]+$/,
	alphanumeric: /^[a-zA-Z0-9]+$/i,
};

export const isValidType = (value: string, inputMode: InputMode) => {
	if (!inputMode) {
		return true;
	}
	return !!REGEX[inputMode]?.test(value);
};

export const isValidValue = (
	value: string,
	inputMode: InputMode,
	pattern?: string,
) => {
	if (!pattern) {
		return isValidType(value, inputMode);
	}
	const regex = new RegExp(pattern, "g");
	return regex.test(value);
};
