import style from "./separator.module.css";

import { Separator } from "@kobalte/core/separator";

export function BasicExample() {
	return (
		<div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
			<span>Content above</span>
			<Separator class={style.separator} />
			<span>Content below</span>
		</div>
	);
}
