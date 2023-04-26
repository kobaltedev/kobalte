import { I18nProvider, Dialog, Select } from "../src";

export default function App() {
  return (
    <I18nProvider locale="en-US">
      <Dialog.Root>
        <Dialog.Trigger class="dialog__trigger">Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay class="dialog__overlay" />
          <div class="dialog__positioner">
            <Dialog.Content class="dialog__content">
              <div class="dialog__header">
                <Dialog.Title class="dialog__title">About Kobalte</Dialog.Title>
                <Dialog.CloseButton class="dialog__close-button">X</Dialog.CloseButton>
              </div>
              <Dialog.Description class="dialog__description">
                Kobalte is a UI toolkit for building accessible web apps and design systems with
                SolidJS. It provides a set of low-level UI components and primitives which can be
                the foundation for your design system implementation.
                <Select.Root
                  multiple
                  options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
                  placeholder="Select a fruit…"
                  itemComponent={props => (
                    <Select.Item item={props.item} class="select__item">
                      <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
                      <Select.ItemIndicator class="select__item-indicator">X</Select.ItemIndicator>
                    </Select.Item>
                  )}
                >
                  <Select.Trigger class="select__trigger" aria-label="Fruit">
                    <Select.Value class="select__value">
                      {state => state.selectedOptions().join(", ")}
                    </Select.Value>
                    <Select.Icon class="select__icon">V</Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content class="select__content">
                      <Select.Listbox class="select__listbox" />
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </Dialog.Description>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </I18nProvider>
  );
}
