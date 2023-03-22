import { Toast, toaster } from "@kobalte/core";

import { CrossIcon } from "../components";
import style from "./toast.module.css";

export function BasicExample() {
  const showToast = () => {
    toaster.show(props => (
      <Toast.Root toastId={props.toastId} class={style["toast"]}>
        <div>
          <Toast.Title class={style["toast__title"]}>About Kobalte</Toast.Title>
          <Toast.Description class={style["toast__description"]}>
            A UI toolkit for building accessible web apps and design systems with SolidJS.
          </Toast.Description>
        </div>
        <Toast.CloseButton class={style["toast__close-button"]}>
          <CrossIcon />
        </Toast.CloseButton>
      </Toast.Root>
    ));
  };

  return (
    <button class="kb-button-primary" onClick={showToast}>
      Show toast
    </button>
  );
}
