import { Tabs, type TabsRootProps } from "@kobalte/core/tabs";
import type { ComponentProps } from "@solidjs/web";
import { omit, type ParentComponent } from "solid-js";

type TabsSnippetsComposite = {
	List: typeof Tabs.List;
	Trigger: typeof Tabs.Trigger;
	Content: typeof Tabs.Content;
};

export const TabsSnippets: ParentComponent<TabsRootProps & { class?: string }> &
	TabsSnippetsComposite = (props) => {
	return (
		<Tabs
			class={[
				"kb-tabs-snippets not-prose my-6 overflow-y-auto rounded-lg border border-solid border-zinc-200 bg-[#fafafa] dark:bg-[#27272a] dark:border-[#3f3f46]",
				props.class,
			]
				.filter(Boolean)
				.join(" ")}
			{...omit(props, "class")}
		/>
	);
};

TabsSnippets.List = (props: ComponentProps<typeof Tabs.List>) => {
	return (
		<Tabs.List
			class={[
				"relative border-b border-zinc-300 dark:border-zinc-700",
				props.class,
			]
				.filter(Boolean)
				.join(" ")}
			{...omit(props, "children", "class")}
		>
			{props.children}
			<Tabs.Indicator class="absolute bottom-[-1px] h-0.5 bg-sky-600 transition-all" />
		</Tabs.List>
	);
};

TabsSnippets.Trigger = (props: ComponentProps<typeof Tabs.Trigger>) => {
	return (
		<Tabs.Trigger
			class={[
				"px-3 py-2 text-sm text-zinc-700 outline-none focus-visible:bg-zinc-200 ui-selected:font-medium dark:text-white/80 dark:focus-visible:bg-zinc-700",
				props.class,
			]
				.filter(Boolean)
				.join(" ")}
			{...omit(props, "class")}
		/>
	);
};

TabsSnippets.Content = Tabs.Content;
