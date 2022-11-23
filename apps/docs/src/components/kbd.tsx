import { clsx } from "clsx";
import { ComponentProps, splitProps } from "solid-js";

export function Kbd(props: ComponentProps<"kbd">) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <kbd
      class={clsx(
        local.class,
        "rounded-md border border-solid border-b-[3px] px-[0.4em] py-[0.1em] text-zinc-900 font-mono text-[0.8em] font-bold bg-zinc-100 border-zinc-300 dark:text-white/90 dark:bg-zinc-800 dark:border-zinc-600"
      )}
      {...others}
    />
  );
}
