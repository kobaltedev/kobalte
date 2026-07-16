import style from "./separator.module.css";

import { Separator } from "@kobalte/core/separator";

export function BasicExample() {
	return (
		<div class="flex flex-col space-y-2">
			<span>Content above</span>
			<Separator class={style.separator} />
			<span>Content below</span>
		</div>
	);
}
