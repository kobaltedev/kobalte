import { Checkbox as CheckboxBase } from "@kobalte/core";
import { ComponentProps, createSignal, Match, ParentProps, splitProps, Switch } from "solid-js";

import { CheckIcon, DividerHorizontalIcon } from "../components";

type CheckboxBaseProps = ComponentProps<typeof CheckboxBase>;

type CheckboxProps = ParentProps<Omit<CheckboxBaseProps, "children">>;

export function Checkbox(props: CheckboxProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <CheckboxBase class="inline-flex items-center ui-disabled:opacity-40" {...others}>
      {state => (
        <>
          <CheckboxBase.Input />
          <CheckboxBase.Control class="w-4 h-4 bg-zinc-200 rounded border-zinc-300 ui-checked:bg-blue-600 ui-checked:ui-indeterminate:bg-zinc-200 ui-focus:ring ui-focus:ring-blue-200 dark:ui-focus:ring-blue-500/30 dark:bg-zinc-700 dark:border-zinc-600 dark:ui-checked:bg-blue-600">
            <CheckboxBase.Indicator>
              <Switch>
                <Match when={state.isIndeterminate()}>
                  <DividerHorizontalIcon class="text-zinc-500" />
                </Match>
                <Match when={state.isChecked() && !state.isIndeterminate()}>
                  <CheckIcon class="text-white" />
                </Match>
              </Switch>
            </CheckboxBase.Indicator>
          </CheckboxBase.Control>
          <CheckboxBase.Label class="select-none ml-2 text-sm text-zinc-900 dark:text-zinc-300">
            {local.children}
          </CheckboxBase.Label>
        </>
      )}
    </CheckboxBase>
  );
}

export function ControlledExample() {
  const [checked, setChecked] = createSignal(false);

  return (
    <>
      <Checkbox isChecked={checked()} onCheckedChange={setChecked}>
        Subscribe
      </Checkbox>
      <p class="not-prose text-sm mt-2">You are {checked() ? "subscribed" : "unsubscribed"}.</p>
    </>
  );
}

export function HTMLFormExample() {
  let formRef: HTMLFormElement | undefined;

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(formRef);

    alert(JSON.stringify(Object.fromEntries(formData), null, 2));
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} class="flex flex-col items-start space-y-4">
      <Checkbox name="newsletter" value="subscribe">
        Subscribe
      </Checkbox>
      <div class="flex space-x-2">
        <button type="reset" class="text-sm rounded border border-zinc-600 px-3">
          Reset
        </button>
        <button class="text-sm rounded text-white bg-blue-600 px-3">Submit</button>
      </div>
    </form>
  );
}
