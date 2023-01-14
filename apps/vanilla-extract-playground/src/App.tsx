import { Button, I18nProvider } from "@kobalte/core";
import { button, container } from "./styles.css";

export default function App() {
  return (
    <I18nProvider>
      <div data-kb-theme="light" class={container}>
        <Button.Root class={button}>Button</Button.Root>
      </div>
      <div data-kb-theme="dark" class={container}>
        <Button.Root class={button}>Button</Button.Root>
      </div>
    </I18nProvider>
  );
}
