import { contains } from "@kobalte/utils";

/**
 * The element an event actually originated from.
 *
 * `event.target` is retargeted at every shadow boundary the event crosses, so a
 * listener on the document reports the outermost shadow *host* rather than the
 * element that was interacted with. `composedPath()[0]` is that element; for an
 * event that crosses no boundary the two are identical.
 */
export function getEventTarget(event: Event): Element | null {
	const path =
		typeof event.composedPath === "function" ? event.composedPath() : undefined;
	const target = path?.[0] ?? event.target;

	return target instanceof Element ? target : null;
}

/**
 * Like `contains`, but able to see through shadow boundaries.
 *
 * `Node.prototype.contains` only walks the node tree it is called on, so it
 * answers `false` for a `child` that lives inside a shadow root — including
 * `document.contains(elementInAShadowRoot)`. When this walk reaches the top of a
 * shadow tree it continues from that tree's host, which is how a containment
 * question about the *rendered* page, rather than one node tree, is answered.
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

		const root = node.getRootNode();
		node = root instanceof ShadowRoot ? root.host : null;
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

		const root = node.getRootNode();
		node = root instanceof ShadowRoot ? root.host : null;
	}

	return null;
}
