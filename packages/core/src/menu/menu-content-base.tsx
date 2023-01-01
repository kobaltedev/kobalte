import {
  composeEventHandlers,
  createPolymorphicComponent,
  getActiveElement,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, createUniqueId, JSX, onCleanup, Show, splitProps } from "solid-js";
import { isServer } from "solid-js/web";

import { DismissableLayer } from "../dismissable-layer";
import { createSelectableList } from "../list";
import { PopperPositioner } from "../popper/popper-positioner";
import {
  createFocusRing,
  createFocusScope,
  createHideOutside,
  createHover,
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "../primitives";
import { MENU_TIMEOUT_DELAY } from "./menu";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuContentBaseOptions {
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

export const MenuContentBase = createPolymorphicComponent<"div", MenuContentBaseOptions>(props => {
  let ref: HTMLElement | undefined;

  const rootContext = useMenuRootContext();
  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
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
    "onKeyDown",
    "onFocusIn",
    "onFocusOut",
    "onMouseDown",
    "onPointerEnter",
    "onPointerLeave",
  ]);

  let updateParentIsPointerInNestedMenuTimeoutId: number | undefined;

  const clearUpdateParentIsPointerInNestedMenuTimeout = () => {
    if (isServer) {
      return;
    }

    window.clearTimeout(updateParentIsPointerInNestedMenuTimeoutId);
    updateParentIsPointerInNestedMenuTimeoutId = undefined;
  };

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    // Prevent shift + tab from doing anything when focus should be trapped.
    if (context.isOpen() && rootContext.isModal() && e.shiftKey && e.key === "Tab") {
      e.preventDefault();
    }
  };

  const onEscapeKeyDown = (e: KeyboardEvent) => {
    local.onEscapeKeyDown?.(e);

    // `createSelectableList` prevent escape key down,
    // which prevent our `onDismiss` in `DismissableLayer` to run,
    // so we force "close on escape" here.
    rootContext.close();
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    local.onFocusOutside?.(e);

    if (rootContext.isModal()) {
      // When focus is trapped, a `focusout` event may still happen.
      // We make sure we don't trigger our `onDismiss` in such case.
      e.preventDefault();
    }
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

  const { hoverHandlers } = createHover({
    isDisabled: () => !(context.isOpen() && rootContext.isModal()),
    onHoverStart: () => {
      clearUpdateParentIsPointerInNestedMenuTimeout();

      // Cancel the closing attempt initiated by `MenuSubTrigger` pointer leave.
      context.clearCloseTimeout();

      // Don't focus the parent menu content.
      context.parentMenuContext()?.clearFocusContentTimeout();

      context.parentMenuContext()?.setIsPointerInNestedMenu(true);
      context.setIsPointerInNestedMenu(false);

      // Remove the grace polygon created when leaving the `MenuSubTrigger`.
      context.setPointerGracePolygon(null);
    },
    onHoverEnd: () => {
      context.listState().selectionManager().setFocused(false);
      context.listState().selectionManager().setFocusedKey(undefined);

      updateParentIsPointerInNestedMenuTimeoutId = window.setTimeout(() => {
        // If pointer is in a sub menu of this menu, it's also considered in a sub menu of the parent menu.
        context.parentMenuContext()?.setIsPointerInNestedMenu(context.isPointerInNestedMenu());

        clearUpdateParentIsPointerInNestedMenuTimeout();
      }, MENU_TIMEOUT_DELAY);
    },
  });

  const { isFocused, isFocusVisible, focusRingHandlers } = createFocusRing();

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  createHideOutside({
    isDisabled: () => !(context.isOpen() && rootContext.isModal()),
    targets: () => {
      const keepVisible = [];

      const parentMenuContent = context.parentMenuContext()?.contentRef();

      if (parentMenuContent) {
        keepVisible.push(parentMenuContent);
      }

      if (ref) {
        keepVisible.push(ref);
      }

      return keepVisible;
    },
  });

  createFocusScope(
    {
      trapFocus: () => context.isOpen() && rootContext.isModal(),
      onMountAutoFocus: local.onOpenAutoFocus,
      onUnmountAutoFocus: local.onCloseAutoFocus,
    },
    () => ref
  );

  createEffect(() => onCleanup(context.registerContentId(local.id!)));

  onCleanup(() => {
    clearUpdateParentIsPointerInNestedMenuTimeout();
  });

  return (
    <Show when={context.shouldMount()}>
      <PopperPositioner>
        <DismissableLayer
          ref={mergeRefs(el => {
            context.setContentRef(el);
            ref = el;
          }, local.ref)}
          role="menu"
          id={local.id}
          tabIndex={selectableList.tabIndex()}
          excludedElements={[context.triggerRef]}
          style={{ position: "relative", ...local.style }}
          aria-labelledby={context.triggerId()}
          data-focus={isFocused() ? "" : undefined}
          data-focus-visible={isFocusVisible() ? "" : undefined}
          onEscapeKeyDown={onEscapeKeyDown}
          onFocusOutside={onFocusOutside}
          onDismiss={context.close}
          onKeyDown={composeEventHandlers([
            local.onKeyDown,
            selectableList.handlers.onKeyDown,
            onKeyDown,
          ])}
          onFocusIn={composeEventHandlers([
            local.onFocusIn,
            selectableList.handlers.onFocusIn,
            focusRingHandlers.onFocusIn,
          ])}
          onFocusOut={composeEventHandlers([
            local.onFocusOut,
            selectableList.handlers.onFocusOut,
            focusRingHandlers.onFocusOut,
          ])}
          onMouseDown={composeEventHandlers([
            local.onMouseDown,
            selectableList.handlers.onMouseDown,
          ])}
          onPointerEnter={composeEventHandlers([
            local.onPointerEnter,
            hoverHandlers.onPointerEnter,
          ])}
          onPointerLeave={composeEventHandlers([
            local.onPointerLeave,
            hoverHandlers.onPointerLeave,
          ])}
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
});
