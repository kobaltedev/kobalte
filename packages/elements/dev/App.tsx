import { createEffect, createSignal, onCleanup } from "solid-js";

import { Button, Popover } from "../src";

function hasSelectionWithin(element?: Element | null) {
  const selection = element?.ownerDocument.getSelection();

  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  if (range.collapsed) {
    return false;
  }

  return !!element?.contains(range.commonAncestorContainer);
}

export default function App() {
  let popoverRef: any;
  let paragraphRef: any;

  const [isOpen, setIsOpen] = createSignal(false);

  createEffect(() => {
    /*
    if (!popoverRef) {
      return;
    }

    if (!paragraphRef) {
      return;
    }
    */

    const doc = paragraphRef.ownerDocument || document;

    const onMouseUp = () => {
      if (!hasSelectionWithin(paragraphRef)) {
        return;
      }

      setIsOpen(true);
    };

    const onSelect = () => {
      if (popoverRef?.contains(doc.activeElement)) {
        return;
      }

      if (hasSelectionWithin(paragraphRef)) {
        return;
      }

      setIsOpen(false);
    };

    doc.addEventListener("mouseup", onMouseUp);
    doc.addEventListener("selectionchange", onSelect);

    onCleanup(() => {
      doc.removeEventListener("mouseup", onMouseUp);
      doc.removeEventListener("selectionchange", onSelect);
    });
  });

  return (
    <>
      <div>
        <Popover
          isOpen={isOpen()}
          onOpenChange={setIsOpen}
          placement="bottom"
          getAnchorRect={() => {
            const selection = paragraphRef?.ownerDocument.getSelection();

            if (!selection?.rangeCount) {
              return null;
            }

            const range = selection.getRangeAt(0);
            return range.getBoundingClientRect();
          }}
          autoFocus={false}
          shouldCloseOnInteractOutside={() => !hasSelectionWithin(paragraphRef)}
        >
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Panel ref={popoverRef} class="popover">
                <Popover.Arrow size={24} class="arrow" />
                <Button class="button secondary">Bookmark</Button>
                <Button class="button secondary">Edit</Button>
                <Button class="button secondary">Share</Button>
                <Popover.CloseButton>Button</Popover.CloseButton>
              </Popover.Panel>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover>
        <p ref={paragraphRef}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio, sed fuga necessitatibus
          aliquid expedita atque? Doloremque ea sequi totam laudantium laboriosam repellat quasi
          commodi omnis aut nulla. Numquam, beatae maxime.
        </p>
      </div>
    </>
  );
}
