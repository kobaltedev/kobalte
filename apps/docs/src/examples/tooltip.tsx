import { Tooltip } from "@kobalte/core/tooltip";
import { createSignal } from "solid-js";

import style from "./tooltip.module.css";

export function BasicExample() {
	return (
		<Tooltip>
			<Tooltip.Trigger class={style.tooltip__trigger}>Trigger</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content class={style.tooltip__content}>
					<Tooltip.Arrow />
					<p>Tooltip content</p>
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip>
	);
}

export function ControlledExample() {
	const [open, setOpen] = createSignal(false);

	return (
		<>
			<p class="not-prose text-sm mb-2">
				Tooltip is {open() ? "showing" : "not showing"}.
			</p>
			<Tooltip open={open()} onOpenChange={setOpen}>
				<Tooltip.Trigger class={style.tooltip__trigger}>
					Trigger
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content class={style.tooltip__content}>
						<Tooltip.Arrow />
						<p>Tooltip content</p>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip>
		</>
	);
}
