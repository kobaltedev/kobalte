import preview from "../../../../../.storybook/preview.js";
import { Content as AccordionContent, Header as AccordionHeader, Item as AccordionItem, Root as AccordionRoot, Trigger as AccordionTrigger } from "../index";

const meta = preview.meta({
	title: "Components/Accordion",
	tags: ["autodocs"],
});

export default meta;

export const Default = meta.story({
	name: "Default",
	render: () => (
		<AccordionRoot style={{ width: "320px" }}>
			<AccordionItem value="item-1">
				<AccordionHeader>
					<AccordionTrigger>Is it accessible?</AccordionTrigger>
				</AccordionHeader>
				<AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionHeader>
					<AccordionTrigger>Is it unstyled?</AccordionTrigger>
				</AccordionHeader>
				<AccordionContent>Yes. It's unstyled by default, giving you freedom over the look and feel.</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionHeader>
					<AccordionTrigger>Can it be animated?</AccordionTrigger>
				</AccordionHeader>
				<AccordionContent>Yes! You can animate the Accordion with CSS or JavaScript.</AccordionContent>
			</AccordionItem>
		</AccordionRoot>
	),
});

export const Multiple = meta.story({
	name: "Multiple",
	render: () => (
		<AccordionRoot multiple style={{ width: "320px" }}>
			<AccordionItem value="item-1">
				<AccordionHeader>
					<AccordionTrigger>Section one</AccordionTrigger>
				</AccordionHeader>
				<AccordionContent>Content for section one.</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionHeader>
					<AccordionTrigger>Section two</AccordionTrigger>
				</AccordionHeader>
				<AccordionContent>Content for section two.</AccordionContent>
			</AccordionItem>
		</AccordionRoot>
	),
});
