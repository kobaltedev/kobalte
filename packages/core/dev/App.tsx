import { createSignal } from "solid-js";

import { I18nProvider, MultiSelect as KSelect } from "../src";

const Select = <T, U>(props: KSelect.MultiSelectRootProps<T, U>) => {
  return (
    <div>
      <KSelect.Root
        {...props}
        valueComponent={props => props.items.map(item => item.rawValue).join(", ")}
        itemComponent={icProps => (
          <KSelect.Item item={icProps.item}>
            <KSelect.ItemIndicator forceMount>
              <input type="checkbox" checked={new Set(props.value).has(icProps.item.key)} />
            </KSelect.ItemIndicator>
            <KSelect.ItemLabel>{icProps.item.rawValue as any}</KSelect.ItemLabel>
          </KSelect.Item>
        )}
      >
        <KSelect.Trigger>
          <KSelect.Value />
          <div>click here</div>
        </KSelect.Trigger>
        <KSelect.Portal>
          <KSelect.Content>
            {props.children}
            <KSelect.Listbox />
          </KSelect.Content>
        </KSelect.Portal>
      </KSelect.Root>
    </div>
  );
};

export default function App() {
  const [selected, setSelected] = createSignal(new Set(["bananas"]));
  const options = ["apples", "bananas", "cucumbers", "date", "elderberry"];

  return (
    <I18nProvider>
      <Select
        options={options}
        optionDisabled={option => {
          console.log(option === options[0]);
          return option === options[0];
        }}
        value={selected()}
        onValueChange={value => setSelected(new Set([...value]))}
      />
    </I18nProvider>
  );
}
