/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/utils/src/scrollIntoView.ts
 */

import { getScrollParent } from "./get-scroll-parent";

interface ScrollIntoViewportOpts {
	/** The optional containing element of the target to be centered in the viewport. */
	containingElement?: Element;
}

/**
 * Scrolls `scrollView` so that `element` is visible.
 * Similar to `element.scrollIntoView({block: 'nearest'})` (not supported in Edge),
 * but doesn't affect parents above `scrollView`.
 */
export function scrollIntoView(scrollView: HTMLElement, element: HTMLElement) {
	const offsetX = relativeOffset(scrollView, element, "left");
	const offsetY = relativeOffset(scrollView, element, "top");
	const width = element.offsetWidth;
	const height = element.offsetHeight;
	let x = scrollView.scrollLeft;
	let y = scrollView.scrollTop;
	const maxX = x + scrollView.offsetWidth;
	const maxY = y + scrollView.offsetHeight;

	if (offsetX <= x) {
		x = offsetX;
	} else if (offsetX + width > maxX) {
		x += offsetX + width - maxX;
	}
	if (offsetY <= y) {
		y = offsetY;
	} else if (offsetY + height > maxY) {
		y += offsetY + height - maxY;
	}

	scrollView.scrollLeft = x;
	scrollView.scrollTop = y;
}

/**
 * Computes the offset left or top from child to ancestor by accumulating
 * offsetLeft or offsetTop through intervening offsetParents.
 */
function relativeOffset(
	ancestor: HTMLElement,
	child: HTMLElement,
	axis: "left" | "top",
) {
	const prop = axis === "left" ? "offsetLeft" : "offsetTop";
	let sum = 0;
	while (child.offsetParent) {
		sum += child[prop];
		if (child.offsetParent === ancestor) {
			// Stop once we have found the ancestor we are interested in.
			break;
		}
		if (child.offsetParent.contains(ancestor)) {
			// If the ancestor is not `position:relative`, then we stop at
			// _its_ offset parent, and we subtract off _its_ offset, so that
			// we end up with the proper offset from child to ancestor.
			sum -= ancestor[prop];
			break;
		}
		// biome-ignore lint/style/noParameterAssign: used in loop
		child = child.offsetParent as HTMLElement;
	}
	return sum;
}

/**
 * Scrolls the `targetElement` so it is visible in the viewport. Accepts an optional `opts.containingElement`
 * that will be centered in the viewport prior to scrolling the targetElement into view. If scrolling is prevented on
 * the body (e.g. targetElement is in a popover), this will only scroll the scroll parents of the targetElement up to but not including the body itself.
 */
export function scrollIntoViewport(
	targetElement: Element,
	opts?: ScrollIntoViewportOpts,
) {
	if (document.contains(targetElement)) {
		const root = document.scrollingElement || document.documentElement;
		const isScrollPrevented =
			window.getComputedStyle(root).overflow === "hidden";
		// If scrolling is not currently prevented then we aren’t in a overlay nor is a overlay open, just use element.scrollIntoView to bring the element into view
		if (!isScrollPrevented) {
			const { left: originalLeft, top: originalTop } =
				targetElement.getBoundingClientRect();

			// use scrollIntoView({block: 'nearest'}) instead of .focus to check if the element is fully in view or not since .focus()
			// won't cause a scroll if the element is already focused and doesn't behave consistently when an element is partially out of view horizontally vs vertically
			targetElement?.scrollIntoView?.({ block: "nearest" });
			const { left: newLeft, top: newTop } =
				targetElement.getBoundingClientRect();
			// Account for sub pixel differences from rounding
			if (
				Math.abs(originalLeft - newLeft) > 1 ||
				Math.abs(originalTop - newTop) > 1
			) {
				opts?.containingElement?.scrollIntoView?.({
					block: "center",
					inline: "center",
				});
				targetElement.scrollIntoView?.({ block: "nearest" });
			}
		} else {
			let scrollParent = getScrollParent(targetElement);
			// If scrolling is prevented, we don't want to scroll the body since it might move the overlay partially offscreen and the user can't scroll it back into view.
			while (
				targetElement &&
				scrollParent &&
				targetElement !== root &&
				scrollParent !== root
			) {
				scrollIntoView(
					scrollParent as HTMLElement,
					targetElement as HTMLElement,
				);
				// biome-ignore lint/style/noParameterAssign: used in loop
				targetElement = scrollParent;
				scrollParent = getScrollParent(targetElement);
			}
		}
	}
}
