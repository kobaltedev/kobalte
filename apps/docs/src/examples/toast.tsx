import { Toast, toaster } from "@kobalte/core";

import { CrossIcon } from "../components";
import style from "./toast.module.css";

export function BasicExample() {
  let id: number;

  const showToast = () => {
    id = toaster.show(props => (
      <Toast.Root toastId={props.toastId} class={style["toast"]}>
        <div class={style["toast__content"]}>
          <div>
            <Toast.Title class={style["toast__title"]}>Event has been created</Toast.Title>
            <Toast.Description class={style["toast__description"]}>
              Monday, January 3rd at 6:00pm
            </Toast.Description>
          </div>
          <Toast.CloseButton class={style["toast__close-button"]}>
            <CrossIcon />
          </Toast.CloseButton>
        </div>
        <Toast.ProgressTrack class={style["toast__progress-track"]}>
          <Toast.ProgressFill class={style["toast__progress-fill"]} />
        </Toast.ProgressTrack>
      </Toast.Root>
    ));
  };

  const updateToast = () => {
    toaster.update(id, props => (
      <Toast.Root toastId={props.toastId} class={style["toast"]}>
        <div class={style["toast__content"]}>
          <div>
            <Toast.Title class={style["toast__title"]}>Event has been updated</Toast.Title>
            <Toast.Description class={style["toast__description"]}>
              Friday, January 7th at 10:00pm
            </Toast.Description>
          </div>
          <Toast.CloseButton class={style["toast__close-button"]}>
            <CrossIcon />
          </Toast.CloseButton>
        </div>
        <Toast.ProgressTrack class={style["toast__progress-track"]}>
          <Toast.ProgressFill class={style["toast__progress-fill"]} />
        </Toast.ProgressTrack>
      </Toast.Root>
    ));
  };

  return (
    <div class="flex items-center space-x-4">
      <button class="kb-button-primary" onClick={showToast}>
        Show toast
      </button>
      <button class="kb-button" onClick={updateToast}>
        Update toast
      </button>
    </div>
  );
}

export function MultipleRegionsExample() {
  let id: number;

  const showToast = (region?: string) => {
    id = toaster.show(
      props => (
        <Toast.Root toastId={props.toastId} class={style["toast"]}>
          <div class={style["toast__content"]}>
            <div>
              <Toast.Title class={style["toast__title"]}>Event has been created</Toast.Title>
              <Toast.Description class={style["toast__description"]}>
                Monday, January 3rd at 6:00pm
              </Toast.Description>
            </div>
            <Toast.CloseButton class={style["toast__close-button"]}>
              <CrossIcon />
            </Toast.CloseButton>
          </div>
          <Toast.ProgressTrack class={style["toast__progress-track"]}>
            <Toast.ProgressFill class={style["toast__progress-fill"]} />
          </Toast.ProgressTrack>
        </Toast.Root>
      ),
      {
        region,
      }
    );
  };

  return (
    <div class="flex items-center space-x-4">
      <button class="kb-button-primary" onClick={() => showToast()}>
        Show toast
      </button>
      <button class="kb-button" onClick={() => showToast("custom-region-id")}>
        Show toast (custom region)
      </button>
    </div>
  );
}
