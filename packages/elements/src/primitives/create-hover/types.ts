/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/2bcc2f0b45ea8b20621458a93f1804a3f9df9ac4/packages/@react-types/shared/src/events.d.ts
 * https://github.com/adobe/react-spectrum/blob/2bcc2f0b45ea8b20621458a93f1804a3f9df9ac4/packages/@react-aria/interactions/src/useHover.ts
 */

import { MaybeAccessor } from "@kobalte/utils";
import { Accessor, JSX } from "solid-js";

import { PointerType } from "../create-press";

export interface HoverEvent {
  /** The type of hover event being fired. */
  type: "hoverstart" | "hoverend";

  /** The pointer type that triggered the hover event. */
  pointerType: PointerType;

  /** The target element of the hover event. */
  target: HTMLElement;
}

export interface HoverEvents {
  /** Handler that is called when a hover interaction starts. */
  onHoverStart?: (e: HoverEvent) => void;

  /** Handler that is called when a hover interaction ends. */
  onHoverEnd?: (e: HoverEvent) => void;

  /** Handler that is called when the hover state changes. */
  onHoverChange?: (isHovering: boolean) => void;
}

export interface CreateHoverProps extends HoverEvents {
  /** Whether the hover events should be disabled. */
  isDisabled?: MaybeAccessor<boolean | undefined>;
}

export interface HoverHandlers<T extends HTMLElement> {
  onPointerEnter: JSX.EventHandlerUnion<T, PointerEvent>;
  onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
}

export interface CreateHoverResult<T extends HTMLElement> {
  /** Whether the target is currently hovered. */
  isHovered: Accessor<boolean>;

  /** Event handlers to spread onto the target element. */
  hoverHandlers: HoverHandlers<T>;
}
