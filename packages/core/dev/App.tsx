import { ComponentProps, splitProps } from "solid-js";

import { Button, Dialog, I18nProvider } from "../src";

function MyDialog(props: ComponentProps<typeof Dialog> & { level: number }) {
  const [local, others] = splitProps(props, ["children", "level"]);

  return (
    <Dialog {...others}>
      <Dialog.Trigger class="button" id={`${others.id}-trigger`}>
        {others.isModal ? "Open Modal" : "Open Non Modal"} {local.level}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Positioner>
          <Dialog.Content class="popover">
            <Dialog.Title class="heading">Team meeting</Dialog.Title>
            <Dialog.Description>
              We are going to discuss what we have achieved on the project.
            </Dialog.Description>
            <div>
              <p>12 Jan 2022 18:00 to 19:00</p>
              <p>Alert 10 minutes before start</p>
            </div>
            <Button class="button">Accept {local.level}</Button>
            {local.children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <div>
        <MyDialog id="non-modal-1" isModal={false} level={1}>
          <MyDialog id="non-modal-2" isModal={false} level={2}>
            <MyDialog id="non-modal-3" isModal={false} level={3} />
          </MyDialog>
        </MyDialog>
        <MyDialog id="modal-1" isModal={true} level={1}>
          <MyDialog id="modal-2" isModal={true} level={2}>
            <MyDialog id="modal-3" isModal={true} level={3} />
          </MyDialog>
        </MyDialog>
        <button class="button" onClick={() => console.log("external button triggered")}>
          Outside
        </button>
      </div>
    </I18nProvider>
  );
}
