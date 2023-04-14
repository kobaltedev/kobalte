/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/f6e686fe9d3b983d48650980c1ecfdde320bc62f/packages/@react-aria/datepicker/src/useDatePickerGroup.ts
 */

import {
  callHandler,
  createFocusManager,
  getFocusableTreeWalker,
  getWindow,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useDatePickerContext } from "./date-picker-context";

export interface DatePickerControlOptions {}

export interface DatePickerControlProps
  extends OverrideComponentProps<"div", DatePickerControlOptions> {}

/**
 * Contains the date picker input and trigger.
 */
export function DatePickerControl(props: DatePickerControlProps) {
  let ref: HTMLDivElement | undefined;

  const formControlContext = useFormControlContext();
  const context = useDatePickerContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "onPointerDown",
    "onClick",
    "onKeyDown",
    "aria-labelledby",
  ]);

  const focusManager = createFocusManager(() => ref);

  const ariaLabelledBy = () => {
    return formControlContext.getAriaLabelledBy(
      others.id,
      others["aria-label"],
      local["aria-labelledby"]
    );
  };

  // Focus the first placeholder segment from the end on mouse down/touch up in the field.
  const focusLast = () => {
    if (!ref) {
      return;
    }

    // Try to find the segment prior to the element that was clicked on.
    let target = getWindow(ref).event?.target as HTMLElement;
    const walker = getFocusableTreeWalker(ref, { tabbable: true });

    if (target) {
      walker.currentNode = target;
      target = walker.previousNode() as HTMLElement;
    }

    // If no target found, find the last element from the end.
    if (!target) {
      let last: HTMLElement;

      do {
        last = walker.lastChild() as HTMLElement;
        if (last) {
          target = last;
        }
      } while (last);
    }

    // Now go backwards until we find an element that is not a placeholder.
    while (target?.hasAttribute("data-placeholder")) {
      const prev = walker.previousNode() as HTMLElement;

      if (prev && prev.hasAttribute("data-placeholder")) {
        target = prev;
      } else {
        break;
      }
    }

    if (target) {
      target.focus();
    }
  };

  let pointerDownType: PointerEvent["pointerType"] | null = null;

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    pointerDownType = e.pointerType;

    // Focus last occurs on mouse down.
    if (e.pointerType === "mouse") {
      focusLast();
    }
  };

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);

    // If pointerType is touch/pen, make focus last happen on click.
    if (pointerDownType !== "mouse") {
      focusLast();
    }
  };

  const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    // Open the popover on alt + arrow down/up
    if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      e.stopPropagation();
      context.open();
    }

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        e.stopPropagation();
        if (context.direction() === "rtl") {
          focusManager.focusNext();
        } else {
          focusManager.focusPrevious();
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        e.stopPropagation();
        if (context.direction() === "rtl") {
          focusManager.focusPrevious();
        } else {
          focusManager.focusNext();
        }
        break;
    }
  };

  return (
    <Polymorphic
      as="div"
      role="group"
      ref={mergeRefs(el => {
        context.setControlRef(el);
        ref = el;
      }, local.ref)}
      aria-disabled={context.isDisabled() || undefined}
      aria-labelledby={ariaLabelledBy()}
      aria-describedby={context.ariaDescribedBy()}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...context.dataset()}
      {...formControlContext.dataset()}
      {...others}
    />
  );
}
