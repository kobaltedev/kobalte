import { AlertDialog } from "@kobalte/core";

import { CrossIcon } from "../components";
import style from "./alert-dialog.module.css";

export function BasicExample() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger class={style["alert-dialog__trigger"]}>Open</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay class={style["alert-dialog__overlay"]} />
        <div class={style["alert-dialog__positioner"]}>
          <AlertDialog.Content class={style["alert-dialog__content"]}>
            <div class={style["alert-dialog__header"]}>
              <AlertDialog.Title class={style["alert-dialog__title"]}>
                Alert Dialog
              </AlertDialog.Title>
              <AlertDialog.CloseButton class={style["alert-dialog__close-button"]}>
                <CrossIcon />
              </AlertDialog.CloseButton>
            </div>
            <AlertDialog.Description class={style["alert-dialog__description"]}>
              An Alert Dialog enables assistive technologies and browsers to distinguish alert
              dialogs from other dialogs so they have the option of giving alert dialogs special
              treatment, such as playing a system alert sound.
            </AlertDialog.Description>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
