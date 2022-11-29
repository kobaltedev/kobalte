import { createSignal, Show } from "solid-js";

import { createTransition, Popover } from "../src";

export default function App() {
  const [show, setShow] = createSignal(false);

  const popoverTransition = createTransition(show, {
    transition: {
      in: {
        opacity: "1",
        transform: "scale(1)",
      },
      out: {
        opacity: "0",
        transform: "scale(0.8)",
      },
    },
    duration: 250,
    easing: "ease-out",
    exitEasing: "ease-in",
  });

  return (
    <>
      <Popover placement="top-start" isOpen={show()} onOpenChange={setShow}>
        <Popover.Trigger class="button mx-auto mt-96">Accept invite</Popover.Trigger>
        <Show when={popoverTransition.keepMounted()}>
          <Popover.Portal forceMount>
            <Popover.Positioner>
              <Popover.Panel class="popover" style={popoverTransition.style()}>
                <Popover.Arrow class="arrow" />
                <Popover.Title class="heading">Team meeting</Popover.Title>
                <Popover.Description>
                  We are going to discuss what we have achieved on the project.
                </Popover.Description>
                <div>
                  <p>12 Jan 2022 18:00 to 19:00</p>
                  <p>Alert 10 minutes before start</p>
                </div>
                <Popover.CloseButton class="button">Accept</Popover.CloseButton>
              </Popover.Panel>
            </Popover.Positioner>
          </Popover.Portal>
        </Show>
      </Popover>
    </>
  );
}
