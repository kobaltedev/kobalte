export type InputMode = "numeric" | "alphabetic" | "alphanumeric" | undefined;

export type InvalidDetails = {
	value: string;
	focusedIndex: number;
};

export type ValueChangeDetails = {
	values: string[];
	valueAsString: string;
};

export type ValueCompleteDetails = {
	values: string[];
	valueAsString: string;
};

export type PinInputRootOptions = {
	autoFocus?: boolean;
	defaultValue?: string[];
	disabled?: boolean;
	mask?: boolean;
	otp?: boolean;
	pattern?: string;
	placeholder?: string;
	readOnly?: boolean;
	inputMode?: InputMode;
	value?: string[];
	onValueChange?: (details: ValueChangeDetails) => void;
	onValueComplete?: (details: ValueCompleteDetails) => void;
	onValueInvalid?: (value: InvalidDetails) => void;
};
