import { createSignal } from "solid-js";
import { TimeField } from "../src/time-field";

export default function App() {
	const [time, setTime] = createSignal({hour: 0});
	return (
		<>
	   <TimeField class="time-field" hourCycle={12} granularity="minute" value={time()} onChange={setTime}>
	      <TimeField.Label class="time-field__label">Event time</TimeField.Label>
	      <TimeField.Input class="time-field__field">
	        {segment => <TimeField.Segment class="time-field__segment" segment={segment()} />}
	      </TimeField.Input>
			</TimeField>
			<br/>
			{JSON.stringify(time())}
		</>
	);
}
