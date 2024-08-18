import { Tooltip } from "../src";

export default function App() {
	return (
		<div
			style={{
				display: "flex",
				gap: "4rem",
			}}
		>
			<Tooltip.Root skipDelayDuration={300}>
				<Tooltip.Trigger>1</Tooltip.Trigger>
				<Tooltip.Content>Button 1</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root skipDelayDuration={600}>
				<Tooltip.Trigger>2</Tooltip.Trigger>
				<Tooltip.Content>Button 2</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger>3</Tooltip.Trigger>
				<Tooltip.Content>Button 3</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger>4</Tooltip.Trigger>
				<Tooltip.Content>Button 4</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger>5</Tooltip.Trigger>
				<Tooltip.Content>Button 5</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger>6</Tooltip.Trigger>
				<Tooltip.Content>Button 6</Tooltip.Content>
			</Tooltip.Root>
		</div>
	);
}
