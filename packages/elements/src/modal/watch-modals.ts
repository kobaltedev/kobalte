/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-aria/aria-modal-polyfill/src/index.ts
 *
 * Portions of this file are based on code from mantinedev.
 * MIT Licensed, Copyright (c) 2021 Vitaly Rtishchev.
 *
 * Credits to the Mantinedev team:
 * https://github.com/mantinedev/mantine/blob/1a89027b8becf923a3eec80c0aee90abf44e2e6b/src/mantine-hooks/src/use-focus-trap/create-aria-hider.ts
 */

import { noop } from "@kobalte/utils";

type Revert = () => void;

const currentDocument = typeof document !== "undefined" ? document : undefined;

const ROOT_ELEMENTS_SELECTOR = "body > :not(script, style)";
const ARIA_MODAL_SELECTOR = '[aria-modal="true"], [data-ismodal="true"]';

function hideOthers(document: Document, modal: HTMLElement) {
  // Apply `aria-hidden` on each sibling element of the highest ancestor element of modal (e.g. the portal).
  const elements = Array.from<HTMLElement>(document.querySelectorAll(ROOT_ELEMENTS_SELECTOR))
    .filter(element => !element.contains(modal))
    .map(element => {
      const previousAriaHidden = element.getAttribute("aria-hidden") || "";
      element.setAttribute("aria-hidden", "true");

      return { element, previousAriaHidden };
    });

  return () => {
    // Restore previous `aria-hidden` value of each element.
    elements.forEach(({ element, previousAriaHidden }) => {
      if (previousAriaHidden) {
        element.setAttribute("aria-hidden", previousAriaHidden);
      } else {
        element.removeAttribute("aria-hidden");
      }
    });
  };
}

/**
 * Polyfill for `aria-modal`, watch for added modals and hide any surrounding DOM elements with `aria-hidden`.
 */
export function watchModals(selector = "body", { document = currentDocument } = {}): Revert {
  /**
   * Listen for additions to the child list of the selected element (defaults to body). This is where providers render modal portals.
   * When one is added, see if there is a modal inside it, if there is, then hide everything else from screen readers.
   * If there was already a modal open and a new one was added, undo everything that the previous modal had hidden and hide based on the new one.
   *
   * If a modal container is removed, then undo the hiding based on the last hide others. Check if there are any other modals still around, and
   * hide based on the last one added.
   */
  const target = document?.querySelector(selector);

  if (document == null || target == null) {
    return noop;
  }

  const config = { childList: true };
  let modalContainers: any[] = [];
  let undo: Revert | undefined;

  const observer = new MutationObserver(mutationRecord => {
    for (const mutation of mutationRecord) {
      if (mutation.type !== "childList") {
        continue;
      }

      if (mutation.addedNodes.length > 0) {
        const addNode: Element = Array.from(mutation.addedNodes).find((node: any) =>
          node.querySelector?.(ARIA_MODAL_SELECTOR)
        ) as HTMLElement;

        if (addNode) {
          modalContainers.push(addNode);

          const modal = addNode.querySelector(ARIA_MODAL_SELECTOR) as HTMLElement;

          undo?.();
          undo = hideOthers(document, modal);
        }
      } else if (mutation.removedNodes.length > 0) {
        const removedNodes = Array.from(mutation.removedNodes);

        const nodeIndexRemove = modalContainers.findIndex(container =>
          removedNodes.includes(container)
        );

        if (nodeIndexRemove >= 0) {
          undo?.();
          modalContainers = modalContainers.filter((val, i) => i !== nodeIndexRemove);

          if (modalContainers.length > 0) {
            const modal =
              modalContainers[modalContainers.length - 1].querySelector(ARIA_MODAL_SELECTOR);

            undo = hideOthers(document, modal);
          } else {
            undo = undefined;
          }
        }
      }
    }
  });

  observer.observe(target, config);

  return () => {
    undo?.();
    observer.disconnect();
  };
}
