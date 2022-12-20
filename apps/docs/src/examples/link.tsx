import { Link as LinkBase } from "@kobalte/core";
import { ComponentProps } from "solid-js";

export function Link(props: ComponentProps<typeof LinkBase>) {
  return (
    <LinkBase
      class="text-blue-600 dark:text-blue-500 hover:underline ui-disabled:cursor-not-allowed ui-disabled:opacity-40 ui-disabled:hover:no-underline"
      {...props}
    />
  );
}
