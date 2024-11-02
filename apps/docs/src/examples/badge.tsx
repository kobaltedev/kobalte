import { Badge } from "@kobalte/core/badge";

import style from "./badge.module.css";

export function BasicExample() {
	return (
		<Badge class={style.badge} textValue="Unread messages: 5">
			5 messages
		</Badge>
	);
}
