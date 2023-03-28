import { Button } from "@kobalte/core";
import { Title as MetaTitle } from "@solidjs/meta";
import { clsx } from "clsx";
import { ComponentProps, createSignal, Show, splitProps } from "solid-js";

import { CheckIcon, CopyIcon } from "./components";

export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => {
    const [local, others] = splitProps(props, ["children"]);

    return (
      <h1 {...others}>
        <MetaTitle>{local.children + " – Kobalte"}</MetaTitle>
        {local.children}
      </h1>
    );
  },
  code: (props: ComponentProps<"code">) => {
    const [local, others] = splitProps(props, ["class"]);

    return (
      <span class={clsx(local.class, "not-prose")}>
        <code
          class={clsx(
            "kb-code rounded text-sky-800 bg-sky-100 px-[0.4em] py-[0.2em] text-[0.9em] font-mono break-words dark:text-sky-300 dark:bg-sky-900/60"
          )}
          {...others}
        />
      </span>
    );
  },
  pre: (props: ComponentProps<"pre">) => {
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
        <Button.Root
          aria-label="copy to clipboard"
          onClick={copyToClipboard}
          class={clsx(
            "kb-copy-btn transition outline-none absolute top-3 right-2 z-10 text-base h-6 w-6 rounded appearance-none flex items-center justify-center",
            isCopied()
              ? "text-emerald-700 hover:bg-emerald-200/50 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
              : "text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-900/60"
          )}
        >
          <Show when={isCopied()} fallback={<CopyIcon class="h-4 w-4" />}>
            <CheckIcon class="h-4 w-4" />
          </Show>
        </Button.Root>
        {local.children}
      </pre>
    );
  },
  table: (props: ComponentProps<"table">) => {
    const [local, others] = splitProps(props, ["class"]);

    return (
      <div style={{ "overflow-x": "auto" }}>
        <table class={clsx(local.class, "kb-table")} {...others} />
      </div>
    );
  },
  a: (props: ComponentProps<"a">) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a target="_blank" rel="noopener noreferrer" {...props} />;
  },
};
