import { Link } from "@kobalte/core";

import style from "./link.module.css";

export function BasicExample() {
  return (
    <Link class={style["link"]} href="https://kobalte.dev" target="_blank">
      Kobalte
    </Link>
  );
}

export function ClientHandledExample() {
  return (
    <Link as="span" class={style["link"]} onPress={() => alert("Pressed link")}>
      Kobalte
    </Link>
  );
}
