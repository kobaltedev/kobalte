import { RadioGroup as RadioGroupBase } from "@kobalte/core";
import { ComponentProps, createSignal, JSX, Show, splitProps } from "solid-js";

type RadioGroupBaseProps = ComponentProps<typeof RadioGroupBase>;

interface RadioGroupProps extends RadioGroupBaseProps {
  label?: JSX.Element;
  description?: JSX.Element;
  errorMessage?: JSX.Element;
}

export function RadioGroup(props: RadioGroupProps) {
  const [local, others] = splitProps(props, ["label", "description", "errorMessage", "children"]);

  return (
    <RadioGroupBase orientation="horizontal" class="space-y-2" {...others}>
      <Show when={local.label}>
        <RadioGroupBase.Label class="text-base text-zinc-800 font-medium dark:text-white/90 ui-disabled:opacity-40">
          {local.label}
        </RadioGroupBase.Label>
      </Show>
      <div class="flex space-x-4">{local.children}</div>
      <Show when={local.description}>
        <RadioGroupBase.Description class="text-sm text-zinc-600 dark:text-zinc-400 ui-disabled:opacity-40">
          {local.description}
        </RadioGroupBase.Description>
      </Show>
      <Show when={local.errorMessage}>
        <RadioGroupBase.ErrorMessage class="text-sm text-red-600 dark:text-red-400 ui-disabled:opacity-40">
          {local.errorMessage}
        </RadioGroupBase.ErrorMessage>
      </Show>
    </RadioGroupBase>
  );
}

export function Radio(props: ComponentProps<typeof RadioGroupBase.Item>) {
  const [local, others] = splitProps(props, ["value", "children"]);

  return (
    <RadioGroupBase.Item
      value={local.value}
      class="flex items-center ui-disabled:opacity-40"
      {...others}
    >
      <RadioGroupBase.ItemInput />
      <RadioGroupBase.ItemControl class="flex items-center justify-center transition h-5 w-5 rounded-full border border-zinc-400 dark:border-zinc-600 mr-2 ui-hover:bg-blue-50 dark:ui-hover:bg-blue-900/60 ui-focus-visible:border-blue-500 ui-focus-visible:ring ui-focus-visible:ring-blue-100 dark:ui-focus-visible:border-blue-600 dark:ui-focus-visible:ring-blue-900/60">
        <RadioGroupBase.ItemIndicator class="h-2.5 w-2.5 rounded-full bg-blue-500" />
      </RadioGroupBase.ItemControl>
      <RadioGroupBase.ItemLabel class="text-sm text-zinc-900 dark:text-white/90 first-letter:uppercase">
        {local.children}
      </RadioGroupBase.ItemLabel>
    </RadioGroupBase.Item>
  );
}

export function ControlledExample() {
  const [value, setValue] = createSignal("orange");

  return (
    <>
      <RadioGroup label="Favorite fruit" value={value()} onValueChange={setValue}>
        <Radio value="apple">Apple</Radio>
        <Radio value="orange">Orange</Radio>
        <Radio value="watermelon">Watermelon</Radio>
      </RadioGroup>
      <p class="not-prose text-sm mt-2">Your favorite fruit is: {value()}.</p>
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
      <RadioGroup label="Favorite fruit" name="fruit">
        <Radio value="apple">Apple</Radio>
        <Radio value="orange">Orange</Radio>
        <Radio value="watermelon">Watermelon</Radio>
      </RadioGroup>
      <div class="flex space-x-2">
        <button type="reset" class="text-sm rounded border border-zinc-600 px-3">
          Reset
        </button>
        <button class="text-sm rounded text-white bg-blue-600 px-3">Submit</button>
      </div>
    </form>
  );
}
