import { Switch as SwitchPrimitive } from "@kobalte/core";
import { ComponentProps, createSignal, splitProps } from "solid-js";

export function Switch(props: ComponentProps<typeof SwitchPrimitive>) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <SwitchPrimitive class="inline-flex items-center ui-disabled:opacity-50" {...others}>
      <SwitchPrimitive.Input />
      <SwitchPrimitive.Label class="select-none mr-3 text-sm text-zinc-900 dark:text-zinc-300">
        {local.children}
      </SwitchPrimitive.Label>
      <SwitchPrimitive.Control class="inline-flex transition items-center px-[2px] w-11 h-6 bg-zinc-200 outline-none ui-focus-visible:ring ui-focus-visible:ring-blue-100 dark:ui-focus-visible:ring-blue-900/60 rounded-full dark:bg-zinc-700 dark:border-zinc-600 ui-checked:bg-blue-600 dark:ui-checked:bg-blue-600">
        <SwitchPrimitive.Thumb class="ui-checked:translate-x-full ui-checked:border-white bg-white after:border-zinc-300 border rounded-full h-5 w-5 transition-all" />
      </SwitchPrimitive.Control>
    </SwitchPrimitive>
  );
}

export function ControlledExample() {
  const [checked, setChecked] = createSignal(false);

  return (
    <>
      <Switch isChecked={checked()} onCheckedChange={setChecked}>
        Airplane mode
      </Switch>
      <p class="not-prose text-sm mt-2">Airplane mode is {checked() ? "active" : "inactive"}.</p>
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
      <Switch name="airplane-mode" value="on">
        Airplane mode
      </Switch>
      <div class="flex space-x-2">
        <button type="reset" class="text-sm rounded border border-zinc-600 px-3">
          Reset
        </button>
        <button class="text-sm rounded text-white bg-blue-600 px-3">Submit</button>
      </div>
    </form>
  );
}
