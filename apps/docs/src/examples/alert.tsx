import { Alert } from "@kobalte/core";

import style from "./alert.module.css";

export function BasicExample() {
  return <Alert.Root class={style["alert"]}>Kobalte is going live soon, get ready!</Alert.Root>;
}
