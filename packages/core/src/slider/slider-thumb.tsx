import {
  composeEventHandlers,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, onMount, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { CollectionItemWithRef } from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { useSliderContext } from "./slider-context";

export interface SliderThumbProps extends OverrideComponentProps<"span", AsChildProp> {
  style?: JSX.CSSProperties;
}

export function SliderThumb(props: SliderThumbProps) {
  let ref: HTMLElement | undefined;
  const context = useSliderContext();

  props = mergeDefaultProps({ id: context.generateId("thumb") }, props);
  const [local, others] = splitProps(props, ["ref", "style"]);

  createDomCollectionItem<CollectionItemWithRef>({
    getItem: () => ({
      ref: () => ref,
      isDisabled: context.state.isDisabled(),
      key: others.id!,
      textValue: "",
      type: "item",
    }),
  });
  const index = () => (ref ? context.thumbs().findIndex(v => v.ref() === ref) : -1);
  const value = () => context.state.getThumbValue(index()) as number | undefined;
  const position = () => {
    return context.state.getThumbPercent(index());
  };
  const isFocused = () => context.state.focusedThumb() && context.state.focusedThumb() === index();
  createEffect(() => {
    console.log(context.thumbs());
  });

  onMount(() => {
    context.state.setThumbEditable(index(), !context.isDisabled());
    onCleanup(() => {
      if (ref) {
        // context.setThumbs(p => p.delete(ref!));
      }
    });
  });

  return (
    <Polymorphic
      ref={mergeRefs(el => (ref = el), local.ref)}
      fallback="span"
      children={props.children}
      aria-label={others["aria-label"]}
      // aria-valuetext={context.state.getThumbValueLabel(local.index)}
      aria-valuemin={context.minValue}
      aria-valuenow={value()}
      aria-valuemax={context.maxValue}
      aria-orientation={context.orientation}
      {...context.dataset()}
      tabIndex={context.isDisabled() ? undefined : 0}
      onFocus={composeEventHandlers([
        props.onFocus,
        () => {
          context.state.setFocusedThumb(index());
        },
      ])}
      style={{
        display: value() === undefined ? "none" : undefined,
        position: "absolute",
        [context.startEdge]: `${position() * 100}%`,
        transform: "translate(-50%, -50%)",
        "touch-action": "none",
        ...local.style,
      }}
      {...others}
    />
  );
}
