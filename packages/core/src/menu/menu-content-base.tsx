import {
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, Show, splitProps } from "solid-js";

import { DismissableLayer } from "../dismissable-layer";
import { createSelectableList } from "../list";
import { PopperPositioner } from "../popper/popper-positioner";
import {
  createFocusRing,
  createFocusScope,
  createHideOutside,
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "../primitives";
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
      id: rootContext.generateId("content"),
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
  ]);

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
          onKeyDown={composeEventHandlers([local.onKeyDown, selectableList.handlers.onKeyDown])}
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
          {...others}
        />
      </PopperPositioner>
    </Show>
  );
});
