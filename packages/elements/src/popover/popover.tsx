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
  createMemo,
  createRenderEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  ParentComponent,
} from "solid-js";

import { createDisclosure } from "../primitives";
import { PopoverAnchor } from "./popover-anchor";
import { PopoverArrow } from "./popover-arrow";
import { PopoverCloseButton } from "./popover-close-button";
import { PopoverContext, PopoverContextValue, PopoverDataSet } from "./popover-context";
import { PopoverDescription } from "./popover-description";
import { PopoverPanel } from "./popover-panel";
import { PopoverPortal } from "./popover-portal";
import { PopoverPositioner } from "./popover-positioner";
import { PopoverTitle } from "./popover-title";
import { PopoverTrigger } from "./popover-trigger";
import { AnchorRect, BasePlacement, getAnchorElement, isValidPlacement, Placement } from "./utils";

type PopoverComposite = {
  Anchor: typeof PopoverAnchor;
  Trigger: typeof PopoverTrigger;
  Portal: typeof PopoverPortal;
  Positioner: typeof PopoverPositioner;
  Panel: typeof PopoverPanel;
  Arrow: typeof PopoverArrow;
  CloseButton: typeof PopoverCloseButton;
  Title: typeof PopoverTitle;
  Description: typeof PopoverDescription;
};

export interface PopoverProps {
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

  //

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
   * Whether the popover should block interaction with outside elements,
   * and be the only visible content for screen readers.
   */
  isModal?: boolean;

  /** Whether the scroll should be locked when the popover is open. */
  preventScroll?: boolean;

  /** Whether to close the popover when the user interacts outside it. */
  closeOnInteractOutside?: boolean;

  /** Whether pressing the escape key should close the popover. */
  closeOnEsc?: boolean;

  /**
   * When user interacts with the argument element outside the popover ref,
   * return true if the popover should be closed. This gives you a chance to filter
   * out interaction with elements that should not dismiss the popover.
   * By default, the popover will always close on interaction outside.
   */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;

  /** Whether the focus should be locked inside the popover. */
  trapFocus?: boolean;

  /** Whether the first focusable element should be focused once the `Popover.Panel` mounts. */
  autoFocus?: boolean;

  /** Whether focus should be restored to the element that triggered the `Popover` once  the `Popover.Panel` unmounts. */
  restoreFocus?: boolean;

  /**
   * A query selector to retrieve the element that should receive focus once the `Popover.Panel` mounts.
   * This value has priority over `autoFocus`.
   */
  initialFocusSelector?: string;

  /**
   * A query selector to retrieve the element that should receive focus once the `Popover.Panel` unmounts.
   * This value has priority over `restoreFocus`.
   */
  restoreFocusSelector?: string;

  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

/**
 * A popover is a dialog positioned relative to an anchor element.
 * This component is based on the [WAI-ARIA Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/popovermodal/)
 */
export const Popover: ParentComponent<PopoverProps> & PopoverComposite = props => {
  const defaultId = `kb-popover-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      getAnchorRect: (anchor?: HTMLElement) => anchor?.getBoundingClientRect(),
      placement: "bottom",
      gutter: 0,
      shift: 0,
      flip: true,
      slide: true,
      overlap: false,
      hide: false,
      sameWidth: false,
      fitViewport: false,
      hidePadding: 0,
      arrowPadding: 4,
      overflowPadding: 8,
      //
      id: defaultId,
      closeOnInteractOutside: true,
      closeOnEsc: true,
      autoFocus: true,
      restoreFocus: true,
    },
    props
  );

  const [anchorRef, setAnchorRef] = createSignal<HTMLElement>();
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [positionerRef, setPositionerRef] = createSignal<HTMLElement>();
  const [panelRef, setPanelRef] = createSignal<HTMLElement>();
  const [arrowRef, setArrowRef] = createSignal<HTMLElement>();

  const [panelId, setPanelId] = createSignal<string>();
  const [titleId, setTitleId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const [currentPlacement, setCurrentPlacement] = createSignal(props.placement!);

  const state = createDisclosure({
    isOpen: () => props.isOpen,
    defaultIsOpen: () => props.defaultIsOpen,
    onOpenChange: isOpen => props.onOpenChange?.(isOpen),
  });

  const dataset: Accessor<PopoverDataSet> = createMemo(() => ({
    "data-open": state.isOpen() ? "" : undefined,
    "data-placement": props.placement,
  }));

  // Floating UI reference element.
  const anchorEl = () => {
    return getAnchorElement(
      props.anchorRef?.() ?? anchorRef() ?? triggerRef(),
      props.getAnchorRect!
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
    if (props.hide) {
      middleware.push(hide({ padding: props.hidePadding }));
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
    });

    if (pos.placement !== currentPlacement()) {
      setCurrentPlacement(pos.placement);
    }

    if (!floatingEl) {
      return;
    }

    // TODO: expose transform origin as css custom property (with rtl support)
    // floatingEl.style.setProperty("--kb-popover-transform-origin", getTransformOrigin(pos.placement));

    const x = Math.round(pos.x);
    const y = Math.round(pos.y);

    let visibility: string | undefined;

    if (props.hide) {
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
    if (!state.isOpen()) {
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
    ...state,
    dataset,
    ariaControls: () => (state.isOpen() ? panelId() : undefined),
    ariaLabel: () => props["aria-label"],
    ariaLabelledBy: () => props["aria-labelledby"] || titleId(),
    ariaDescribedBy: () => props["aria-describedby"] || descriptionId(),
    currentPlacement,
    positionerRef,
    panelRef,
    setAnchorRef,
    setTriggerRef,
    setPositionerRef,
    setPanelRef,
    setArrowRef,
    generateId: part => `${props.id!}-${part}`,
    registerPanel: id => {
      setPanelId(id);
      return () => setPanelId(undefined);
    },
    registerTitle: id => {
      setTitleId(id);
      return () => setTitleId(undefined);
    },
    registerDescription: id => {
      setDescriptionId(id);
      return () => setDescriptionId(undefined);
    },

    // Overlay related
    isModal: () => props.isModal,
    preventScroll: () => props.preventScroll,
    closeOnInteractOutside: () => props.closeOnInteractOutside,
    closeOnEsc: () => props.closeOnEsc,
    shouldCloseOnInteractOutside: element => {
      return props.shouldCloseOnInteractOutside?.(element) ?? true;
    },

    // FocusTrapRegion related
    trapFocus: () => props.trapFocus,
    autoFocus: () => props.autoFocus,
    restoreFocus: () => props.restoreFocus,
    initialFocusSelector: () => props.initialFocusSelector,
    restoreFocusSelector: () => props.restoreFocusSelector,
  };

  return <PopoverContext.Provider value={context}>{props.children}</PopoverContext.Provider>;
};

Popover.Anchor = PopoverAnchor;
Popover.Trigger = PopoverTrigger;
Popover.Portal = PopoverPortal;
Popover.Positioner = PopoverPositioner;
Popover.Panel = PopoverPanel;
Popover.Arrow = PopoverArrow;
Popover.CloseButton = PopoverCloseButton;
Popover.Title = PopoverTitle;
Popover.Description = PopoverDescription;
