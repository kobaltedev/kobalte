import { createSignal, onMount } from "solid-js";

import { I18nProvider, Progress } from "../src";

export default function App() {
  const [value, setValue] = createSignal(0);

  onMount(() => {
    const id = window.setInterval(() => {
      if (value() === 100) {
        window.clearInterval(id);
        return;
      }

      setValue(prev => prev + 1);
    }, 250);
  });

  return (
    <I18nProvider>
      <Progress.Root value={value()} class="progress">
        <div class="progress__head">
          <Progress.Label class="progress__label">Loading...</Progress.Label>
          <Progress.ValueLabel class="progress__value-label" />
        </div>
        <Progress.Track class="progress__track">
          <Progress.Fill class="progress__fill" />
        </Progress.Track>
      </Progress.Root>
    </I18nProvider>
  );
}
