import { Button } from "@kobalte/core";
import { createSignal, For } from "solid-js";

export function PressInteractionExample() {
  const [events, setEvents] = createSignal<string[]>([]);

  return (
    <>
      <Button
        class="kb-button"
        onPressStart={e => setEvents(prev => [...prev, `press start with ${e.pointerType}`])}
        onPressEnd={e => setEvents(prev => [...prev, `press end with ${e.pointerType}`])}
        onPress={e => setEvents(prev => [...prev, `press with ${e.pointerType}`])}
      >
        Press me
      </Button>
      <ul class="overflow-auto max-h-56 mt-2 space-y-1 text-sm list-disc list-inside text-zinc-600 dark:text-zinc-400">
        <For each={events()}>{e => <li>{e}</li>}</For>
      </ul>
    </>
  );
}
