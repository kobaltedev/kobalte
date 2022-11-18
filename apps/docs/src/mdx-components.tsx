import { Button } from "@kobalte/elements";
import { clsx } from "clsx";
import { ComponentProps, createSignal, Show, splitProps } from "solid-js";

import { CheckIcon, CopyIcon } from "./components/icons";

function Code(props: ComponentProps<"code">) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <code
      class={clsx(
        "rounded-md bg-zinc-100 px-[0.4em] py-[0.2em] text-[0.9em] font-mono break-words dark:bg-zinc-700",
        local.class
      )}
      {...others}
    />
  );
}

const Pre = (props: ComponentProps<"pre">) => {
  let domRef: HTMLPreElement | undefined;

  const [local, others] = splitProps(props, ["children"]);

  const [isCopied, setIsCopied] = createSignal(false);

  const reset = () => {
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    const innerText = domRef?.querySelector("code")?.innerText ?? "";
    setIsCopied(true);
    void navigator.clipboard.writeText(innerText);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <pre ref={domRef} onMouseLeave={reset} {...others}>
      <Button
        aria-label="copy to clipboard"
        onPress={copyToClipboard}
        class="cursor-default absolute top-2 right-2 z-10 text-base h-6 w-6 rounded appearance-none flex items-center justify-center bg-zinc-50 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      >
        <Show when={isCopied()} fallback={<CopyIcon class="h-4 w-4" />}>
          <CheckIcon class="h-4 w-4" />
        </Show>
      </Button>
      {local.children}
    </pre>
  );
};

export const mdxComponents = {
  code: Code,
  pre: Pre,
};
