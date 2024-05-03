/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/live-announcer/src/LiveAnnouncer.tsx
 */

import { visuallyHiddenStyles } from "@kobalte/utils";

type Assertiveness = "assertive" | "polite";

/* Inspired by https://github.com/AlmeroSteyn/react-aria-live */
const LIVEREGION_TIMEOUT_DELAY = 7000;

let liveAnnouncer: LiveAnnouncer | null = null;

export const DATA_LIVE_ANNOUNCER_ATTR = "data-live-announcer";

/**
 * Announces the message using screen reader technology.
 */
export function announce(
	message: string,
	assertiveness: Assertiveness = "assertive",
	timeout = LIVEREGION_TIMEOUT_DELAY,
) {
	if (!liveAnnouncer) {
		liveAnnouncer = new LiveAnnouncer();
	}

	liveAnnouncer.announce(message, assertiveness, timeout);
}

/**
 * Stops all queued announcements.
 */
export function clearAnnouncer(assertiveness: Assertiveness) {
	if (liveAnnouncer) {
		liveAnnouncer.clear(assertiveness);
	}
}

/**
 * Removes the announcer from the DOM.
 */
export function destroyAnnouncer() {
	if (liveAnnouncer) {
		liveAnnouncer.destroy();
		liveAnnouncer = null;
	}
}

// LiveAnnouncer is implemented using vanilla DOM, not SolidJS.
class LiveAnnouncer {
	node: HTMLElement | null;
	assertiveLog: HTMLElement;
	politeLog: HTMLElement;

	constructor() {
		this.node = document.createElement("div");
		this.node.dataset.liveAnnouncer = "true";

		Object.assign(this.node.style, visuallyHiddenStyles);

		this.assertiveLog = this.createLog("assertive");
		this.node.appendChild(this.assertiveLog);

		this.politeLog = this.createLog("polite");
		this.node.appendChild(this.politeLog);

		document.body.prepend(this.node);
	}

	createLog(ariaLive: string) {
		const node = document.createElement("div");

		node.setAttribute("role", "log");
		node.setAttribute("aria-live", ariaLive);
		node.setAttribute("aria-relevant", "additions");

		return node;
	}

	destroy() {
		if (!this.node) {
			return;
		}

		document.body.removeChild(this.node);
		this.node = null;
	}

	announce(
		message: string,
		assertiveness = "assertive",
		timeout = LIVEREGION_TIMEOUT_DELAY,
	) {
		if (!this.node) {
			return;
		}

		const node = document.createElement("div");
		node.textContent = message;

		if (assertiveness === "assertive") {
			this.assertiveLog.appendChild(node);
		} else {
			this.politeLog.appendChild(node);
		}

		if (message !== "") {
			setTimeout(() => {
				node.remove();
			}, timeout);
		}
	}

	clear(assertiveness: Assertiveness) {
		if (!this.node) {
			return;
		}

		if (!assertiveness || assertiveness === "assertive") {
			this.assertiveLog.innerHTML = "";
		}

		if (!assertiveness || assertiveness === "polite") {
			this.politeLog.innerHTML = "";
		}
	}
}
