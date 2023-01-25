import { createSignal } from "solid-js";

import { Accordion, I18nProvider } from "../src";

export default function App() {
  const [selectedItem, setSelectedItem] = createSignal<string>();

  return (
    <I18nProvider>
      <Accordion.Root
        value={selectedItem()}
        onValueChange={value => setSelectedItem(value.values().next().value)}
      >
        <Accordion.Item value="1">
          <Accordion.Header>
            <Accordion.Trigger>Toggle item 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>item 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="2">
          <Accordion.Header>
            <Accordion.Trigger>Toggle item 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>item 2</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="3">
          <Accordion.Header>
            <Accordion.Trigger>Toggle item 3</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>item 3</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <p>Selected item: {selectedItem()}</p>
    </I18nProvider>
  );
}
