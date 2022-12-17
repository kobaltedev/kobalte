import { I18nProvider, Select } from "../src";

function SelectDemo() {
  return (
    <Select>
      <Select.Trigger class="select">
        <Select.Value placeholder="Select a fruit" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Panel class="popover">
            <Select.Option value="apple" class="select-item">
              Apple
            </Select.Option>
            <Select.Option value="banana" class="select-item">
              Banana
            </Select.Option>
            <Select.Option value="grape" class="select-item" isDisabled>
              Grape
            </Select.Option>
            <Select.Option value="orange" class="select-item">
              Orange
            </Select.Option>
          </Select.Panel>
        </Select.Positioner>
      </Select.Portal>
    </Select>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <SelectDemo />
    </I18nProvider>
  );
}
