/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/utils/src/isVirtualEvent.ts
 */

// Original licensing for the following method can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/facebook/react/blob/3c713d513195a53788b3f8bb4b70279d68b15bcc/packages/react-interactions/events/src/dom/shared/index.js#L74-L87

import { isAndroid } from "./platform";

// Keyboards, Assistive Technologies, and element.click() all produce a "virtual"
// click event. This is a method of inferring such clicks. Every browser except
// IE 11 only sets a zero value of "detail" for click events that are "virtual".
// However, IE 11 uses a zero value for all click events. For IE 11 we rely on
// the quirk that it produces click events that are of type PointerEvent, and
// where only the "virtual" click lacks a pointerType field.

export function isVirtualClick(event: MouseEvent | PointerEvent): boolean {
	// JAWS/NVDA with Firefox.
	if ((event as any).mozInputSource === 0 && event.isTrusted) {
		return true;
	}

	// Android TalkBack's detail value varies depending on the event listener providing the event so we have specific logic here instead
	// If pointerType is defined, event is from a click listener. For events from mousedown listener, detail === 0 is a sufficient check
	// to detect TalkBack virtual clicks.
	if (isAndroid() && (event as PointerEvent).pointerType) {
		return event.type === "click" && event.buttons === 1;
	}

	return event.detail === 0 && !(event as PointerEvent).pointerType;
}

export function isVirtualPointerEvent(event: PointerEvent) {
	// If the pointer size is zero, then we assume it's from a screen reader.
	// Android TalkBack double tap will sometimes return a event with width and height of 1
	// and pointerType === 'mouse' so we need to check for a specific combination of event attributes.
	// Cannot use "event.pressure === 0" as the sole check due to Safari pointer events always returning pressure === 0
	// instead of .5, see https://bugs.webkit.org/show_bug.cgi?id=206216. event.pointerType === 'mouse' is to distingush
	// Talkback double tap from Windows Firefox touch screen press
	return (
		(event.width === 0 && event.height === 0) ||
		(event.width === 1 &&
			event.height === 1 &&
			event.pressure === 0 &&
			event.detail === 0 &&
			event.pointerType === "mouse")
	);
}
