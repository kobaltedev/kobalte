import { Button } from "@kobalte/core";

import style from "./button.module.css";

export function BasicExample() {
  return <Button.Root class={style["button"]}>Click me</Button.Root>;
}
