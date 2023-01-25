/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/c183944ce6a8ca1cf280a1c7b88d2ba393dd0252/packages/@react-aria/accordion/src/useAccordion.ts
 */

import {
  callHandler,
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import * as Button from "../button";
import * as Collapsible from "../collapsible";
import { CollectionItem, PRESS_HANDLERS_PROP_NAMES, PressHandlerSymbol } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useAccordionContext } from "./accordion-context";
import { useAccordionItemContext } from "./accordion-item-context";

export const AccordionTrigger = createPolymorphicComponent<
  "button",
  Omit<Button.ButtonRootOptions, "isDisabled">
>(props => {
  let ref: HTMLElement | undefined;

  const accordionContext = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const defaultId = itemContext.generateId("trigger");

  props = mergeDefaultProps(
    {
      as: "button",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "ref", "onFocus", ...PRESS_HANDLERS_PROP_NAMES]);

  createDomCollectionItem<CollectionItem>({
    getItem: () => ({
      ref: () => ref,
      key: itemContext.value(),
      isDisabled: itemContext.isDisabled(),
      label: "", // not applicable
      textValue: "", // not applicable
    }),
  });

  const selectableItem = createSelectableItem(
    {
      key: () => itemContext.value(),
      selectionManager: () => accordionContext.listState().selectionManager(),
      isDisabled: () => itemContext.isDisabled(),
    },
    () => ref
  );

  // Mark the handlers below as coming from a `createPress` primitive and prevent them from executing their
  // default behavior when a component that use `createPress` under the hood
  // is passed to the `as` prop of another component that use `createPress` under the hood.
  // This is necessary to prevent `createPress` logic being executed twice.
  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    if (local.onKeyDown) {
      callHandler(e, local.onKeyDown);

      // @ts-ignore
      if (local.onKeyDown[PressHandlerSymbol]) {
        return;
      }
    }

    composeEventHandlers([
      selectableItem.pressHandlers.onKeyDown,
      selectableItem.longPressHandlers.onKeyDown,
    ])(e);
  };

  // @ts-ignore
  onKeyDown[PressHandlerSymbol] = true;

  const onKeyUp: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    if (local.onKeyUp) {
      callHandler(e, local.onKeyUp);

      // @ts-ignore
      if (local.onKeyUp[PressHandlerSymbol]) {
        return;
      }
    }

    composeEventHandlers([
      selectableItem.pressHandlers.onKeyUp,
      selectableItem.longPressHandlers.onKeyUp,
    ])(e);
  };

  // @ts-ignore
  onKeyUp[PressHandlerSymbol] = true;

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    if (local.onClick) {
      callHandler(e, local.onClick);

      // @ts-ignore
      if (local.onClick[PressHandlerSymbol]) {
        return;
      }
    }

    composeEventHandlers([
      selectableItem.pressHandlers.onClick,
      selectableItem.longPressHandlers.onClick,
    ])(e);
  };

  // @ts-ignore
  onClick[PressHandlerSymbol] = true;

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (local.onPointerDown) {
      callHandler(e, local.onPointerDown);

      // @ts-ignore
      if (local.onPointerDown[PressHandlerSymbol]) {
        return;
      }
    }

    composeEventHandlers([
      selectableItem.pressHandlers.onPointerDown,
      selectableItem.longPressHandlers.onPointerDown,
    ])(e);
  };

  // @ts-ignore
  onPointerDown[PressHandlerSymbol] = true;

  const onPointerUp: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (local.onPointerUp) {
      callHandler(e, local.onPointerUp);

      // @ts-ignore
      if (local.onPointerUp[PressHandlerSymbol]) {
        return;
      }
    }

    composeEventHandlers([
      selectableItem.pressHandlers.onPointerUp,
      selectableItem.longPressHandlers.onPointerUp,
    ])(e);
  };

  // @ts-ignore
  onPointerUp[PressHandlerSymbol] = true;

  const onMouseDown: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    if (local.onMouseDown) {
      callHandler(e, local.onMouseDown);

      // @ts-ignore
      if (local.onMouseDown[PressHandlerSymbol]) {
        return;
      }
    }

    composeEventHandlers([
      selectableItem.otherHandlers.onMouseDown,
      selectableItem.pressHandlers.onMouseDown,
      selectableItem.longPressHandlers.onMouseDown,
    ])(e);
  };

  // @ts-ignore
  onMouseDown[PressHandlerSymbol] = true;

  const onDragStart: JSX.EventHandlerUnion<any, DragEvent> = e => {
    if (local.onDragStart) {
      callHandler(e, local.onDragStart);

      // @ts-ignore
      if (local.onDragStart[PressHandlerSymbol]) {
        return;
      }
    }

    composeEventHandlers([
      selectableItem.pressHandlers.onDragStart,
      selectableItem.longPressHandlers.onDragStart,
      selectableItem.otherHandlers.onDragStart,
    ])(e);
  };

  // @ts-ignore
  onDragStart[PressHandlerSymbol] = true;

  createEffect(() => onCleanup(itemContext.registerTriggerId(others.id!)));

  return (
    <Collapsible.Trigger
      ref={mergeRefs(el => (ref = el), local.ref)}
      isDisabled={selectableItem.isDisabled()}
      data-key={selectableItem.dataKey()}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseDown={onMouseDown}
      onDragStart={onDragStart}
      onFocus={composeEventHandlers([local.onFocus, selectableItem.otherHandlers.onFocus])}
      {...others}
    />
  );
});
