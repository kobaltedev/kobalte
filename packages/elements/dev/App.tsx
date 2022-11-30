import { ComponentProps, createSignal, Show, splitProps } from "solid-js";

import { createTransition, HoverCard, I18nProvider } from "../src";

function Foo(props: ComponentProps<typeof HoverCard>) {
  const [local, others] = splitProps(props, ["children"]);

  const [show, setShow] = createSignal(false);

  const hoverCardTransition = createTransition(show, {
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
    <HoverCard
      closeOnHoverOutside={false}
      closeOnInteractOutside={false}
      placement="bottom"
      isOpen={show()}
      onOpenChange={setShow}
      {...others}
    >
      <HoverCard.Trigger class="button">Accept invite</HoverCard.Trigger>
      <Show when={hoverCardTransition.keepMounted()}>
        <HoverCard.Portal forceMount>
          <HoverCard.Positioner>
            <HoverCard.Panel class="popover" style={hoverCardTransition.style()}>
              <HoverCard.Arrow class="arrow" />
              <HoverCard.Title class="heading">Team meeting</HoverCard.Title>
              <HoverCard.Description>
                We are going to discuss what we have achieved on the project.
              </HoverCard.Description>
              <div>
                <p>12 Jan 2022 18:00 to 19:00</p>
                <p>Alert 10 minutes before start</p>
              </div>
              <HoverCard.CloseButton class="button">Accept</HoverCard.CloseButton>
              {local.children}
            </HoverCard.Panel>
          </HoverCard.Positioner>
        </HoverCard.Portal>
      </Show>
    </HoverCard>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Foo placement={"bottom"}>
        <Foo placement={"right"}>
          <Foo placement={"right"}>
            <Foo placement={"right"}>
              <Foo placement={"right"} />
            </Foo>
          </Foo>
        </Foo>
      </Foo>
    </I18nProvider>
  );
}
