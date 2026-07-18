import style from "./alert.module.css";

import { Alert } from "@kobalte/core/alert";

export function BasicExample() {
	return (
		<Alert class={style.alert}>Kobalte is going live soon, get ready!</Alert>
	);
}
