import { splitProps } from "solid-js";

import { Radio, RadioGroup, useRadioGroupContext } from "../src";

function SwatchGroup(props: any) {
  const [local, others] = splitProps(props, ["children", "label"]);

  return (
    <RadioGroup orientation="horizontal" {...others}>
      <RadioGroup.Label class="text-sm font-semibold text-gray-700">{local.label}</RadioGroup.Label>
      <div class="flex gap-2 mt-2">{local.children}</div>
    </RadioGroup>
  );
}

function Swatch(props: any) {
  const radioGroupContext = useRadioGroupContext();

  const ring = () => {
    if (radioGroupContext.isSelectedValue(props.value)) {
      const color = props.value.replace(
        /bg-(.*)-(.*)/,
        (_: any, c: any, v: any) => `ring-${c}-${Math.max(500, Number(v))}`
      );
      return `ring-2 ring-offset-2 ${color} data-[focus-visible]:ring-black`;
    }

    return "data-[focus-visible]:ring-black";
  };

  const border = () => {
    return props.value.replace(
      /bg-(.*)-(.*)/,
      (_: any, c: any, v: any) => `border-${c}-${Number(v) + 100}`
    );
  };

  const bgHover = () => {
    return props.value.replace(
      /bg-(.*)-(.*)/,
      (_: any, c: any, v: any) => `data-[hover]:bg-${c}-${Number(v) + 100}`
    );
  };

  return (
    <Radio
      class={`${
        props.value
      } ${bgHover()} flex items-center justify-center w-8 h-8 rounded border ${border()} ${ring()}`}
      {...props}
    >
      <Radio.Input />
      <Radio.Indicator
        as="svg"
        class="text-white w-6 h-6"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
        ></path>
      </Radio.Indicator>
    </Radio>
  );
}

export default function App() {
  return (
    <>
      <div class="flex flex-col items-center max-w-lg">
        <SwatchGroup label="Color" defaultValue="bg-red-500">
          <Swatch value="bg-red-500" aria-label="Red" />
          <Swatch value="bg-orange-500" aria-label="Orange" />
          <Swatch value="bg-yellow-400" aria-label="Yellow" />
          <Swatch value="bg-green-500" aria-label="Green" />
          <Swatch value="bg-sky-400" aria-label="Blue" />
          <Swatch value="bg-pink-500" aria-label="Pink" />
          <Swatch value="bg-purple-500" aria-label="Purple" />
        </SwatchGroup>
      </div>
    </>
  );
}
