/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */

import {
	type Orientation,
	callHandler,
	composeEventHandlers,
	contains,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import {
	type Component,
	type JSX,
	Show,
	type ValidComponent,
	createEffect,
	createUniqueId,
	onCleanup,
	onMount,
	splitProps,
} from "solid-js";

import { combineStyle } from "@solid-primitives/props";
import {
	DismissableLayer,
	type DismissableLayerRenderProps,
} from "../dismissable-layer";
import { useLocale } from "../i18n/i18n-provider";
import { createSelectableList } from "../list";
import { useOptionalMenubarContext } from "../menubar/menubar-context";
import { useOptionalNavigationMenuContext } from "../navigation-menu/navigation-menu-context";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { Popper } from "../popper";
import {
	type FocusOutsideEvent,
	type InteractOutsideEvent,
	type PointerDownOutsideEvent,
	createFocusScope,
} from "../primitives";
import { type MenuDataSet, useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";
import { MENUBAR_KEYS } from "./menu-trigger";

export interface MenuContentBaseOptions {
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

export interface MenuContentBaseCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
	onPointerEnter: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerMove: JSX.EventHandlerUnion<T, PointerEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onMouseDown: JSX.EventHandlerUnion<T, MouseEvent>;
	onFocusIn: JSX.EventHandlerUnion<T, FocusEvent>;
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
	style?: JSX.CSSProperties | string;
}

export interface MenuContentBaseRenderProps
	extends MenuContentBaseCommonProps,
		DismissableLayerRenderProps,
		MenuDataSet {
	role: "menu";
	tabIndex: number | undefined;
	"aria-labelledby": string | undefined;
	"data-orientation": Orientation;
}

export type MenuContentBaseProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MenuContentBaseOptions & Partial<MenuContentBaseCommonProps<ElementOf<T>>>;

export function MenuContentBase<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, MenuContentBaseProps<T>>,
) {
	let ref: HTMLElement | undefined;

	const rootContext = useMenuRootContext();
	const context = useMenuContext();
	const optionalMenubarContext = useOptionalMenubarContext();
	const optionalNavigationMenuContext = useOptionalNavigationMenuContext();

	const { direction } = useLocale();

	const mergedProps = mergeDefaultProps(
		{
			id: rootContext.generateId(`content-${createUniqueId()}`),
		},
		props as MenuContentBaseProps,
	);

	const [local, others] = splitProps(mergedProps, [
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
		return (
			context.parentMenuContext() == null &&
			optionalMenubarContext === undefined &&
			rootContext.isModal()
		);
	};

	const selectableList = createSelectableList(
		{
			selectionManager: context.listState().selectionManager,
			collection: context.listState().collection,
			autoFocus: context.autoFocus,
			deferAutoFocus: true, // ensure all menu items are mounted and collection is not empty before trying to autofocus.
			shouldFocusWrap: true,
			disallowTypeAhead: () =>
				!context.listState().selectionManager().isFocused(),
			orientation: () =>
				rootContext.orientation() === "horizontal" ? "vertical" : "horizontal",
		},
		() => ref,
	);

	createFocusScope(
		{
			trapFocus: () => isRootModalContent() && context.isOpen(),
			onMountAutoFocus: (event) => {
				if (optionalMenubarContext === undefined)
					local.onOpenAutoFocus?.(event);
			},
			onUnmountAutoFocus: local.onCloseAutoFocus,
		},
		() => ref,
	);

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		// Submenu key events bubble through portals. We only care about keys in this menu.
		if (!contains(e.currentTarget, e.target)) {
			return;
		}

		// Menus should not be navigated using tab key, so we prevent it.
		if (e.key === "Tab" && context.isOpen()) {
			e.preventDefault();
		}

		if (optionalMenubarContext !== undefined) {
			if (e.currentTarget.getAttribute("aria-haspopup") !== "true")
				switch (e.key) {
					case MENUBAR_KEYS.next(direction(), rootContext.orientation()):
						e.stopPropagation();
						e.preventDefault();
						context.close(true);
						optionalMenubarContext.setAutoFocusMenu(true);
						optionalMenubarContext.nextMenu();

						break;
					case MENUBAR_KEYS.previous(direction(), rootContext.orientation()):
						if (e.currentTarget.hasAttribute("data-closed")) break;

						e.stopPropagation();
						e.preventDefault();
						context.close(true);
						optionalMenubarContext.setAutoFocusMenu(true);
						optionalMenubarContext.previousMenu();
						break;
				}
		}
	};

	const onEscapeKeyDown = (e: KeyboardEvent) => {
		local.onEscapeKeyDown?.(e);

		optionalMenubarContext?.setAutoFocusMenu(false);

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

	const onPointerEnter: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, local.onPointerEnter);

		if (!context.isOpen()) {
			return;
		}

		// Remove visual focus from parent menu content.
		context
			.parentMenuContext()
			?.listState()
			.selectionManager()
			.setFocused(false);
		context
			.parentMenuContext()
			?.listState()
			.selectionManager()
			.setFocusedKey(undefined);
	};

	const onPointerMove: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
		e,
	) => {
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

	onCleanup(() => context.setContentRef(undefined));

	const commonAttributes: Omit<MenuContentBaseRenderProps, keyof MenuDataSet> =
		{
			ref: mergeRefs((el) => {
				context.setContentRef(el);
				ref = el;
			}, local.ref),
			role: "menu",
			get id() {
				return local.id;
			},
			get tabIndex() {
				return selectableList.tabIndex();
			},
			get "aria-labelledby"() {
				return context.triggerId();
			},
			onKeyDown: composeEventHandlers([
				local.onKeyDown,
				selectableList.onKeyDown,
				onKeyDown,
			]),
			onMouseDown: composeEventHandlers([
				local.onMouseDown,
				selectableList.onMouseDown,
			]),
			onFocusIn: composeEventHandlers([
				local.onFocusIn,
				selectableList.onFocusIn,
			]),
			onFocusOut: composeEventHandlers([
				local.onFocusOut,
				selectableList.onFocusOut,
			]),
			onPointerEnter,
			onPointerMove,
			get "data-orientation"() {
				return rootContext.orientation();
			},
		};

	return (
		<Show when={context.contentPresent()}>
			<Show
				when={
					optionalNavigationMenuContext === undefined ||
					context.parentMenuContext() != null
				}
				fallback={
					<Polymorphic<MenuContentBaseRenderProps>
						as="div"
						{...context.dataset()}
						{...commonAttributes}
						{...others}
					/>
				}
			>
				<Popper.Positioner>
					<DismissableLayer<
						Component<
							Omit<
								MenuContentBaseRenderProps,
								keyof DismissableLayerRenderProps
							>
						>
					>
						disableOutsidePointerEvents={
							isRootModalContent() && context.isOpen()
						}
						excludedElements={[context.triggerRef]}
						bypassTopMostLayerCheck
						style={combineStyle(
							{
								"--kb-menu-content-transform-origin":
									"var(--kb-popper-content-transform-origin)",
								position: "relative",
							},
							local.style,
						)}
						onEscapeKeyDown={onEscapeKeyDown}
						onFocusOutside={onFocusOutside}
						onDismiss={context.close}
						{...context.dataset()}
						{...commonAttributes}
						{...others}
					/>
				</Popper.Positioner>
			</Show>
		</Show>
	);
}
