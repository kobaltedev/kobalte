import { Badge } from "@kobalte/core/badge";

import style from "./badge.module.css";

export function BasicExample() {
	return (
		<Badge class={style.badge} textValue="5 unread messages">
			5 messages
		</Badge>
	);
}
