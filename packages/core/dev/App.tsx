import { Portal } from "solid-js/web";

import { I18nProvider, Toast, toaster } from "../src";

export default function App() {
  const showToast = () => {
    toaster.show(state => (
      <Toast.Root state={state} class="ToastRoot">
        <Toast.Title class="ToastTitle">Title</Toast.Title>
        <Toast.Description class="ToastDescription">Description</Toast.Description>
      </Toast.Root>
    ));
  };

  return (
    <I18nProvider>
      <button onClick={showToast}>Show toast</button>
      <Portal>
        <Toast.Region label="Notifications">
          <Toast.List class="ToastViewport" />
        </Toast.Region>
      </Portal>
    </I18nProvider>
  );
}
