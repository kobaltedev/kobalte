import { Link } from "@kobalte/core";

import style from "./link.module.css";

export function BasicExample() {
  return (
    <Link.Root class={style["link"]} href="https://kobalte.dev" target="_blank">
      Kobalte
    </Link.Root>
  );
}
