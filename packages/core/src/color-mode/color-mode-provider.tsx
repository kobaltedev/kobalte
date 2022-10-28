/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/color-mode/src/color-mode-provider.tsx
 */

import { createEffect, createSignal, on, onCleanup } from "solid-js";

import { ColorModeContext } from "./color-mode-context";
import { localStorageManager } from "./storage-manager";
import {
  ColorMode,
  ColorModeContextType,
  ColorModeProviderProps,
  ConfigColorMode,
} from "./types";
import {
  addColorModeListener,
  getInitialColorMode,
  getSystemColorMode,
  setColorModeClassName,
  setColorModeDataset,
} from "./utils";

/**
 * Provides context for the color mode based on config in `theme`
 * Returns the color mode and function to toggle the color mode
 */
export function ColorModeProvider(props: ColorModeProviderProps) {
  const colorModeManager = () => props.storageManager ?? localStorageManager;
  const fallbackColorMode = () =>
    props.initialColorMode === "dark" ? "dark" : "light";
  let colorModeListenerCleanupFn: (() => unknown) | undefined;

  const [colorMode, rawSetColorMode] = createSignal(
    getInitialColorMode(colorModeManager(), fallbackColorMode())
  );

  const applyColorMode = (value: ColorMode) => {
    rawSetColorMode(value);

    setColorModeClassName(value === "dark");
    setColorModeDataset(value, props.disableTransitionOnChange);
  };

  const setColorMode = (value: ConfigColorMode) => {
    if (colorModeListenerCleanupFn) {
      colorModeListenerCleanupFn();
      colorModeListenerCleanupFn = undefined;
    }

    const isSystem = value === "system";

    if (isSystem) {
      colorModeListenerCleanupFn = addColorModeListener(applyColorMode);
    }

    applyColorMode(isSystem ? getSystemColorMode() : value);
    colorModeManager().set(value);
  };

  const toggleColorMode = () => {
    setColorMode(colorMode() === "dark" ? "light" : "dark");
  };

  createEffect(
    on(
      [colorModeManager, fallbackColorMode, () => props.initialColorMode],
      ([colorModeManager, fallbackColorMode, initialColorMode]) => {
        const managerValue = colorModeManager.get();

        if (managerValue) {
          setColorMode(managerValue);
          return;
        }

        if (initialColorMode === "system") {
          setColorMode("system");
          return;
        }

        setColorMode(fallbackColorMode);
      }
    )
  );

  onCleanup(() => {
    // ensure listener is always cleaned when component is destroyed.
    colorModeListenerCleanupFn?.();
  });

  const context: ColorModeContextType = {
    colorMode,
    setColorMode,
    toggleColorMode,
  };

  return (
    <ColorModeContext.Provider value={context}>
      {props.children}
    </ColorModeContext.Provider>
  );
}
