import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import { createSignal, createUniqueId, ParentComponent, splitProps } from "solid-js";

import { HoverCard, HoverCardProps } from "../hover-card";
import { createListState } from "../list";
import { createDisclosure, createRegisterId, focusSafely } from "../primitives";
import { createDomCollection } from "../primitives/create-dom-collection";
import { useOptionalDomCollectionContext } from "../primitives/create-dom-collection/dom-collection-context";
import { FocusStrategy } from "../selection";
import { Separator } from "../separator";
import { MenuContext, MenuContextValue, useOptionalMenuContext } from "./menu-context";
import { MenuGroup } from "./menu-group";
import { MenuGroupLabel } from "./menu-group-label";
import { MenuIcon } from "./menu-icon";
import { MenuItem } from "./menu-item";
import { MenuItemCheckbox } from "./menu-item-checkbox";
import { MenuItemDescription } from "./menu-item-description";
import { MenuItemIndicator } from "./menu-item-indicator";
import { MenuItemLabel } from "./menu-item-label";
import { MenuItemRadio } from "./menu-item-radio";
import { MenuPanel } from "./menu-panel";
import { MenuRadioGroup } from "./menu-radio-group";
import { MenuSub } from "./menu-sub";
import { MenuSubTrigger } from "./menu-sub-trigger";
import { MenuTrigger } from "./menu-trigger";
import { MenuItemModel } from "./types";

export type MenuComposite = {
  Trigger: typeof MenuTrigger;
  Icon: typeof MenuIcon;
  Portal: typeof HoverCard.Portal;
  Positioner: typeof HoverCard.Positioner;
  Panel: typeof MenuPanel;
  Arrow: typeof HoverCard.Arrow;
  Separator: typeof Separator;
  Group: typeof MenuGroup;
  GroupLabel: typeof MenuGroupLabel;
  Item: typeof MenuItem;
  ItemLabel: typeof MenuItemLabel;
  ItemDescription: typeof MenuItemDescription;
  ItemIndicator: typeof MenuItemIndicator;
  RadioGroup: typeof MenuRadioGroup;
  ItemRadio: typeof MenuItemRadio;
  ItemCheckbox: typeof MenuItemCheckbox;
  Sub: typeof MenuSub;
  SubTrigger: typeof MenuSubTrigger;
};

export interface MenuProps
  extends Omit<
    HoverCardProps,
    "closeOnHoverOutside" | "closeOnInteractOutside" | "closeDelay" | "openDelay"
  > {
  /** Handler that is called when the user activates a menu item. */
  onAction?: (key: string) => void;
}

/**
 * A menu displays a menu to the user—such as a set of actions or functions—triggered by a button.
 * `Menu` contains all the parts of a dropdown menu and provide context for its children.
 */
export const Menu: ParentComponent<MenuProps> & MenuComposite = props => {
  const parentDomCollectionContext = useOptionalDomCollectionContext();
  const parentMenuContext = useOptionalMenuContext();
  const defaultId = `menu-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      id: defaultId,
      placement: "bottom-start",
      closeOnEsc: true,
      isModal: parentMenuContext?.isModal() ?? true,
      preventScroll: parentMenuContext?.preventScroll() ?? true,
      trapFocus: parentMenuContext?.trapFocus() ?? true,
      autoFocus: true,
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
    "onAction",
  ]);

  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [panelRef, setPanelRef] = createSignal<HTMLDivElement>();
  const [triggerId, setTriggerId] = createSignal<string>();
  const [panelId, setPanelId] = createSignal<string>();

  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy | boolean | undefined>(true);

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

  const close = (deep?: boolean) => {
    disclosureState.close();

    if (deep) {
      parentMenuContext?.close(deep);
    }
  };

  const toggle = (focusStrategy?: FocusStrategy) => {
    if (disclosureState.isOpen()) {
      close();
    } else {
      setFocusStrategy(focusStrategy);
      open(focusStrategy);
    }
  };

  const focusPanel = () => {
    const panel = panelRef();

    if (panel) {
      focusSafely(panel);
    }
  };

  const context: MenuContextValue = {
    isOpen: () => disclosureState.isOpen(),
    isModal: () => others.isModal!,
    preventScroll: () => others.preventScroll!,
    trapFocus: () => others.trapFocus!,
    autoFocus: focusStrategy,
    listState: () => listState,
    parentMenuContext: () => parentMenuContext,
    triggerId,
    panelId,
    setTriggerRef,
    setPanelRef,
    open,
    close,
    toggle,
    focusPanel,
    onAction: key => local.onAction?.(key),
    registerItemToParentDomCollection: parentDomCollectionContext?.registerItem,
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
          closeOnInteractOutside={true}
          closeOnHoverOutside={parentMenuContext != null}
          openDelay={0}
          closeDelay={0}
          {...others}
        >
          {local.children}
        </HoverCard>
      </MenuContext.Provider>
    </DomCollectionProvider>
  );
};

Menu.Trigger = MenuTrigger;
Menu.Icon = MenuIcon;
Menu.Portal = HoverCard.Portal;
Menu.Positioner = HoverCard.Positioner;
Menu.Panel = MenuPanel;
Menu.Arrow = HoverCard.Arrow;
Menu.Separator = Separator;
Menu.Group = MenuGroup;
Menu.GroupLabel = MenuGroupLabel;
Menu.Item = MenuItem;
Menu.ItemLabel = MenuItemLabel;
Menu.ItemDescription = MenuItemDescription;
Menu.ItemIndicator = MenuItemIndicator;
Menu.RadioGroup = MenuRadioGroup;
Menu.ItemRadio = MenuItemRadio;
Menu.ItemCheckbox = MenuItemCheckbox;
Menu.Sub = MenuSub;
Menu.SubTrigger = MenuSubTrigger;
