/*!
 * Portions of this file are based on code from chakra-ui.
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/7d7e04d53d871e324debe0a2cb3ff44d7dbf3bca/packages/components/button/src/button.tsx
 */

import { createTagName } from "@kobalte/primitives";
import { mergeRefs } from "@kobalte/utils";
import { clsx } from "clsx";
import { createMemo, createSignal, onMount, Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { mergeComponentConfigProps } from "../component-config";
import { createPolymorphicComponent, mergeDefaultProps } from "../utils";
import { buttonStyles } from "./button.styles";
import { ButtonContext, useButtonContext } from "./button-context";
import { useButtonGroupContext } from "./button-group";
import { ButtonIcon } from "./button-icon";
import { ButtonLoader } from "./button-loader";
import { isButton } from "./is-button";
import { ButtonContentProps, ButtonProps } from "./types";

/**
 * Button is used to trigger an action or event,
 * such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.
 */
export const Button = createPolymorphicComponent<"button", ButtonProps>(props => {
  let ref: HTMLButtonElement | undefined;

  const buttonGroupContext = useButtonGroupContext();

  const propsWithButtonGroupDefaults = mergeDefaultProps(
    {
      get variant() {
        return buttonGroupContext?.variant;
      },
      get size() {
        return buttonGroupContext?.size;
      },
      get isDestructive() {
        return buttonGroupContext?.isDestructive;
      },
      get isDisabled() {
        return buttonGroupContext?.isDisabled;
      },
    },
    props
  );

  props = mergeComponentConfigProps(
    "Button",
    {
      as: "button",
      loaderPlacement: "start",
    },
    propsWithButtonGroupDefaults
  );

  const [local, contentProps, variantProps, others] = splitProps(
    props,
    [
      "as",
      "ref",
      "class",
      "type",
      "isLoading",
      "loaderPlacement",
      "loadingText",
      "loader",
      "isDisabled",
    ],
    ["children", "leftIcon", "rightIcon"],
    ["variant", "size", "isDestructive", "isFullWidth", "isIconOnly"]
  );

  const tagName = createTagName(
    () => ref,
    () => props.as || "button"
  );

  const [isNativeButton, setIsNativeButton] = createSignal(
    tagName() != null && isButton({ tagName: tagName(), type: local.type })
  );

  const type = createMemo(() => {
    if (local.type != null) {
      return local.type;
    }

    return isNativeButton() ? "button" : undefined;
  });

  const classNames = buttonStyles({
    get variant() {
      return variantProps.variant;
    },
    get size() {
      return variantProps.size;
    },
    get isDestructive() {
      return variantProps.isDestructive;
    },
    get isFullWidth() {
      return variantProps.isFullWidth;
    },
    get isIconOnly() {
      return variantProps.isIconOnly;
    },
    get hasLoadingText() {
      return !!local.loadingText;
    },
  });

  onMount(() => {
    ref != null && setIsNativeButton(isButton(ref));
  });

  return (
    <ButtonContext.Provider value={{ classNames }}>
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => (ref = el), local.ref)}
        role={!isNativeButton() && tagName() !== "a" ? "button" : undefined}
        type={type()}
        tabIndex={!isNativeButton() ? 0 : undefined}
        disabled={local.isDisabled}
        data-loading={local.isLoading || undefined}
        class={clsx(classNames().root, local.class)}
        {...others}
      >
        <Show when={local.isLoading && local.loaderPlacement === "start"}>
          <ButtonLoader>{local.loader}</ButtonLoader>
        </Show>
        <Show when={local.isLoading} fallback={<ButtonContent {...contentProps} />}>
          <Show
            when={local.loadingText}
            fallback={
              <span style={{ opacity: 0 }}>
                <ButtonContent {...contentProps} />
              </span>
            }
          >
            {local.loadingText}
          </Show>
        </Show>
        <Show when={local.isLoading && local.loaderPlacement === "end"}>
          <ButtonLoader>{local.loader}</ButtonLoader>
        </Show>
      </Dynamic>
    </ButtonContext.Provider>
  );
});

function ButtonContent(props: ButtonContentProps) {
  const buttonContext = useButtonContext();

  return (
    <>
      <Show when={props.leftIcon}>
        <ButtonIcon class={buttonContext.classNames().leftIcon}>{props.leftIcon}</ButtonIcon>
      </Show>
      {props.children}
      <Show when={props.rightIcon}>
        <ButtonIcon class={buttonContext.classNames().rightIcon}>{props.rightIcon}</ButtonIcon>
      </Show>
    </>
  );
}
