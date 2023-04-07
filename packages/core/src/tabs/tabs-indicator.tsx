/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/703ab7b4559ecd4fc611e7f2c0e758867990fe01/packages/@react-spectrum/tabs/src/Tabs.tsx
 */

import { OverrideComponentProps } from "@kobalte/utils";
import { createEffect, createSignal, JSX, on, onMount, splitProps } from "solid-js";

import { useLocale } from "../i18n";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { useTabsContext } from "./tabs-context";

export interface TabsIndicatorOptions extends AsChildProp {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface TabsIndicatorProps extends OverrideComponentProps<"div", TabsIndicatorOptions> {}

/**
 * The visual indicator displayed at the bottom of the tab list to indicate the selected tab.
 * It provides the base style needed to display a smooth transition to the new selected tab.
 */
export function TabsIndicator(props: TabsIndicatorProps) {
  const context = useTabsContext();

  const [local, others] = splitProps(props, ["style"]);

  const [style, setStyle] = createSignal<JSX.CSSProperties>({
    width: undefined,
    height: undefined,
  });

  const { direction } = useLocale();

  const computeStyle = () => {
    const selectedTab = context.selectedTab();

    if (selectedTab == null) {
      return;
    }

    const styleObj: JSX.CSSProperties = {
      transform: undefined,
      width: undefined,
      height: undefined,
    };

    // In RTL, calculate the transform from the right edge of the tab list
    // so that resizing the window doesn't break the TabIndicator position due to offsetLeft changes
    const offset =
      direction() === "rtl"
        ? -1 *
          ((selectedTab.offsetParent as HTMLElement)?.offsetWidth -
            selectedTab.offsetWidth -
            selectedTab.offsetLeft)
        : selectedTab.offsetLeft;

    styleObj.transform =
      context.orientation() === "vertical"
        ? `translateY(${selectedTab.offsetTop}px)`
        : `translateX(${offset}px)`;

    if (context.orientation() === "horizontal") {
      styleObj.width = `${selectedTab.offsetWidth}px`;
    } else {
      styleObj.height = `${selectedTab.offsetHeight}px`;
    }

    setStyle(styleObj);
  };

  // For the first run, wait for all tabs to be mounted and registered in tabs DOM collection
  // before computing the style.
  onMount(() => {
    queueMicrotask(() => {
      computeStyle();
    });
  });

  // Compute style normally for subsequent runs.
  createEffect(
    on(
      [context.selectedTab, context.orientation, direction],
      () => {
        computeStyle();
      },
      { defer: true }
    )
  );

  return (
    <Polymorphic
      as="div"
      role="presentation"
      style={{ ...style(), ...local.style }}
      data-orientation={context.orientation()}
      {...others}
    />
  );
}
