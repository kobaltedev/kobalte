import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let runAfterTransition: typeof import("./run-after-transition").runAfterTransition;
let frames: Array<FrameRequestCallback>;

beforeEach(async () => {
	vi.resetModules();
	document.body.replaceWith(document.createElement("body"));
	frames = [];
	vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
		frames.push(callback),
	);
	({ runAfterTransition } = await import("./run-after-transition"));
	if (document.readyState === "loading") {
		document.dispatchEvent(new Event("DOMContentLoaded"));
	}
});

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

function transition(target: Element, type: string, propertyName = "opacity") {
	// jsdom does not construct native CSS transitions; browser reproduction uses real ones.
	const event = new Event(type, { bubbles: true });
	Object.defineProperty(event, "propertyName", { value: propertyName });
	target.dispatchEvent(event);
}

function createTarget() {
	const target = document.createElement("div");
	document.body.append(target);
	transition(target, "transitionrun");
	return target;
}

function waitForTransitions() {
	const callback = vi.fn();
	runAfterTransition(callback);
	for (const frame of frames.splice(0)) frame(0);
	return callback;
}

describe("runAfterTransition", () => {
	it("runs after one frame when there are no transitions", () => {
		const callback = vi.fn();
		runAfterTransition(callback);
		expect(callback).not.toHaveBeenCalled();
		for (const frame of frames.splice(0)) frame(0);
		expect(callback).toHaveBeenCalledOnce();
	});

	it("waits for every property and ignores duplicate completion events", () => {
		const target = createTarget();
		transition(target, "transitionrun", "transform");
		const callback = waitForTransitions();
		transition(target, "transitionend");
		transition(target, "transitioncancel");
		expect(callback).not.toHaveBeenCalled();
		transition(target, "transitioncancel", "transform");
		transition(target, "transitionend", "transform");
		expect(callback).toHaveBeenCalledOnce();
	});

	it("releases a target removed after its end event was stopped", async () => {
		const target = createTarget();
		target.addEventListener("transitionend", (event) =>
			event.stopPropagation(),
		);
		const callback = waitForTransitions();
		transition(target, "transitionend");
		target.remove();
		await Promise.resolve();
		expect(callback).toHaveBeenCalledOnce();
	});

	it("releases a removed subtree without requiring cancellation events", async () => {
		const parent = document.createElement("section");
		document.body.append(parent);
		parent.append(createTarget());
		const callback = waitForTransitions();
		parent.remove();
		await Promise.resolve();
		expect(callback).toHaveBeenCalledOnce();
	});

	it("continues waiting for a connected sibling", async () => {
		const removed = createTarget();
		const connected = createTarget();
		const callback = waitForTransitions();
		removed.remove();
		await Promise.resolve();
		expect(callback).not.toHaveBeenCalled();
		transition(connected, "transitionend");
		expect(callback).toHaveBeenCalledOnce();
	});

	it("does not finish a target moved within the same document", async () => {
		const target = createTarget();
		const parent = document.createElement("section");
		document.body.append(parent);
		const callback = waitForTransitions();
		parent.append(target);
		await Promise.resolve();
		expect(callback).not.toHaveBeenCalled();
		transition(target, "transitionend");
		expect(callback).toHaveBeenCalledOnce();
	});

	it("removes the detached target's cancellation listener", async () => {
		const target = createTarget();
		const removeListener = vi.spyOn(target, "removeEventListener");
		waitForTransitions();
		target.remove();
		await Promise.resolve();
		expect(removeListener).toHaveBeenCalledWith(
			"transitioncancel",
			expect.any(Function),
		);
	});

	it("disconnects when idle and resumes observation for the next transition", async () => {
		const disconnect = vi.spyOn(MutationObserver.prototype, "disconnect");
		const observe = vi.spyOn(MutationObserver.prototype, "observe");
		const first = createTarget();
		const callback = waitForTransitions();
		transition(first, "transitionend");
		expect(callback).toHaveBeenCalledOnce();
		expect(disconnect).toHaveBeenCalledOnce();
		const next = createTarget();
		const nextCallback = waitForTransitions();
		next.remove();
		await Promise.resolve();
		expect(nextCallback).toHaveBeenCalledOnce();
		expect(observe).toHaveBeenCalledTimes(2);
		expect(disconnect).toHaveBeenCalledTimes(2);
	});

	it("does not leave callbacks blocked across repeated removals", async () => {
		for (let index = 0; index < 1000; index++) {
			const target = createTarget();
			const callback = waitForTransitions();
			target.remove();
			await Promise.resolve();
			expect(callback).toHaveBeenCalledOnce();
		}
	});
});
