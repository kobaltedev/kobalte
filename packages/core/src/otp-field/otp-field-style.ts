/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2024 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/blob/main/packages/otp-field/src/lib/style.ts
 */

let styleElement: HTMLStyleElement | null = null;
let activeCount = 0;

export function createOTPFieldStyleElement(): () => void {
	activeCount += 1;
	if (!styleElement) {
		styleElement = document.createElement("style");
		document.head.appendChild(styleElement);

		const autofillStyle =
			"background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";

		styleElement.innerHTML = `
    [data-kb-otp-field-input]::selection { background: transparent !important; color: transparent !important; }
    [data-kb-otp-field-input]:autofill { ${autofillStyle} }
    [data-kb-otp-field-input]:-webkit-autofill { ${autofillStyle} }
    @supports (-webkit-touch-callout: none) { [data-kb-otp-field-input] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }
    [data-kb-otp-field-input] + * { pointer-events: all !important; }
  `;
	}

	return () => {
		activeCount -= 1;
		if (activeCount === 0 && styleElement) {
			styleElement.remove();
			styleElement = null;
		}
	};
}

export const DEFAULT_NOSCRIPT_CSS_FALLBACK = `
[data-kb-otp-field-input] {
  color: black !important;
  background-color: white !important;
  caret-color: black !important;
  letter-spacing: inherit !important;
  text-align: center !important;
  border: 1px solid black !important;
  width: 100% !important;
  font-size: inherit !important;
  clip-path: none !important;
}
`;
