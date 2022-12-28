import { HoverCard, I18nProvider } from "../src";

function MyHoverCard(props: any) {
  return (
    <div class="wrapper">
      <HoverCard>
        <HoverCard.Trigger href="https://twitter.com/ariakitjs" class="anchor">
          @ariakitjs
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Positioner>
            <HoverCard.Content class="hovercard">
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
              {props.children}
            </HoverCard.Content>
          </HoverCard.Positioner>
        </HoverCard.Portal>
      </HoverCard>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <MyHoverCard>
        <MyHoverCard>
          <MyHoverCard />
        </MyHoverCard>
      </MyHoverCard>
    </I18nProvider>
  );
}
