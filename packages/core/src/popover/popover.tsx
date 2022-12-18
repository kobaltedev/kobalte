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
  platform,
  shift,
  size,
} from "@floating-ui/dom";
import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import {
  Accessor,
  createEffect,
  createRenderEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  ParentComponent,
} from "solid-js";

import { useLocale } from "../i18n";
import {
  createDisclosureState,
  CreateFocusTrapRegionProps,
  CreateOverlayProps,
  createRegisterId,
} from "../primitives";
import { PopoverAnchor } from "./popover-anchor";
import { PopoverArrow } from "./popover-arrow";
import { PopoverCloseButton } from "./popover-close-button";
import { PopoverContent } from "./popover-content";
import { PopoverContext, PopoverContextValue } from "./popover-context";
import { PopoverDescription } from "./popover-description";
import { PopoverPortal } from "./popover-portal";
import { PopoverPositioner } from "./popover-positioner";
import { PopoverTitle } from "./popover-title";
import { PopoverTrigger } from "./popover-trigger";
import {
  AnchorRect,
  BasePlacement,
  getAnchorElement,
  getTransformOrigin,
  isValidPlacement,
  Placement,
} from "./utils";

type PopoverComposite = {
  Trigger: typeof PopoverTrigger;
  Anchor: typeof PopoverAnchor;
  Portal: typeof PopoverPortal;
  Positioner: typeof PopoverPositioner;
  Content: typeof PopoverContent;
  Arrow: typeof PopoverArrow;
  CloseButton: typeof PopoverCloseButton;
  Title: typeof PopoverTitle;
  Description: typeof PopoverDescription;
};

// Props used in @floating-ui/dom middlewares
export interface PopoverFloatingProps {
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

  /** Whether to hide the popover when the anchor element becomes occluded. */
  hideWhenDetached?: boolean;

  /** The minimum padding in order to consider the anchor element occluded. */
  detachedPadding?: number;

  /** The minimum padding between the arrow and the popover corner. */
  arrowPadding?: number;

  /**
   * The minimum padding between the popover and the viewport edge.
   * This will be exposed to CSS as `--kb-popover-overflow-padding`.
   */
  overflowPadding?: number;
}

export interface PopoverProps extends PopoverFloatingProps {
  /** The controlled open state of the popover. */
  isOpen?: boolean;

  /**
   * The default open state when initially rendered.
   * Useful when you do not need to control the open state.
   */
  defaultIsOpen?: boolean;

  /** Event handler called when the open state of the popover changes. */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /**
   * Used to force mounting the popover when more control is needed.
   * Useful when controlling animation with SolidJS animation libraries.
   */
  forceMount?: boolean;

  /** Whether the popover should be the only visible content for screen readers. */
  isModal?: boolean;

  /** Whether the scroll should be locked when the popover is open. */
  preventScroll?: boolean;

  /** Whether pressing the escape key should close the popover. */
  closeOnEsc?: boolean;

  /** Whether to close the popover when the user interacts outside it. */
  closeOnInteractOutside?: boolean;

  /**
   * When user interacts with the argument element outside the popover panel,
   * return `true` if the popover should be closed. This gives you a chance to filter
   * out interaction with elements that should not dismiss the popover.
   * By default, the popover will always close on interaction outside the popover panel.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;

  /** Whether focus should be locked inside the popover panel. */
  trapFocus?: boolean;

  /**
   * Whether focus should be set on a child element once the popover is open.
   * If `true` focus will be set to the first focusable element inside the popover panel.
   * If a `string` (query selector) is provided focus will be set to the target element.
   */
  autoFocus?: boolean | string;

  /**
   * Whether focus should be restored once the popover close.
   * If `true` focus will be restored to the element that triggered the popover.
   * If a `string` (query selector) is provided focus will be restored to the target element.
   */
  restoreFocus?: boolean | string;

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

  /**
   * Event handler called when the popover placement changes.
   * It returns the current temporary placement of the popover.
   * This may be different from the `placement` if the popover has needed to update its position on the fly.
   */
  onCurrentPlacementChange?: (currentPlacement: Placement) => void;
}

/**
 * A popover is a dialog positioned relative to an anchor element.
 */
export const Popover: ParentComponent<PopoverProps> & PopoverComposite = props => {
  const defaultId = `popover-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      isModal: false,
      preventScroll: false,
      closeOnEsc: true,
      closeOnInteractOutside: true,
      trapFocus: true,
      autoFocus: true,
      restoreFocus: true,
      getAnchorRect: anchor => anchor?.getBoundingClientRect(),
      placement: "bottom",
      gutter: 0,
      shift: 0,
      flip: true,
      slide: true,
      overlap: false,
      sameWidth: false,
      fitViewport: false,
      hideWhenDetached: false,
      detachedPadding: 0,
      arrowPadding: 4,
      overflowPadding: 8,
    },
    props
  );

  const [defaultAnchorRef, setDefaultAnchorRef] = createSignal<HTMLElement>();
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [positionerRef, setPositionerRef] = createSignal<HTMLElement>();
  const [contentRef, setContentRef] = createSignal<HTMLElement>();
  const [arrowRef, setArrowRef] = createSignal<HTMLElement>();

  const [contentId, setContentId] = createSignal<string>();
  const [titleId, setTitleId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const [currentPlacement, setCurrentPlacement] = createSignal(props.placement!);

  // Floating UI - reference element.
  const anchorRef = () => {
    return getAnchorElement(
      props.anchorRef?.() ?? defaultAnchorRef() ?? triggerRef(),
      props.getAnchorRect!
    );
  };

  const disclosureState = createDisclosureState({
    isOpen: () => props.isOpen,
    defaultIsOpen: () => props.defaultIsOpen,
    onOpenChange: isOpen => props.onOpenChange?.(isOpen),
  });

  const locale = useLocale();

  const createOverlayProps: CreateOverlayProps = {
    isOpen: disclosureState.isOpen,
    onClose: disclosureState.close,
    isModal: () => props.isModal,
    preventScroll: () => props.preventScroll,
    closeOnInteractOutside: () => props.closeOnInteractOutside,
    closeOnEsc: () => props.closeOnEsc,
    shouldCloseOnInteractOutside: element => {
      return props.shouldCloseOnInteractOutside?.(element) ?? true;
    },
  };

  const createFocusTrapRegionProps: CreateFocusTrapRegionProps = {
    trapFocus: () => props.trapFocus && disclosureState.isOpen(),
    autoFocus: () => props.autoFocus,
    restoreFocus: () => props.restoreFocus,
  };

  async function updatePosition() {
    const referenceEl = anchorRef();
    const floatingEl = positionerRef();
    const arrowEl = arrowRef();

    if (!referenceEl || !floatingEl) {
      return;
    }

    const arrowOffset = (arrowEl?.clientHeight || 0) / 2;
    const finalGutter =
      typeof props.gutter === "number" ? props.gutter + arrowOffset : props.gutter ?? arrowOffset;

    floatingEl.style.setProperty("--kb-popover-overflow-padding", `${props.overflowPadding}px`);

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
          crossAxis: !hasAlignment ? props.shift : undefined,
          alignmentAxis: props.shift,
        };
      }),
    ];

    if (props.flip !== false) {
      const fallbackPlacements = typeof props.flip === "string" ? props.flip.split(" ") : undefined;

      if (fallbackPlacements !== undefined && !fallbackPlacements.every(isValidPlacement)) {
        throw new Error("`flip` expects a spaced-delimited list of placements");
      }

      // https://floating-ui.com/docs/flip
      middleware.push(
        flip({
          padding: props.overflowPadding,
          fallbackPlacements: fallbackPlacements,
        })
      );
    }

    if (props.slide || props.overlap) {
      // https://floating-ui.com/docs/shift
      middleware.push(
        shift({
          mainAxis: props.slide,
          crossAxis: props.overlap,
          padding: props.overflowPadding,
        })
      );
    }

    // https://floating-ui.com/docs/size
    middleware.push(
      size({
        padding: props.overflowPadding,
        apply({ availableWidth, availableHeight, rects }) {
          const referenceWidth = Math.round(rects.reference.width);

          availableWidth = Math.floor(availableWidth);
          availableHeight = Math.floor(availableHeight);

          floatingEl.style.setProperty("--kb-popover-anchor-width", `${referenceWidth}px`);
          floatingEl.style.setProperty("--kb-popover-available-width", `${availableWidth}px`);
          floatingEl.style.setProperty("--kb-popover-available-height", `${availableHeight}px`);

          if (props.sameWidth) {
            floatingEl.style.width = `${referenceWidth}px`;
          }

          if (props.fitViewport) {
            floatingEl.style.maxWidth = `${availableWidth}px`;
            floatingEl.style.maxHeight = `${availableHeight}px`;
          }
        },
      })
    );

    // https://floating-ui.com/docs/hide
    if (props.hideWhenDetached) {
      middleware.push(hide({ padding: props.detachedPadding }));
    }

    // https://floating-ui.com/docs/arrow
    if (arrowEl) {
      middleware.push(arrow({ element: arrowEl, padding: props.arrowPadding }));
    }

    // https://floating-ui.com/docs/computePosition
    const pos = await computePosition(referenceEl, floatingEl, {
      placement: props.placement,
      strategy: "absolute",
      middleware,
      platform: {
        ...platform,
        isRTL: () => locale().direction === "rtl",
      },
    });

    if (pos.placement !== currentPlacement()) {
      props.onCurrentPlacementChange?.(setCurrentPlacement(pos.placement));
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

    if (props.hideWhenDetached) {
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
    const referenceEl = anchorRef();
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
    if (!disclosureState.isOpen()) {
      return;
    }

    const positioner = positionerRef();
    const panel = contentRef();

    if (!positioner || !panel) {
      return;
    }

    positioner.style.zIndex = getComputedStyle(panel).zIndex;
  });

  const context: PopoverContextValue = {
    isOpen: disclosureState.isOpen,
    shouldMount: () => props.forceMount || disclosureState.isOpen(),
    currentPlacement,
    contentRef,
    contentId,
    titleId,
    descriptionId,
    createOverlayProps,
    createFocusTrapRegionProps,
    setDefaultAnchorRef,
    setTriggerRef,
    setPositionerRef,
    setContentRef,
    setArrowRef,
    close: disclosureState.close,
    toggle: disclosureState.toggle,
    generateId: createGenerateId(() => props.id!),
    registerContentId: createRegisterId(setContentId),
    registerTitleId: createRegisterId(setTitleId),
    registerDescriptionId: createRegisterId(setDescriptionId),
  };

  return <PopoverContext.Provider value={context}>{props.children}</PopoverContext.Provider>;
};

Popover.Trigger = PopoverTrigger;
Popover.Anchor = PopoverAnchor;
Popover.Portal = PopoverPortal;
Popover.Positioner = PopoverPositioner;
Popover.Content = PopoverContent;
Popover.Arrow = PopoverArrow;
Popover.CloseButton = PopoverCloseButton;
Popover.Title = PopoverTitle;
Popover.Description = PopoverDescription;
