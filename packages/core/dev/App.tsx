import { As, I18nProvider, ToggleButton } from "../src";

export default function App() {
  return (
    <I18nProvider>
      <ToggleButton.Root>
        {state => <As component="a">{state.isPressed() ? "Pressed" : "Released"}</As>}
      </ToggleButton.Root>
    </I18nProvider>
  );
}
