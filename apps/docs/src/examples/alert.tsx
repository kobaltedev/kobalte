import { Alert } from "@kobalte/core/alert";

import style from "./alert.module.css";

export function BasicExample() {
	return (
		<Alert class={style.alert}>Kobalte is going live soon, get ready!</Alert>
	);
}
