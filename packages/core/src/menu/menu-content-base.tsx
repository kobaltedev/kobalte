/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */

import {
  callHandler,
  composeEventHandlers,
  contains,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, createUniqueId, JSX, onCleanup, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { createSelectableList } from "../list";
import { AsChildProp } from "../polymorphic";
import { PopperPositioner } from "../popper";
import {
  createFocusScope,
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "../primitives";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuContentBaseOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;

  /**
   * Event handler called when focus moves into the component after opening.
   * It can be prevented by calling `event.preventDefault`.
   */
  onOpenAutoFocus?: (event: Event) => void;

  /**
   * Event handler called when focus moves to the trigger after closing.
   * It can be prevented by calling `event.preventDefault`.
   */
  onCloseAutoFocus?: (event: Event) => void;

  /**
   * Event handler called when the escape key is down.
   * It can be prevented by calling `event.preventDefault`.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Event handler called when a pointer event occurs outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

  /**
   * Event handler called when the focus moves outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onFocusOutside?: (event: FocusOutsideEvent) => void;

  /**
   * Event handler called when an interaction (pointer or focus event) happens outside the bounds of the component.
   * It can be prevented by calling `event.preventDefault`.
   */
  onInteractOutside?: (event: InteractOutsideEvent) => void;
}

export interface MenuContentBaseProps
  extends OverrideComponentProps<"div", MenuContentBaseOptions> {}

export function MenuContentBase(props: MenuContentBaseProps) {
  let ref: HTMLElement | undefined;

  const rootContext = useMenuRootContext();
  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      id: rootContext.generateId(`content-${createUniqueId()}`),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "style",
    "onOpenAutoFocus",
    "onCloseAutoFocus",
    "onEscapeKeyDown",
    "onFocusOutside",
    "onPointerEnter",
    "onPointerMove",
    "onKeyDown",
    "onMouseDown",
    "onFocusIn",
    "onFocusOut",
  ]);

  let lastPointerX = 0;

  // Only the root menu can apply "modal" behavior (block pointer-events and trap focus).
  const isRootModalContent = () => {
    return context.parentMenuContext() == null && rootContext.isModal();
  };

  const selectableList = createSelectableList(
    {
      selectionManager: context.listState().selectionManager,
      collection: context.listState().collection,
      autoFocus: context.autoFocus,
      deferAutoFocus: true, // ensure all menu items are mounted and collection is not empty before trying to autofocus.
      shouldFocusWrap: true,
      disallowTypeAhead: () => !context.listState().selectionManager().isFocused(),
    },
    () => ref
  );

  createFocusScope(
    {
      trapFocus: () => isRootModalContent() && context.isOpen(),
      onMountAutoFocus: local.onOpenAutoFocus,
      onUnmountAutoFocus: local.onCloseAutoFocus,
    },
    () => ref
  );

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    // Submenu key events bubble through portals. We only care about keys in this menu.
    if (!contains(e.currentTarget, e.target)) {
      return;
    }

    // Menus should not be navigated using tab key, so we prevent it.
    if (e.key === "Tab" && context.isOpen()) {
      e.preventDefault();
    }
  };

  const onEscapeKeyDown = (e: KeyboardEvent) => {
    local.onEscapeKeyDown?.(e);

    // `createSelectableList` prevent escape key down,
    // which prevent our `onDismiss` in `DismissableLayer` to run,
    // so we force "close on escape" here.
    context.close(true);
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    local.onFocusOutside?.(e);

    if (rootContext.isModal()) {
      // When focus is trapped, a `focusout` event may still happen.
      // We make sure we don't trigger our `onDismiss` in such case.
      e.preventDefault();
    }
  };

  const onPointerEnter: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerEnter);

    if (!context.isOpen()) {
      return;
    }

    // Remove visual focus from parent menu content.
    context.parentMenuContext()?.listState().selectionManager().setFocused(false);
    context.parentMenuContext()?.listState().selectionManager().setFocusedKey(undefined);
  };

  const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerMove);

    if (e.pointerType !== "mouse") {
      return;
    }

    const target = e.target as HTMLElement;
    const pointerXHasChanged = lastPointerX !== e.clientX;

    // We don't use `event.movementX` for this check because Safari will
    // always return `0` on a pointer event.
    if (contains(e.currentTarget, target) && pointerXHasChanged) {
      context.setPointerDir(e.clientX > lastPointerX ? "right" : "left");
      lastPointerX = e.clientX;
    }
  };

  createEffect(() => onCleanup(context.registerContentId(local.id!)));

  return (
    <Show when={context.contentPresence.isPresent()}>
      <PopperPositioner>
        <DismissableLayer
          ref={mergeRefs(el => {
            context.setContentRef(el);
            context.contentPresence.setRef(el);
            ref = el;
          }, local.ref)}
          role="menu"
          id={local.id}
          tabIndex={selectableList.tabIndex()}
          disableOutsidePointerEvents={isRootModalContent() && context.isOpen()}
          excludedElements={[context.triggerRef]}
          style={{
            "--kb-menu-content-transform-origin": "var(--kb-popper-content-transform-origin)",
            position: "relative",
            ...local.style,
          }}
          aria-labelledby={context.triggerId()}
          onEscapeKeyDown={onEscapeKeyDown}
          onFocusOutside={onFocusOutside}
          onDismiss={context.close}
          onKeyDown={composeEventHandlers([local.onKeyDown, selectableList.onKeyDown, onKeyDown])}
          onMouseDown={composeEventHandlers([local.onMouseDown, selectableList.onMouseDown])}
          onFocusIn={composeEventHandlers([local.onFocusIn, selectableList.onFocusIn])}
          onFocusOut={composeEventHandlers([local.onFocusOut, selectableList.onFocusOut])}
          onPointerEnter={onPointerEnter}
          onPointerMove={onPointerMove}
          {...context.dataset()}
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
}
