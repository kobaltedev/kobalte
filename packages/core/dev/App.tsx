import { I18nProvider, Combobox } from "../src";

export default function App() {
  return (
    <I18nProvider>
      <Combobox.Root
        options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
        placeholder="Combobox a fruit…"
        valueComponent={props => props.item.rawValue}
        itemComponent={props => (
          <Combobox.Item item={props.item} class="combobox__item">
            <Combobox.ItemLabel>{props.item.rawValue}</Combobox.ItemLabel>
            <Combobox.ItemIndicator class="combobox__item-indicator">X</Combobox.ItemIndicator>
          </Combobox.Item>
        )}
      >
        <div>
          <Combobox.Input class="combobox__input" aria-label="Fruit" />
          <Combobox.Button class="combobox__button">V</Combobox.Button>
        </div>
        <Combobox.Portal>
          <Combobox.Content class="combobox__content">
            <Combobox.Listbox class="combobox__listbox" />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>
    </I18nProvider>
  );
}
