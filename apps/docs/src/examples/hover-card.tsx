import { HoverCard as HoverCardBase, Popover as PopoverBase } from "@kobalte/core";
import { ComponentProps, createSignal, splitProps } from "solid-js";

function HoverCard(props: ComponentProps<typeof HoverCardBase>) {
  return <HoverCardBase {...props} />;
}

function HoverCardTrigger(props: ComponentProps<typeof HoverCardBase.Trigger>) {
  return (
    <HoverCardBase.Trigger
      class="text-blue-600 dark:text-blue-500 hover:underline ui-disabled:cursor-not-allowed ui-disabled:opacity-40 ui-disabled:hover:no-underline"
      {...props}
    />
  );
}

function HoverCardContent(props: ComponentProps<typeof HoverCardBase.Content>) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <HoverCardBase.Portal>
      <HoverCardBase.Positioner>
        <HoverCardBase.Content
          class="z-10 outline-none shadow-md border border-zinc-200 p-4 w-80 rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700"
          {...others}
        >
          <HoverCardBase.Arrow />
          {local.children}
        </HoverCardBase.Content>
      </HoverCardBase.Positioner>
    </HoverCardBase.Portal>
  );
}

function HoverCardTitle(props: ComponentProps<typeof PopoverBase.Title>) {
  return (
    <PopoverBase.Title class="text-base font-semibold text-zinc-900 dark:text-white" {...props} />
  );
}

export function BasicExample(props: ComponentProps<typeof HoverCardBase>) {
  return (
    <HoverCard {...props}>
      <HoverCardTrigger href="https://twitter.com/mlfabien" target="_blank">
        @MLFabien
      </HoverCardTrigger>
      <HoverCardContent>
        <img
          src="https://pbs.twimg.com/profile_images/1509139491671445507/pzWYjlYN_400x400.jpg"
          alt="Fabien MARIE-LOUISE"
          class="rounded-full w-10"
        />
        <HoverCardTitle>Fabien MARIE-LOUISE</HoverCardTitle>
        <p>Developer and UI Design enthusiast. Building UI related stuffs for @solid_js</p>
      </HoverCardContent>
    </HoverCard>
  );
}

export function ControlledExample() {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <BasicExample placement="top" isOpen={open()} onOpenChange={setOpen} />
      <p class="not-prose text-sm mt-2">The hovercard is {open() ? "opened" : "closed"}.</p>
    </>
  );
}
