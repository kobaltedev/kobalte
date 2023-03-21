import {
  composeEventHandlers,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { Accessor, createContext, JSX, onMount, splitProps, useContext } from "solid-js";

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

  onMount(() => {
    context.state.setThumbEditable(index(), !context.state.isDisabled());
  });

  return (
    <ThumbContext.Provider value={{ index: index }}>
      <Polymorphic
        ref={mergeRefs(el => (ref = el), local.ref)}
        fallback="span"
        children={props.children}
        aria-label={others["aria-label"]}
        aria-valuetext={context.state.getThumbValueLabel(index())}
        aria-valuemin={context.minValue()}
        aria-valuenow={value()}
        aria-valuemax={context.maxValue()}
        aria-orientation={context.state.orientation()}
        {...context.dataset()}
        tabIndex={context.state.isDisabled() ? undefined : 0}
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
    </ThumbContext.Provider>
  );
}

const ThumbContext = createContext<{ index: Accessor<number> }>();

export function useThumbContext() {
  const context = useContext(ThumbContext);

  if (context === undefined) {
    throw new Error("[kobalte]: `useThumbContext` must be used within a `Slider.Thumb` component");
  }

  return context;
}