export type BasePlacement = "top" | "bottom" | "left" | "right";

export type Placement = BasePlacement | `${BasePlacement}-start` | `${BasePlacement}-end`;

export type AnchorRect = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

function createDOMRect(anchorRect?: AnchorRect) {
  const { x = 0, y = 0, width = 0, height = 0 } = anchorRect ?? {};

  if (typeof DOMRect === "function") {
    return new DOMRect(x, y, width, height);
  }

  // JSDOM doesn't support DOMRect constructor.
  const rect = {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
  };

  return { ...rect, toJSON: () => rect };
}

export function getAnchorElement(
  anchor: HTMLElement | undefined,
  getAnchorRect: (anchor?: HTMLElement) => AnchorRect | undefined
) {
  // https://floating-ui.com/docs/virtual-elements
  const contextElement = anchor;

  return {
    contextElement,
    getBoundingClientRect: () => {
      const anchorRect = getAnchorRect(anchor);

      if (anchorRect) {
        return createDOMRect(anchorRect);
      }

      if (anchor) {
        return anchor.getBoundingClientRect();
      }

      return createDOMRect();
    },
  };
}

export function isValidPlacement(flip: string): flip is Placement {
  return /^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(flip);
}
