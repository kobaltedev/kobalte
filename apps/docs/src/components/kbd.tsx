import type { ComponentProps } from "@solidjs/web";
import { omit } from "solid-js";

export function Kbd(props: ComponentProps<"kbd">) {
	return (
		<kbd
			class={[
				"rounded-md border border-solid border-b-[3px] bg-zinc-100 px-[0.4em] py-[0.1em] font-mono text-[0.8em] font-bold text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-white/90 dark:border-zinc-600",
				props.class,
			]
				.filter(Boolean)
				.join(" ")}
			{...omit(props, "class")}
		/>
	);
}
