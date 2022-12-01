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
    <HoverCard gutter={16} isOpen={show()} onOpenChange={setShow} {...others}>
      <HoverCard.Trigger class="anchor" href="https://twitter.com/ariakitjs">
        @ariakitjs
      </HoverCard.Trigger>
      <Show when={hoverCardTransition.keepMounted()}>
        <HoverCard.Portal forceMount>
          <HoverCard.Positioner>
            <HoverCard.Panel class="hovercard" style={hoverCardTransition.style()}>
              <img
                src="https://pbs.twimg.com/profile_images/1547936373243490306/dSn6Am0o_400x400.jpg"
                alt="Ariakit"
                class="avatar"
              />
              <HoverCard.Title class="username">Ariakit</HoverCard.Title>
              <p>Toolkit for building accessible web apps with React.</p>
              <a href="https://twitter.com/ariakitjs" class="button">
                Follow
              </a>
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
      <div class="h-full w-full flex flex-col items-center justify-evenly">
        <Foo placement={"bottom"}>
          <Foo placement={"right"}>
            <Foo placement={"right"}>
              <Foo placement={"right"}>
                <Foo placement={"right"} />
              </Foo>
            </Foo>
          </Foo>
        </Foo>
        <div class="flex items-center space-x-4">
          <Foo placement="top" />
          <Foo placement="right" />
          <Foo placement="bottom" />
          <Foo placement="left" />
        </div>
      </div>
    </I18nProvider>
  );
}
