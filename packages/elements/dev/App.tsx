import { Popover } from "../src";

export default function App() {
  return (
    <>
      <Popover isOpen slide={false} overlap={false} placement="bottom">
        <Popover.Trigger class="button mx-auto">Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Panel class="popover">
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
      </Popover>
    </>
  );
}
