import { Button as ButtonBase } from "@kobalte/core";
import { ComponentProps, createSignal, Show } from "solid-js";

export function Button(props: ComponentProps<typeof ButtonBase>) {
  return (
    <ButtonBase
      class="appearance-none outline-none h-10 px-4 rounded-md text-white bg-blue-600 dark:text-white/90 disabled:opacity-40 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500/30"
      {...props}
    />
  );
}

export function EventsExample() {
  const [pointerType, setPointerType] = createSignal<string>();

  return (
    <>
      <Button
        onPressStart={e => setPointerType(e.pointerType)}
        onPressEnd={() => setPointerType(undefined)}
      >
        Press me
      </Button>
      <p class="not-prose text-sm mt-2">
        <Show when={pointerType()} fallback="Ready to be pressed.">
          You are pressing the button with a {pointerType()}!
        </Show>
      </p>
    </>
  );
}
