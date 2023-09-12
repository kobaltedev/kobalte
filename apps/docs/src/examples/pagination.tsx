import { Pagination } from "@kobalte/core";

import style from "./pagination.module.css";
import { createSignal } from "solid-js";

export function BasicExample() {
  return (
    <Pagination.Root
      class={style["pagination__root"]}
      count={10}
      itemComponent={props => (
        <Pagination.Item class={style["pagination__item"]} page={props.page}>
          {props.page}
        </Pagination.Item>
      )}
      ellipsisComponent={() => (
        <Pagination.Ellipsis class={style["pagination__ellipsis"]}>...</Pagination.Ellipsis>
      )}
    >
      <Pagination.Previous class={style["pagination__item"]}>Previous</Pagination.Previous>
      <Pagination.Items />
      <Pagination.Next class={style["pagination__item"]}>Next</Pagination.Next>
    </Pagination.Root>
  );
}

export function DefaultPageExample() {
  return (
    <Pagination.Root
      class={style["pagination__root"]}
      count={10}
      defaultPage={4}
      itemComponent={props => (
        <Pagination.Item class={style["pagination__item"]} page={props.page}>
          {props.page}
        </Pagination.Item>
      )}
      ellipsisComponent={() => (
        <Pagination.Ellipsis class={style["pagination__ellipsis"]}>...</Pagination.Ellipsis>
      )}
    >
      <Pagination.Previous class={style["pagination__item"]}>Previous</Pagination.Previous>
      <Pagination.Items />
      <Pagination.Next class={style["pagination__item"]}>Next</Pagination.Next>
    </Pagination.Root>
  );
}

export function ControlledExample() {
  const [page, setPage] = createSignal(4);

  return (
    <Pagination.Root
      class={style["pagination__root"]}
      page={page()}
      onPageChange={setPage}
      count={10}
      itemComponent={props => (
        <Pagination.Item class={style["pagination__item"]} page={props.page}>
          {props.page}
        </Pagination.Item>
      )}
      ellipsisComponent={() => (
        <Pagination.Ellipsis class={style["pagination__ellipsis"]}>...</Pagination.Ellipsis>
      )}
    >
      <Pagination.Previous class={style["pagination__item"]}>Previous</Pagination.Previous>
      <Pagination.Items />
      <Pagination.Next class={style["pagination__item"]}>Next</Pagination.Next>
    </Pagination.Root>
  );
}

export function ButtonsExample() {
  return (
    <Pagination.Root
      class={style["pagination__root"]}
      count={10}
      itemComponent={props => (
        <Pagination.Item class={style["pagination__item"]} page={props.page}>
          {props.page}
        </Pagination.Item>
      )}
      ellipsisComponent={() => (
        <Pagination.Ellipsis class={style["pagination__ellipsis"]}>...</Pagination.Ellipsis>
      )}
    >
      <Pagination.Items />
    </Pagination.Root>
  );
}

export function FirstLastExample() {
  return (
    <Pagination.Root
      class={style["pagination__root"]}
      count={10}
      showFirst={false}
      showLast={false}
      itemComponent={props => (
        <Pagination.Item class={style["pagination__item"]} page={props.page}>
          {props.page}
        </Pagination.Item>
      )}
      ellipsisComponent={() => (
        <Pagination.Ellipsis class={style["pagination__ellipsis"]}>...</Pagination.Ellipsis>
      )}
    >
      <Pagination.Previous class={style["pagination__item"]}>Previous</Pagination.Previous>
      <Pagination.Items />
      <Pagination.Next class={style["pagination__item"]}>Next</Pagination.Next>
    </Pagination.Root>
  );
}

export function SiblingsExample() {
  return (
    <Pagination.Root
      class={style["pagination__root"]}
      count={10}
      siblingCount={2}
      itemComponent={props => (
        <Pagination.Item class={style["pagination__item"]} page={props.page}>
          {props.page}
        </Pagination.Item>
      )}
      ellipsisComponent={() => (
        <Pagination.Ellipsis class={style["pagination__ellipsis"]}>...</Pagination.Ellipsis>
      )}
    >
      <Pagination.Previous class={style["pagination__item"]}>Previous</Pagination.Previous>
      <Pagination.Items />
      <Pagination.Next class={style["pagination__item"]}>Next</Pagination.Next>
    </Pagination.Root>
  );
}

export function FixedItemsExample() {
  return (
    <Pagination.Root
      class={style["pagination__root"]}
      count={10}
      fixedItems
      itemComponent={props => (
        <Pagination.Item class={style["pagination__item"]} page={props.page}>
          {props.page}
        </Pagination.Item>
      )}
      ellipsisComponent={() => (
        <Pagination.Ellipsis class={style["pagination__ellipsis"]}>...</Pagination.Ellipsis>
      )}
    >
      <Pagination.Previous class={style["pagination__item"]}>Previous</Pagination.Previous>
      <Pagination.Items />
      <Pagination.Next class={style["pagination__item"]}>Next</Pagination.Next>
    </Pagination.Root>
  );
}
