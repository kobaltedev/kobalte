import { contains } from "@kobalte/utils";

/** Where an event originated, captured while the event is still dispatching. */
export type EventOrigin = {
	/** The element the interaction actually happened on — inside any shadow trees it crossed. */
	target: Element;
	/** `composedPath()` at capture time; includes slot ancestry that a tree walk can't see. */
	path: readonly EventTarget[];
};

/**
 * Snapshot of where an event originated.
 *
 * `event.target` is retargeted at every shadow boundary the event crosses, so a
 * listener on the document reports the outermost shadow *host* rather than the
 * element that was interacted with. `composedPath()[0]` is that element; for an
 * event that crosses no boundary the two are identical.
 *
 * Must be called synchronously during dispatch: `composedPath()` returns `[]`
 * once dispatch ends, after which only the retargeted `event.target` remains.
 */
export function getEventOrigin(event: Event): EventOrigin | null {
	const path =
		typeof event.composedPath === "function" ? event.composedPath() : [];
	const target = path[0] ?? event.target;

	return target instanceof Element ? { target, path } : null;
}

/** The host of `node`'s shadow root, or `null` when `node` is not in a shadow tree. */
function getShadowHost(node: Node): Element | null {
	const root = node.getRootNode();

	return root instanceof ShadowRoot ? root.host : null;
}

/**
 * `target` as seen from `observer`'s node tree, preceded by every host it is
 * retargeted through on the way — the DOM's own retargeting algorithm, with its
 * intermediate steps kept.
 *
 * Climbs out of every shadow tree that does not also enclose `observer`. The
 * *first* entry is what `observer`'s tree sees: the encapsulated internals of a
 * foreign component (e.g. a web-component trigger) are reported as that
 * component's host, while siblings in `observer`'s own shadow root are reported
 * as themselves. The *last* entry is `target` itself. For an `observer` in the
 * document the first entry is exactly the `event.target` a document listener sees.
 */
export function retargetChain(target: Element, observer: Node): Element[] {
	const chain = [target];
	let node = target;

	for (;;) {
		const host = getShadowHost(node);

		if (!host || containsComposed(node.getRootNode(), observer)) {
			return chain.reverse();
		}

		node = host;
		chain.push(node);
	}
}

/**
 * Like `contains`, but able to see through shadow boundaries.
 *
 * `Node.prototype.contains` only walks the node tree it is called on, so it
 * answers `false` for a `child` that lives inside a shadow root — including
 * `document.contains(elementInAShadowRoot)`. When this walk reaches the top of a
 * shadow tree it continues from that tree's host, which is how a containment
 * question about the *rendered* page, rather than one node tree, is answered.
 * Slot assignment is not followed; callers that need flattened-tree containment
 * should also consult the event's composed path.
 */
export function containsComposed(parent: Node | undefined, child: Node | null) {
	if (!parent) {
		return false;
	}

	let node: Node | null = child;

	while (node) {
		if (contains(parent, node)) {
			return true;
		}

		node = getShadowHost(node);
	}

	return false;
}

/**
 * Like `Element.prototype.closest`, but able to see through shadow boundaries — it continues from
 * the host when it reaches the top of a shadow tree, so an ancestor in an outer tree is still found.
 */
export function closestComposed(
	element: Element | null,
	selector: string,
): Element | null {
	let node: Element | null = element;

	while (node) {
		const match = node.closest(selector);

		if (match) {
			return match;
		}

		node = getShadowHost(node);
	}

	return null;
}
