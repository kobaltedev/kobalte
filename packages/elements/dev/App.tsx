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
    if (radioGroupContext.selectedValue() === props.value) {
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
      class={`${props.value} ${bgHover()} w-8 h-8 rounded border ${border()} ${ring()}`}
      {...props}
    >
      <Radio.Input />
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
