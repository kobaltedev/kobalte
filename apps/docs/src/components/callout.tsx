import { clsx } from "clsx";
import { ComponentProps, splitProps } from "solid-js";

interface CalloutProps extends ComponentProps<"div"> {
  type: "note" | "warning";
}

export function Callout(props: CalloutProps) {
  const [local, others] = splitProps(props, ["type", "class"]);

  return (
    <div
      class={clsx(
        local.class,
        "not-prose flex items-center rounded-md mt-6 px-4 py-3 text-base",
        local.type === "note"
          ? "text-blue-800 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
          : "text-amber-800 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20"
      )}
      {...others}
    />
  );
}
