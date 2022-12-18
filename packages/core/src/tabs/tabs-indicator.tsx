/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/703ab7b4559ecd4fc611e7f2c0e758867990fe01/packages/@react-spectrum/tabs/src/Tabs.tsx
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, createSignal, JSX, on, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useLocale } from "../i18n";
import { useTabsContext } from "./tabs-context";

export interface TabsIndicatorProps {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

/**
 * A line commonly displayed at the bottom of the tab list to visually indicate the selected tab.
 * It provides the base style needed to display a smooth translation to the new selected tab.
 */
export const TabsIndicator = createPolymorphicComponent<"div", TabsIndicatorProps>(props => {
  const context = useTabsContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "style"]);

  const [style, setStyle] = createSignal<JSX.CSSProperties>({
    width: undefined,
    height: undefined,
  });

  let isFirstLoad = true;

  const locale = useLocale();

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
      locale().direction === "rtl"
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

  createEffect(
    on(
      [context.selectedTab, context.orientation, locale],
      () => {
        // For the first run, wait for all tabs to be mounted and registered in tabs DOM collection
        // before computing the style.
        if (isFirstLoad) {
          queueMicrotask(() => {
            computeStyle();
          });
          isFirstLoad = false;
          return;
        }

        // Compute style normally for subsequent runs.
        computeStyle();
      },
      { defer: true }
    )
  );

  return (
    <Dynamic
      component={local.as}
      role="presentation"
      style={{ ...style(), ...local.style }}
      {...others}
    />
  );
});