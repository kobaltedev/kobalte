import { Tabs } from "@kobalte/core";
import { clsx } from "clsx";
import { ComponentProps, ParentComponent, splitProps } from "solid-js";

type TabsSnippetsComposite = {
  List: typeof Tabs.List;
  Trigger: typeof Tabs.Trigger;
  Content: typeof Tabs.Content;
};

export const TabsSnippets: ParentComponent<ComponentProps<typeof Tabs.Root>> &
  TabsSnippetsComposite = props => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <Tabs.Root
      class={clsx(
        "kb-tabs-snippets not-prose my-6 overflow-y-auto rounded-lg border border-solid border-zinc-200 bg-[#fafafa] dark:bg-[#27272a] dark:border-[#3f3f46]",
        local.class
      )}
      {...others}
    />
  );
};

TabsSnippets.List = (props: ComponentProps<typeof Tabs.List>) => {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <Tabs.List
      class={clsx("relative border-b border-zinc-300 dark:border-zinc-700", local.class)}
      {...others}
    >
      {local.children}
      <Tabs.Indicator class="absolute bottom-[-1px] h-0.5 bg-sky-600 transition-all" />
    </Tabs.List>
  );
};

TabsSnippets.Trigger = (props: ComponentProps<typeof Tabs.Trigger>) => {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <Tabs.Trigger
      class={clsx(
        "outline-none text-sm px-3 py-2 text-zinc-700 ui-selected:font-medium focus-visible:bg-zinc-200 dark:text-white/80 dark:focus-visible:bg-zinc-700",
        local.class
      )}
      {...others}
    />
  );
};

TabsSnippets.Content = Tabs.Content;
