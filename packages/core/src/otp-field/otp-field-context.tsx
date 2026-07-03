/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/blob/main/packages/otp-field/src/context.ts
 */

import {
	type Accessor,
	createContext,
	type Setter,
	useContext,
} from "solid-js";

export interface OTPFieldContextValue {
	value: Accessor<string>;
	isFocused: Accessor<boolean>;
	isHovered: Accessor<boolean>;
	isInserting: Accessor<boolean>;
	maxLength: Accessor<number>;
	activeSlots: Accessor<number[]>;
	shiftPWManagers: Accessor<boolean>;
	rootHeight: Accessor<number | null>;
	generateId: (part: string) => string;
	setValue: (value: string) => void;
	setIsFocused: Setter<boolean>;
	setIsHovered: Setter<boolean>;
	setIsInserting: Setter<boolean>;
	setActiveSlots: Setter<number[]>;
}

export const OTPFieldContext = createContext<OTPFieldContextValue>();

export function useOTPFieldContext() {
	const context = useContext(OTPFieldContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useOTPFieldContext` must be used within an `OTPField` component",
		);
	}

	return context;
}
