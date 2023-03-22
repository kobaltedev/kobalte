import { Portal } from "solid-js/web";

import { I18nProvider, Toast, toaster } from "../src";

export default function App() {
  const showToast = () => {
    toaster.show(props => (
      <Toast.Root toastId={props.toastId} class="ToastRoot">
        <Toast.Title class="ToastTitle">Title - {props.toastId}</Toast.Title>
        <Toast.Description class="ToastDescription">Description</Toast.Description>
        <button onClick={() => toaster.dismiss(props.toastId)}>Accept</button>
        <Toast.CloseButton onClick={() => console.log("foo")}>X</Toast.CloseButton>
        <Toast.ProgressTrack class="ToastProgressTrack">
          <Toast.ProgressFill class="ToastProgressFill" />
        </Toast.ProgressTrack>
      </Toast.Root>
    ));
  };

  const updateToast = () => {
    toaster.update(2, props => (
      <Toast.Root toastId={props.toastId} class="ToastRoot">
        <Toast.Title class="ToastTitle">Title - {props.toastId} - Updated</Toast.Title>
        <Toast.Description class="ToastDescription">Description - Updated</Toast.Description>
        <button onClick={() => toaster.dismiss(props.toastId)}>Accept</button>
        <Toast.CloseButton onClick={() => console.log("foo")}>X</Toast.CloseButton>
        <Toast.ProgressTrack class="ToastProgressTrack">
          <Toast.ProgressFill class="ToastProgressFill" />
        </Toast.ProgressTrack>
      </Toast.Root>
    ));
  };

  const promiseToast = () => {
    const promise = () => new Promise(resolve => setTimeout(resolve, 2000));

    toaster.promise(promise, props => (
      <Toast.Root
        toastId={props.toastId}
        class="ToastRoot"
        isPersistent={props.state === "pending"}
      >
        <Toast.Title class="ToastTitle">
          Title - {props.toastId} - {props.state}
        </Toast.Title>
        <Toast.Description class="ToastDescription">Description</Toast.Description>
        <button onClick={() => toaster.dismiss(props.toastId)}>Accept</button>
        <Toast.CloseButton onClick={() => console.log("foo")}>X</Toast.CloseButton>
        <Toast.ProgressTrack class="ToastProgressTrack">
          <Toast.ProgressFill class="ToastProgressFill" />
        </Toast.ProgressTrack>
      </Toast.Root>
    ));
  };

  return (
    <I18nProvider>
      <button onClick={showToast}>Show toast</button>
      <button onClick={updateToast}>Update toast n°2</button>
      <button onClick={promiseToast}>Promise toast</button>
      <Portal>
        <Toast.Region>
          <Toast.List class="ToastViewport" />
        </Toast.Region>
      </Portal>
    </I18nProvider>
  );
}
