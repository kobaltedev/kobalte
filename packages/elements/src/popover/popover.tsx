/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/232bc79018ec20967fec1e097a9474aba3bb5be7/packages/ariakit/src/popover/popover-state.ts
 */

import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  hide,
  Middleware,
  offset,
  shift,
  size,
} from "@floating-ui/dom";
import { mergeDefaultProps } from "@kobalte/utils";
import {
  Accessor,
  createEffect,
  createRenderEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  ParentComponent,
  splitProps,
} from "solid-js";

import { Dialog, DialogProps } from "../dialog";
import { DialogCloseButton } from "../dialog/dialog-close-button";
import { DialogDescription } from "../dialog/dialog-description";
import { DialogPortal } from "../dialog/dialog-portal";
import { DialogTitle } from "../dialog/dialog-title";
import { createControllableBooleanSignal } from "../primitives";
import { PopoverAnchor } from "./popover-anchor";
import { PopoverArrow } from "./popover-arrow";
import { PopoverContext, PopoverContextValue } from "./popover-context";
import { PopoverPanel } from "./popover-panel";
import { PopoverPositioner } from "./popover-positioner";
import { PopoverTrigger } from "./popover-trigger";
import {
  AnchorRect,
  BasePlacement,
  getAnchorElement,
  getTransformOrigin,
  isValidPlacement,
  Placement,
} from "./utils";
import { getReadingDirection, useLocale } from "../i18n";

type PopoverComposite = {
  Trigger: typeof PopoverTrigger;
  Anchor: typeof PopoverAnchor;
  Positioner: typeof PopoverPositioner;
  Panel: typeof PopoverPanel;
  Arrow: typeof PopoverArrow;

  Portal: typeof DialogPortal;
  CloseButton: typeof DialogCloseButton;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
};

export interface PopoverProps extends DialogProps {
  /**
   * Function that returns the anchor element's DOMRect. If this is explicitly
   * passed, it will override the anchor `getBoundingClientRect` method.
   */
  getAnchorRect?: (anchor?: HTMLElement) => AnchorRect | undefined;

  /**
   * A ref for the anchor element.
   * Useful if you want to use an element outside `Popover` as the popover anchor.
   */
  anchorRef?: Accessor<HTMLElement | undefined>;

  /** The placement of the popover. */
  placement?: Placement;

  /**
   * The distance between the popover and the anchor element.
   * By default, it's 0 plus half of the arrow offset, if it exists.
   */
  gutter?: number;

  /** The skidding of the popover along the anchor element. */
  shift?: number;

  /**
   * Controls the behavior of the popover when it overflows the viewport:
   *   - If a `boolean`, specifies whether the popover should flip to the
   *     opposite side when it overflows.
   *   - If a `string`, indicates the preferred fallback placements when it
   *     overflows. The placements must be spaced-delimited, e.g. "top left".
   */
  flip?: boolean | string;

  /** Whether the popover should slide when it overflows. */
  slide?: boolean;

  /** Whether the popover can overlap the anchor element when it overflows. */
  overlap?: boolean;

  /** Whether the popover should hide when the anchor is not visible on screen. */
  hide?: boolean;

  /** The minimum padding before considering the popover anchor off-screen. */
  hidePadding?: number;

  /**
   * Whether the popover should have the same width as the anchor element.
   * This will be exposed to CSS as `--kb-popover-anchor-width`.
   */
  sameWidth?: boolean;

  /**
   * Whether the popover should fit the viewport. If this is set to true, the
   * popover positioner will have `maxWidth` and `maxHeight` set to the viewport size.
   * This will be exposed to CSS as `--kb-popover-available-width` and `--kb-popover-available-height`.
   */
  fitViewport?: boolean;

  /** The minimum padding between the arrow and the popover corner. */
  arrowPadding?: number;

  /**
   * The minimum padding between the popover and the viewport edge.
   * This will be exposed to CSS as `--kb-popover-overflow-padding`.
   */
  overflowPadding?: number;
}

/**
 * A popover is a dialog positioned relative to an anchor element.
 * This component is based on the [WAI-ARIA Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/popovermodal/)
 */
export const Popover: ParentComponent<PopoverProps> & PopoverComposite = props => {
  const defaultId = `kb-popover-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      isModal: false,
      getAnchorRect: (anchor?: HTMLElement) => anchor?.getBoundingClientRect(),
      placement: "bottom",
      flip: true,
      slide: true,
      overlap: false,
      hide: false,
      sameWidth: false,
      fitViewport: false,
      gutter: 0,
      shift: 0,
      hidePadding: 0,
      arrowPadding: 4,
      overflowPadding: 8,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "children",
    "isOpen",
    "defaultIsOpen",
    "onOpenChange",
    "getAnchorRect",
    "anchorRef",
    "placement",
    "gutter",
    "shift",
    "flip",
    "slide",
    "overlap",
    "hide",
    "hidePadding",
    "sameWidth",
    "fitViewport",
    "arrowPadding",
    "overflowPadding",
  ]);

  const [anchorRef, setAnchorRef] = createSignal<HTMLElement>();
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [positionerRef, setPositionerRef] = createSignal<HTMLElement>();
  const [panelRef, setPanelRef] = createSignal<HTMLElement>();
  const [arrowRef, setArrowRef] = createSignal<HTMLElement>();

  const [currentPlacement, setCurrentPlacement] = createSignal(local.placement!);

  const [isOpen, setIsOpen] = createControllableBooleanSignal({
    value: () => local.isOpen,
    defaultValue: () => local.defaultIsOpen,
    onChange: value => local.onOpenChange?.(value),
  });

  const locale = useLocale();

  // Floating UI reference element.
  const anchorEl = () => {
    return getAnchorElement(
      local.anchorRef?.() ?? anchorRef() ?? triggerRef(),
      local.getAnchorRect!
    );
  };

  async function updatePosition() {
    const referenceEl = anchorEl();
    const floatingEl = positionerRef();
    const arrowEl = arrowRef();

    if (!referenceEl || !floatingEl) {
      return;
    }

    const arrowOffset = (arrowEl?.clientHeight || 0) / 2;
    const finalGutter =
      typeof local.gutter === "number" ? local.gutter + arrowOffset : local.gutter ?? arrowOffset;

    floatingEl.style.setProperty("--kb-popover-overflow-padding", `${local.overflowPadding}px`);

    // Virtual element doesn't work without this ¯\_(ツ)_/¯
    referenceEl.getBoundingClientRect();

    const middleware: Middleware[] = [
      // https://floating-ui.com/docs/offset
      offset(({ placement }) => {
        // If there's no placement alignment (*-start or *-end), we'll
        // fall back to the crossAxis offset as it also works for
        // center-aligned placements.
        const hasAlignment = !!placement.split("-")[1];

        return {
          mainAxis: finalGutter,
          crossAxis: !hasAlignment ? local.shift : undefined,
          alignmentAxis: local.shift,
        };
      }),
    ];

    if (local.flip !== false) {
      const fallbackPlacements = typeof local.flip === "string" ? local.flip.split(" ") : undefined;

      if (fallbackPlacements !== undefined && !fallbackPlacements.every(isValidPlacement)) {
        throw new Error("`flip` expects a spaced-delimited list of placements");
      }

      // https://floating-ui.com/docs/flip
      middleware.push(
        flip({
          padding: local.overflowPadding,
          fallbackPlacements: fallbackPlacements,
        })
      );
    }

    if (local.slide || local.overlap) {
      // https://floating-ui.com/docs/shift
      middleware.push(
        shift({
          mainAxis: local.slide,
          crossAxis: local.overlap,
          padding: local.overflowPadding,
        })
      );
    }

    // https://floating-ui.com/docs/size
    middleware.push(
      size({
        padding: local.overflowPadding,
        apply({ availableWidth, availableHeight, rects }) {
          const referenceWidth = Math.round(rects.reference.width);

          availableWidth = Math.floor(availableWidth);
          availableHeight = Math.floor(availableHeight);

          floatingEl.style.setProperty("--kb-popover-anchor-width", `${referenceWidth}px`);
          floatingEl.style.setProperty("--kb-popover-available-width", `${availableWidth}px`);
          floatingEl.style.setProperty("--kb-popover-available-height", `${availableHeight}px`);

          if (local.sameWidth) {
            floatingEl.style.width = `${referenceWidth}px`;
          }

          if (local.fitViewport) {
            floatingEl.style.maxWidth = `${availableWidth}px`;
            floatingEl.style.maxHeight = `${availableHeight}px`;
          }
        },
      })
    );

    // https://floating-ui.com/docs/hide
    if (local.hide) {
      middleware.push(hide({ padding: local.hidePadding }));
    }

    // https://floating-ui.com/docs/arrow
    if (arrowEl) {
      middleware.push(arrow({ element: arrowEl, padding: local.arrowPadding }));
    }

    // https://floating-ui.com/docs/computePosition
    const pos = await computePosition(referenceEl, floatingEl, {
      placement: local.placement,
      strategy: "absolute",
      middleware,
    });

    if (pos.placement !== currentPlacement()) {
      setCurrentPlacement(pos.placement);
    }

    if (!floatingEl) {
      return;
    }

    floatingEl.style.setProperty(
      "--kb-popover-transform-origin",
      getTransformOrigin(pos.placement, locale().direction)
    );

    const x = Math.round(pos.x);
    const y = Math.round(pos.y);

    let visibility: string | undefined;

    if (local.hide) {
      visibility = pos.middlewareData.hide?.referenceHidden ? "hidden" : "visible";
    }

    // https://floating-ui.com/docs/misc#subpixel-and-accelerated-positioning
    Object.assign(floatingEl.style, {
      top: "0",
      left: "0",
      transform: `translate3d(${x}px, ${y}px, 0)`,
      visibility,
    });

    // https://floating-ui.com/docs/arrow#usage
    if (arrowEl && pos.middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = pos.middlewareData.arrow;

      const dir = pos.placement.split("-")[0] as BasePlacement;

      Object.assign(arrowEl.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
        [dir]: "100%",
      });
    }
  }

  createRenderEffect(() => {
    const referenceEl = anchorEl();
    const floatingEl = positionerRef();

    if (!referenceEl || !floatingEl) {
      return;
    }

    // https://floating-ui.com/docs/autoUpdate
    const cleanupAutoUpdate = autoUpdate(referenceEl, floatingEl, updatePosition, {
      // JSDOM doesn't support ResizeObserver
      elementResize: typeof ResizeObserver === "function",
    });

    onCleanup(cleanupAutoUpdate);
  });

  // Makes sure the positioner element that's passed to popper has the same
  // z-index as the popover panel element so users only need to set the z-index
  // once.
  createEffect(() => {
    if (!isOpen()) {
      return;
    }

    const positioner = positionerRef();
    const panel = panelRef();

    if (!positioner || !panel) {
      return;
    }

    positioner.style.zIndex = getComputedStyle(panel).zIndex;
  });

  const context: PopoverContextValue = {
    currentPlacement,
    positionerRef,
    panelRef,
    setAnchorRef,
    setTriggerRef,
    setPositionerRef,
    setPanelRef,
    setArrowRef,
  };

  return (
    <Dialog isOpen={isOpen()} onOpenChange={setIsOpen} {...others}>
      <PopoverContext.Provider value={context}>{local.children}</PopoverContext.Provider>
    </Dialog>
  );
};

Popover.Trigger = PopoverTrigger;
Popover.Anchor = PopoverAnchor;
Popover.Positioner = PopoverPositioner;
Popover.Panel = PopoverPanel;
Popover.Arrow = PopoverArrow;

Popover.Portal = DialogPortal;
Popover.CloseButton = DialogCloseButton;
Popover.Title = DialogTitle;
Popover.Description = DialogDescription;
