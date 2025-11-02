import { TimeField } from "../src/time-field";

export default function App() {
	return (
		<>
	   <TimeField class="time-field">
	      <TimeField.Label class="time-field__label">Event time</TimeField.Label>
	      <TimeField.Input class="time-field__field">
	        {segment => <TimeField.Segment class="time-field__segment" segment={segment()} />}
	      </TimeField.Input>
			</TimeField>
		</>
	);
}
