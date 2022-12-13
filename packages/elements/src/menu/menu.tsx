import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import { DialogPortal } from "../dialog/dialog-portal";
import { HoverCard, HoverCardProps } from "../hover-card";
import { useOptionalHoverCardContext } from "../hover-card/hover-card-context";
import { createListState } from "../list";
import { PopoverArrow } from "../popover/popover-arrow";
import { PopoverPositioner } from "../popover/popover-positioner";
import { createDisclosure, createRegisterId } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { FocusStrategy } from "../selection";
import { MenuContext, MenuContextValue } from "./menu-context";
import { MenuItem } from "./menu-item";
import { MenuPanel } from "./menu-panel";
import { MenuSub } from "./menu-sub";
import { MenuSubTrigger } from "./menu-sub-trigger";
import { MenuTrigger } from "./menu-trigger";
import { MenuItemModel } from "./types";

type MenuComposite = {
  Trigger: typeof MenuTrigger;
  Panel: typeof MenuPanel;
  Item: typeof MenuItem;
  Sub: typeof MenuSub;
  SubTrigger: typeof MenuSubTrigger;

  Portal: typeof DialogPortal;
  Positioner: typeof PopoverPositioner;
  Arrow: typeof PopoverArrow;
};

export interface MenuProps extends HoverCardProps {
  /** Whether the menu is disabled. */
  isDisabled?: boolean;

  /** Handler that is called when the user activates a menu item. */
  onAction?: (key: string) => void;
}

export const Menu: ParentComponent<MenuProps> & MenuComposite = props => {
  const defaultId = `menu-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      placement: "bottom-start",
      restoreFocus: true,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "id",
    "children",
    "isOpen",
    "defaultIsOpen",
    "onOpenChange",
    "isDisabled",
    "onAction",
  ]);

  const [triggerRef, setTriggerRef] = createSignal<HTMLButtonElement>();
  const [triggerId, setTriggerId] = createSignal<string>();
  const [panelId, setPanelId] = createSignal<string>();

  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy>();

  const [items, setItems] = createSignal<MenuItemModel[]>([]);

  const { DomCollectionProvider } = createDomCollection({ items, onItemsChange: setItems });

  const disclosureState = createDisclosure({
    isOpen: () => local.isOpen,
    defaultIsOpen: () => local.defaultIsOpen,
    onOpenChange: isOpen => local.onOpenChange?.(isOpen),
  });

  const listState = createListState({
    selectionMode: "none",
    dataSource: items,
  });

  const open = (focusStrategy?: FocusStrategy) => {
    setFocusStrategy(focusStrategy);
    disclosureState.open();
  };

  const toggle = (focusStrategy?: FocusStrategy) => {
    setFocusStrategy(focusStrategy);
    disclosureState.toggle();
  };

  const context: MenuContextValue = {
    isOpen: () => disclosureState.isOpen(),
    isDisabled: () => local.isDisabled ?? false,
    autoFocus: () => focusStrategy() || true,
    listState: () => listState,
    triggerId,
    panelId,
    setTriggerRef,
    open,
    close: disclosureState.close,
    toggle,
    onAction: key => local.onAction?.(key),
    generateId: createGenerateId(() => local.id!),
    registerTrigger: createRegisterId(setTriggerId),
    registerPanel: createRegisterId(setPanelId),
  };

  return (
    <DomCollectionProvider>
      <MenuContext.Provider value={context}>
        <HoverCard
          id={local.id}
          isOpen={disclosureState.isOpen()}
          onOpenChange={disclosureState.setIsOpen}
          anchorRef={triggerRef}
          {...others}
        >
          {local.children}
        </HoverCard>
      </MenuContext.Provider>
    </DomCollectionProvider>
  );
};

Menu.Trigger = MenuTrigger;
Menu.Panel = MenuPanel;
Menu.Item = MenuItem;
Menu.Sub = MenuSub;
Menu.SubTrigger = MenuSubTrigger;

Menu.Portal = DialogPortal;
Menu.Positioner = PopoverPositioner;
Menu.Arrow = PopoverArrow;
