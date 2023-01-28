import { Button, I18nProvider } from "../src";

export default function App() {
  return (
    <I18nProvider>
      <Button.Root>Hi mom</Button.Root>
      <button>hi dad</button>
    </I18nProvider>
  );
}
