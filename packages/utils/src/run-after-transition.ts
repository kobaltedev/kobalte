/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/utils/src/runAfterTransition.ts
 */

// We store a global list of elements that are currently transitioning,
// mapped to a set of CSS properties that are transitioning for that element.
// This is necessary rather than a simple count of transitions because of browser
// bugs, e.g. Chrome sometimes fires both transitionend and transitioncancel rather
// than one or the other. So we need to track what's actually transitioning so that
// we can ignore these duplicate events.
const transitionsByElement = new Map<EventTarget, Set<string>>();

// A list of callbacks to call once there are no transitioning elements.
const transitionCallbacks = new Set<() => void>();

function setupGlobalEvents() {
	if (typeof window === "undefined") {
		return;
	}

	const onTransitionStart = (e: TransitionEvent) => {
		if (!e.target) {
			return;
		}

		// Add the transitioning property to the list for this element.
		let transitions = transitionsByElement.get(e.target);
		if (!transitions) {
			transitions = new Set();
			transitionsByElement.set(e.target, transitions);

			// The transitioncancel event must be registered on the element itself, rather than as a global
			// event. This enables us to handle when the node is deleted from the document while it is transitioning.
			// In that case, the cancel event would have nowhere to bubble to, so we need to handle it directly.
			e.target.addEventListener(
				"transitioncancel",
				onTransitionEnd as EventListener,
			);
		}

		transitions.add(e.propertyName);
	};

	const onTransitionEnd = (e: TransitionEvent) => {
		if (!e.target) {
			return;
		}

		// Remove property from list of transitioning properties.
		const properties = transitionsByElement.get(e.target);
		if (!properties) {
			return;
		}

		properties.delete(e.propertyName);

		// If empty, remove transitioncancel event, and remove the element from the list of transitioning elements.
		if (properties.size === 0) {
			e.target.removeEventListener(
				"transitioncancel",
				onTransitionEnd as EventListener,
			);
			transitionsByElement.delete(e.target);
		}

		// If no transitioning elements, call all the queued callbacks.
		if (transitionsByElement.size === 0) {
			for (const cb of transitionCallbacks) {
				cb();
			}

			transitionCallbacks.clear();
		}
	};

	document.body.addEventListener("transitionrun", onTransitionStart);
	document.body.addEventListener("transitionend", onTransitionEnd);
}

if (typeof document !== "undefined") {
	if (document.readyState !== "loading") {
		setupGlobalEvents();
	} else {
		document.addEventListener("DOMContentLoaded", setupGlobalEvents);
	}
}

export function runAfterTransition(fn: () => void) {
	// Wait one frame to see if an animation starts, e.g. a transition on mount.
	requestAnimationFrame(() => {
		// If no transitions are running, call the function immediately.
		// Otherwise, add it to a list of callbacks to run at the end of the animation.
		if (transitionsByElement.size === 0) {
			fn();
		} else {
			transitionCallbacks.add(fn);
		}
	});
}
