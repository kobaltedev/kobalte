import { Checkbox as CheckboxPrimitive } from "@kobalte/core";
import { ComponentProps, createSignal, splitProps } from "solid-js";

export function Checkbox(props: ComponentProps<typeof CheckboxPrimitive>) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <CheckboxPrimitive class="inline-flex items-center" {...others}>
      <CheckboxPrimitive.Input />
      <CheckboxPrimitive.Control class="w-4 h-4 text-blue-600 bg-zinc-200 rounded border-zinc-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600">
        <CheckboxPrimitive.Indicator class="" />
      </CheckboxPrimitive.Control>
      <CheckboxPrimitive.Label class="select-none ml-2 text-sm text-zinc-900 dark:text-zinc-300">
        {local.children}
      </CheckboxPrimitive.Label>
    </CheckboxPrimitive>
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
