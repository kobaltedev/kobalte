/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/utils/src/scrollIntoView.ts
 */

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
function relativeOffset(ancestor: HTMLElement, child: HTMLElement, axis: "left" | "top") {
  const prop = axis === "left" ? "offsetLeft" : "offsetTop";
  let sum = 0;
  while (child.offsetParent) {
    sum += child[prop];
    if (child.offsetParent === ancestor) {
      // Stop once we have found the ancestor we are interested in.
      break;
    } else if (child.offsetParent.contains(ancestor)) {
      // If the ancestor is not `position:relative`, then we stop at
      // _its_ offset parent, and we subtract off _its_ offset, so that
      // we end up with the proper offset from child to ancestor.
      sum -= ancestor[prop];
      break;
    }
    child = child.offsetParent as HTMLElement;
  }
  return sum;
}
