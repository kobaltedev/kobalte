import { createSignal } from "solid-js";
import { I18nProvider, Dialog, Select, Popover, DropdownMenu } from "../src";

export default function App() {
  const [showGitLog, setShowGitLog] = createSignal(true);
  const [showHistory, setShowHistory] = createSignal(false);
  const [branch, setBranch] = createSignal("main");

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
                <Popover.Root>
                  <Popover.Trigger class="popover__trigger">Open</Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content class="popover__content">
                      <Popover.Arrow />
                      <div class="popover__header">
                        <Popover.Title class="popover__title">About Kobalte</Popover.Title>
                        <Popover.CloseButton class="popover__close-button">X</Popover.CloseButton>
                      </div>
                      <Popover.Description class="popover__description">
                        A UI toolkit for building accessible web apps and design systems with
                        SolidJS.
                      </Popover.Description>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
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
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger class="dropdown-menu__trigger">
                    <span>Git Settings</span>
                    <DropdownMenu.Icon class="dropdown-menu__trigger-icon">X</DropdownMenu.Icon>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content class="dropdown-menu__content">
                      <DropdownMenu.Item class="dropdown-menu__item">
                        Commit <div class="dropdown-menu__item-right-slot">⌘+K</div>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item class="dropdown-menu__item">
                        Push <div class="dropdown-menu__item-right-slot">⇧+⌘+K</div>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item class="dropdown-menu__item" disabled>
                        Update Project <div class="dropdown-menu__item-right-slot">⌘+T</div>
                      </DropdownMenu.Item>
                      <DropdownMenu.Sub overlap gutter={4} shift={-8}>
                        <DropdownMenu.SubTrigger class="dropdown-menu__sub-trigger">
                          GitHub
                          <div class="dropdown-menu__item-right-slot">X</div>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.SubContent class="dropdown-menu__sub-content">
                            <DropdownMenu.Item class="dropdown-menu__item">
                              Create Pull Request…
                            </DropdownMenu.Item>
                            <DropdownMenu.Item class="dropdown-menu__item">
                              View Pull Requests
                            </DropdownMenu.Item>
                            <DropdownMenu.Item class="dropdown-menu__item">
                              Sync Fork
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator class="dropdown-menu__separator" />
                            <DropdownMenu.Item class="dropdown-menu__item">
                              Open on GitHub
                            </DropdownMenu.Item>
                          </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Sub>
                      <DropdownMenu.Separator class="dropdown-menu__separator" />
                      <DropdownMenu.Separator class="dropdown-menu__separator" />
                      <DropdownMenu.CheckboxItem
                        class="dropdown-menu__checkbox-item"
                        checked={showGitLog()}
                        onChange={setShowGitLog}
                      >
                        <DropdownMenu.ItemIndicator class="dropdown-menu__item-indicator">
                          X
                        </DropdownMenu.ItemIndicator>
                        Show Git Log
                      </DropdownMenu.CheckboxItem>
                      <DropdownMenu.CheckboxItem
                        class="dropdown-menu__checkbox-item"
                        checked={showHistory()}
                        onChange={setShowHistory}
                      >
                        <DropdownMenu.ItemIndicator class="dropdown-menu__item-indicator">
                          X
                        </DropdownMenu.ItemIndicator>
                        Show History
                      </DropdownMenu.CheckboxItem>
                      <DropdownMenu.Separator class="dropdown-menu__separator" />
                      <DropdownMenu.Group>
                        <DropdownMenu.GroupLabel class="dropdown-menu__group-label">
                          Branches
                        </DropdownMenu.GroupLabel>
                        <DropdownMenu.RadioGroup value={branch()} onChange={setBranch}>
                          <DropdownMenu.RadioItem class="dropdown-menu__radio-item" value="main">
                            <DropdownMenu.ItemIndicator class="dropdown-menu__item-indicator">
                              O
                            </DropdownMenu.ItemIndicator>
                            main
                          </DropdownMenu.RadioItem>
                          <DropdownMenu.RadioItem class="dropdown-menu__radio-item" value="develop">
                            <DropdownMenu.ItemIndicator class="dropdown-menu__item-indicator">
                              O
                            </DropdownMenu.ItemIndicator>
                            develop
                          </DropdownMenu.RadioItem>
                        </DropdownMenu.RadioGroup>
                      </DropdownMenu.Group>
                      <DropdownMenu.Arrow />
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
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
                          Kobalte is a UI toolkit for building accessible web apps and design
                          systems with SolidJS. It provides a set of low-level UI components and
                          primitives which can be the foundation for your design system
                          implementation.
                          <Popover.Root>
                            <Popover.Trigger class="popover__trigger">Open</Popover.Trigger>
                            <Popover.Portal>
                              <Popover.Content class="popover__content">
                                <Popover.Arrow />
                                <div class="popover__header">
                                  <Popover.Title class="popover__title">
                                    About Kobalte
                                  </Popover.Title>
                                  <Popover.CloseButton class="popover__close-button">
                                    X
                                  </Popover.CloseButton>
                                </div>
                                <Popover.Description class="popover__description">
                                  A UI toolkit for building accessible web apps and design systems
                                  with SolidJS.
                                </Popover.Description>
                              </Popover.Content>
                            </Popover.Portal>
                          </Popover.Root>
                          <Select.Root
                            multiple
                            options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
                            placeholder="Select a fruit…"
                            itemComponent={props => (
                              <Select.Item item={props.item} class="select__item">
                                <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
                                <Select.ItemIndicator class="select__item-indicator">
                                  X
                                </Select.ItemIndicator>
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
                          <Select.Root
                            options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
                            placeholder="Select a fruit…"
                            itemComponent={props => (
                              <Select.Item item={props.item} class="select__item">
                                <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
                                <Select.ItemIndicator class="select__item-indicator">
                                  X
                                </Select.ItemIndicator>
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
              </Dialog.Description>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </I18nProvider>
  );
}
