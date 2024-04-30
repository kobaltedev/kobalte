import { Link } from "@kobalte/core/link";

import style from "./link.module.css";

export function BasicExample() {
	return (
		<Link class={style.link} href="https://kobalte.dev" target="_blank">
			Kobalte
		</Link>
	);
}

export function DisabledExample() {
	return (
		<Link
			class={style.link}
			href="https://kobalte.dev"
			target="_blank"
			disabled
		>
			Kobalte
		</Link>
	);
}
