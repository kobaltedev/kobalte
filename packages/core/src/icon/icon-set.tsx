import { createIcon } from "./create-icon";

export const SpinnerIcon = createIcon({
  path: () => (
    <g fill="none">
      <path
        d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14zm0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10z"
        opacity="0.2"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      />
      <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7H2z" fill="currentColor" />
    </g>
  ),
});

export const XMarkIcon = createIcon({
  path: () => (
    <path
      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  ),
});
