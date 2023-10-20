import { fireEvent, render, screen } from "@solidjs/testing-library";

import * as Pagination from ".";

describe("Pagination", () => {
  it("renders correctly when changing page", () => {
    render(() => (
      <Pagination.Root
        count={7}
        itemComponent={props => (
          <Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
        )}
        ellipsisComponent={() => <Pagination.Ellipsis>Ellipsis</Pagination.Ellipsis>}
      >
        <Pagination.Items />
        <Pagination.Next>Next</Pagination.Next>
      </Pagination.Root>
    ));

    const next = screen.getByText("Next");

    expect(screen.getByText("Page 1")).toBeVisible();
    expect(screen.getByText("Page 2")).toBeVisible();
    expect(screen.queryAllByText("Ellipsis")).toHaveLength(1);
    expect(screen.getByText("Page 7")).toBeVisible();

    fireEvent.click(next);

    expect(screen.getByText("Page 1")).toBeVisible();
    expect(screen.getByText("Page 2")).toBeVisible();
    expect(screen.getByText("Page 3")).toBeVisible();
    expect(screen.queryAllByText("Ellipsis")).toHaveLength(1);
    expect(screen.getByText("Page 7")).toBeVisible();

    fireEvent.click(next);

    expect(screen.getByText("Page 1")).toBeVisible();
    expect(screen.getByText("Page 2")).toBeVisible();
    expect(screen.getByText("Page 3")).toBeVisible();
    expect(screen.getByText("Page 4")).toBeVisible();
    expect(screen.queryAllByText("Ellipsis")).toHaveLength(1);
    expect(screen.getByText("Page 7")).toBeVisible();

    fireEvent.click(next);

    expect(screen.getByText("Page 1")).toBeVisible();
    expect(screen.getByText("Page 3")).toBeVisible();
    expect(screen.getByText("Page 4")).toBeVisible();
    expect(screen.getByText("Page 5")).toBeVisible();
    expect(screen.queryAllByText("Ellipsis")).toHaveLength(2);
    expect(screen.getByText("Page 7")).toBeVisible();

    fireEvent.click(next);

    expect(screen.getByText("Page 1")).toBeVisible();
    expect(screen.queryAllByText("Ellipsis")).toHaveLength(1);
    expect(screen.getByText("Page 4")).toBeVisible();
    expect(screen.getByText("Page 5")).toBeVisible();
    expect(screen.getByText("Page 6")).toBeVisible();
    expect(screen.getByText("Page 7")).toBeVisible();

    fireEvent.click(next);

    expect(screen.getByText("Page 1")).toBeVisible();
    expect(screen.queryAllByText("Ellipsis")).toHaveLength(1);
    expect(screen.getByText("Page 5")).toBeVisible();
    expect(screen.getByText("Page 6")).toBeVisible();
    expect(screen.getByText("Page 7")).toBeVisible();

    fireEvent.click(next);

    expect(screen.getByText("Page 1")).toBeVisible();
    expect(screen.queryAllByText("Ellipsis")).toHaveLength(1);
    expect(screen.getByText("Page 6")).toBeVisible();
    expect(screen.getByText("Page 7")).toBeVisible();
  });

  it("renders correct number of pages", () => {
    render(() => (
      <Pagination.Root
        count={10}
        itemComponent={props => (
          <Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
        )}
        ellipsisComponent={() => <></>}
      >
        <Pagination.Items />
      </Pagination.Root>
    ));

    const page1 = screen.getByText("Page 1");
    const page2 = screen.getByText("Page 2");
    const page10 = screen.getByText("Page 10");

    expect(page1).toBeVisible();
    expect(page2).toBeVisible();
    expect(page10).toBeVisible();
  });

  it("renders correct number of siblings", () => {
    render(() => (
      <Pagination.Root
        count={10}
        defaultPage={4}
        siblingCount={2}
        itemComponent={props => (
          <Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
        )}
        ellipsisComponent={() => <></>}
      >
        <Pagination.Items />
      </Pagination.Root>
    ));

    const page1 = screen.getByText("Page 1");
    const page2 = screen.getByText("Page 2");
    const page3 = screen.getByText("Page 3");
    const page4 = screen.getByText("Page 4");
    const page5 = screen.getByText("Page 5");
    const page6 = screen.getByText("Page 6");
    const page10 = screen.getByText("Page 10");

    expect(page1).toBeVisible();
    expect(page2).toBeVisible();
    expect(page3).toBeVisible();
    expect(page4).toBeVisible();
    expect(page5).toBeVisible();
    expect(page6).toBeVisible();
    expect(page10).toBeVisible();
  });

  it("renders correctly when hiding first/last", () => {
    render(() => (
      <Pagination.Root
        count={10}
        defaultPage={4}
        showFirst={false}
        showLast={false}
        itemComponent={props => (
          <Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
        )}
        ellipsisComponent={() => <></>}
      >
        <Pagination.Items />
      </Pagination.Root>
    ));

    const page1 = screen.queryByText("Page 1");
    const page3 = screen.getByText("Page 3");
    const page4 = screen.getByText("Page 4");
    const page5 = screen.getByText("Page 5");
    const page10 = screen.queryByText("Page 10");

    expect(page1).not.toBeInTheDocument();
    expect(page3).toBeVisible();
    expect(page4).toBeVisible();
    expect(page5).toBeVisible();
    expect(page10).not.toBeInTheDocument();
  });

  it("renders correct number of siblings with fixedItems=true", () => {
    render(() => (
      <Pagination.Root
        count={10}
        fixedItems
        page={3}
        itemComponent={props => (
          <Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
        )}
        ellipsisComponent={() => <></>}
      >
        <Pagination.Items />
      </Pagination.Root>
    ));

    const page1 = screen.getByText("Page 1");
    const page2 = screen.getByText("Page 2");
    const page3 = screen.getByText("Page 3");
    const page4 = screen.getByText("Page 4");
    const page5 = screen.getByText("Page 5");
    const page10 = screen.getByText("Page 10");

    expect(page1).toBeVisible();
    expect(page2).toBeVisible();
    expect(page3).toBeVisible();
    expect(page4).toBeVisible();
    expect(page5).toBeVisible();
    expect(page10).toBeVisible();
  });

  it("renders correct number of siblings with fixedItems=no-ellipsis", () => {
    render(() => (
      <Pagination.Root
        count={10}
        fixedItems="no-ellipsis"
        page={3}
        itemComponent={props => (
          <Pagination.Item page={props.page}>Page {props.page}</Pagination.Item>
        )}
        ellipsisComponent={() => <></>}
      >
        <Pagination.Items />
      </Pagination.Root>
    ));

    const page1 = screen.getByText("Page 1");
    const page2 = screen.getByText("Page 2");
    const page3 = screen.getByText("Page 3");
    const page4 = screen.getByText("Page 4");
    const page10 = screen.getByText("Page 10");

    expect(page1).toBeVisible();
    expect(page2).toBeVisible();
    expect(page3).toBeVisible();
    expect(page4).toBeVisible();
    expect(page10).toBeVisible();
  });

  it("supports default page", () => {
    const onPageChange = jest.fn();

    render(() => (
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

    const next = screen.getByText("Next");

    fireEvent.click(next);

    expect(onPageChange).toBeCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("supports controlled state", () => {
    const onPageChange = jest.fn();

    render(() => (
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

    const next = screen.getByText("Next");

    fireEvent.click(next);

    expect(onPageChange).toBeCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(5);
  });
});
