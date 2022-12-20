import { Separator as SeparatorBase } from "@kobalte/core";
import { ComponentProps } from "solid-js";

export function Separator(props: ComponentProps<typeof SeparatorBase>) {
  return (
    <SeparatorBase
      class="border-none bg-zinc-300 data-[orientation='horizontal']:h-px data-[orientation='horizontal']:w-full data-[orientation='vertical']:w-px data-[orientation='vertical']:h-full dark:bg-zinc-700"
      {...props}
    />
  );
}
