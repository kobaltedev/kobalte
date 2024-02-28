import { fireEvent, render } from "@solidjs/testing-library";
import { vi } from "vitest";

import * as Pagination from ".";

describe("Pagination", () => {
	it("renders correctly when changing page", () => {
		const { getByText, queryAllByText } = render(() => (
			<Pagination.Root
				count={7}
				itemComponent={(props) => (
					<Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
				)}
				ellipsisComponent={() => (
					<Pagination.Ellipsis>Ellipsis</Pagination.Ellipsis>
				)}
			>
				<Pagination.Items />
				<Pagination.Next>Next</Pagination.Next>
			</Pagination.Root>
		));

		const next = getByText("Next");

		expect(getByText("Page 1")).toBeVisible();
		expect(getByText("Page 2")).toBeVisible();
		expect(queryAllByText("Ellipsis")).toHaveLength(1);
		expect(getByText("Page 7")).toBeVisible();

		fireEvent.click(next);

		expect(getByText("Page 1")).toBeVisible();
		expect(getByText("Page 2")).toBeVisible();
		expect(getByText("Page 3")).toBeVisible();
		expect(queryAllByText("Ellipsis")).toHaveLength(1);
		expect(getByText("Page 7")).toBeVisible();

		fireEvent.click(next);

		expect(getByText("Page 1")).toBeVisible();
		expect(getByText("Page 2")).toBeVisible();
		expect(getByText("Page 3")).toBeVisible();
		expect(getByText("Page 4")).toBeVisible();
		expect(queryAllByText("Ellipsis")).toHaveLength(1);
		expect(getByText("Page 7")).toBeVisible();

		fireEvent.click(next);

		expect(getByText("Page 1")).toBeVisible();
		expect(getByText("Page 3")).toBeVisible();
		expect(getByText("Page 4")).toBeVisible();
		expect(getByText("Page 5")).toBeVisible();
		expect(queryAllByText("Ellipsis")).toHaveLength(2);
		expect(getByText("Page 7")).toBeVisible();

		fireEvent.click(next);

		expect(getByText("Page 1")).toBeVisible();
		expect(queryAllByText("Ellipsis")).toHaveLength(1);
		expect(getByText("Page 4")).toBeVisible();
		expect(getByText("Page 5")).toBeVisible();
		expect(getByText("Page 6")).toBeVisible();
		expect(getByText("Page 7")).toBeVisible();

		fireEvent.click(next);

		expect(getByText("Page 1")).toBeVisible();
		expect(queryAllByText("Ellipsis")).toHaveLength(1);
		expect(getByText("Page 5")).toBeVisible();
		expect(getByText("Page 6")).toBeVisible();
		expect(getByText("Page 7")).toBeVisible();

		fireEvent.click(next);

		expect(getByText("Page 1")).toBeVisible();
		expect(queryAllByText("Ellipsis")).toHaveLength(1);
		expect(getByText("Page 6")).toBeVisible();
		expect(getByText("Page 7")).toBeVisible();
	});

	it("renders correct number of pages", () => {
		const { getByText } = render(() => (
			<Pagination.Root
				count={10}
				itemComponent={(props) => (
					<Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
				)}
				ellipsisComponent={() => <></>}
			>
				<Pagination.Items />
			</Pagination.Root>
		));

		const page1 = getByText("Page 1");
		const page2 = getByText("Page 2");
		const page10 = getByText("Page 10");

		expect(page1).toBeVisible();
		expect(page2).toBeVisible();
		expect(page10).toBeVisible();
	});

	it("renders correct number of siblings", () => {
		const { getByText } = render(() => (
			<Pagination.Root
				count={10}
				defaultPage={4}
				siblingCount={2}
				itemComponent={(props) => (
					<Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
				)}
				ellipsisComponent={() => <></>}
			>
				<Pagination.Items />
			</Pagination.Root>
		));

		const page1 = getByText("Page 1");
		const page2 = getByText("Page 2");
		const page3 = getByText("Page 3");
		const page4 = getByText("Page 4");
		const page5 = getByText("Page 5");
		const page6 = getByText("Page 6");
		const page10 = getByText("Page 10");

		expect(page1).toBeVisible();
		expect(page2).toBeVisible();
		expect(page3).toBeVisible();
		expect(page4).toBeVisible();
		expect(page5).toBeVisible();
		expect(page6).toBeVisible();
		expect(page10).toBeVisible();
	});

	it("renders correctly when hiding first/last", () => {
		const { getByText, queryByText } = render(() => (
			<Pagination.Root
				count={10}
				defaultPage={4}
				showFirst={false}
				showLast={false}
				itemComponent={(props) => (
					<Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
				)}
				ellipsisComponent={() => <></>}
			>
				<Pagination.Items />
			</Pagination.Root>
		));

		const page1 = queryByText("Page 1");
		const page3 = getByText("Page 3");
		const page4 = getByText("Page 4");
		const page5 = getByText("Page 5");
		const page10 = queryByText("Page 10");

		expect(page1).not.toBeInTheDocument();
		expect(page3).toBeVisible();
		expect(page4).toBeVisible();
		expect(page5).toBeVisible();
		expect(page10).not.toBeInTheDocument();
	});

	it("renders correct number of siblings with fixedItems=true", () => {
		const { getByText } = render(() => (
			<Pagination.Root
				count={10}
				fixedItems
				page={3}
				itemComponent={(props) => (
					<Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
				)}
				ellipsisComponent={() => <></>}
			>
				<Pagination.Items />
			</Pagination.Root>
		));

		const page1 = getByText("Page 1");
		const page2 = getByText("Page 2");
		const page3 = getByText("Page 3");
		const page4 = getByText("Page 4");
		const page5 = getByText("Page 5");
		const page10 = getByText("Page 10");

		expect(page1).toBeVisible();
		expect(page2).toBeVisible();
		expect(page3).toBeVisible();
		expect(page4).toBeVisible();
		expect(page5).toBeVisible();
		expect(page10).toBeVisible();
	});

	it("renders correct number of siblings with fixedItems=no-ellipsis", () => {
		const { getByText } = render(() => (
			<Pagination.Root
				count={10}
				fixedItems="no-ellipsis"
				page={3}
				itemComponent={(props) => (
					<Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
				)}
				ellipsisComponent={() => <></>}
			>
				<Pagination.Items />
			</Pagination.Root>
		));

		const page1 = getByText("Page 1");
		const page2 = getByText("Page 2");
		const page3 = getByText("Page 3");
		const page4 = getByText("Page 4");
		const page10 = getByText("Page 10");

		expect(page1).toBeVisible();
		expect(page2).toBeVisible();
		expect(page3).toBeVisible();
		expect(page4).toBeVisible();
		expect(page10).toBeVisible();
	});

	it("supports default page", () => {
		const onPageChange = vi.fn();

		const { getByText } = render(() => (
			<Pagination.Root
				defaultPage={4}
				onPageChange={onPageChange}
				count={10}
				itemComponent={() => <></>}
				ellipsisComponent={() => <></>}
			>
				<Pagination.Next>Next</Pagination.Next>
			</Pagination.Root>
		));

		expect(onPageChange).not.toBeCalled();

		const next = getByText("Next");

		fireEvent.click(next);

		expect(onPageChange).toBeCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(5);
	});

	it("supports controlled state", () => {
		const onPageChange = vi.fn();

		const { getByText } = render(() => (
			<Pagination.Root
				page={4}
				onPageChange={onPageChange}
				count={10}
				itemComponent={() => <></>}
				ellipsisComponent={() => <></>}
			>
				<Pagination.Next>Next</Pagination.Next>
			</Pagination.Root>
		));

		expect(onPageChange).not.toBeCalled();

		const next = getByText("Next");

		fireEvent.click(next);

		expect(onPageChange).toBeCalledTimes(1);
		expect(onPageChange).toHaveBeenCalledWith(5);
	});
});
