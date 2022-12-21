import { Button } from "@kobalte/core";

import style from "./button.module.css";

export function BasicExample() {
  return <Button class={style["button"]}>Press me</Button>;
}
