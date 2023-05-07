import { I18nProvider, Slider } from "../src";

export default function App() {
  let formRef: HTMLFormElement | undefined;

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(formRef);

    alert(JSON.stringify(Object.fromEntries(formData), null, 2));
  };

  return (
    <I18nProvider locale="en-US">
      <form ref={formRef} onSubmit={onSubmit}>
        <Slider.Root
          style={{ display: "inline-flex", "flex-direction": "column" }}
          defaultValue={[25, 75]}
          name="volume"
        >
          <div style={{ display: "flex", "justify-content": "space-between" }}>
            <Slider.Label>Volume</Slider.Label>
            <Slider.ValueLabel />
          </div>
          <div class="SliderRoot">
            <Slider.Track class="SliderTrack">
              <Slider.Fill class="SliderFill" />
            </Slider.Track>
            <Slider.Thumb class="SliderThumb">
              <Slider.Input />
            </Slider.Thumb>
            <Slider.Thumb class="SliderThumb">
              <Slider.Input />
            </Slider.Thumb>
          </div>
        </Slider.Root>
        <div>
          <button type="reset">Reset</button>
          <button>Submit</button>
        </div>
      </form>
    </I18nProvider>
  );
}
