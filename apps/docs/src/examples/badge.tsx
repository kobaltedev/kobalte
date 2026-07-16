import style from "./badge.module.css";

import { Badge } from "@kobalte/core/badge";

export function BasicExample() {
	return (
		<Badge class={style.badge} textValue="5 unread messages">
			5 messages
		</Badge>
	);
}
