// utils
export * from "./color-mode/index.tsx";
export * from "./form-control/index.ts";
export * from "./i18n/index.tsx";
export * from "./list/index.ts";
export * from "./live-announcer/index.ts";
export * from "./polymorphic/index.tsx";
export * from "./primitives/index.ts";
export * from "./selection/index.ts";
export * from "./toast/toaster.ts";

// components
export * as Accordion from "./accordion/index.tsx";
export * as Alert from "./alert/index.tsx";
export * as AlertDialog from "./alert-dialog/index.tsx";
export * as Breadcrumbs from "./breadcrumbs/index.tsx";
export * as Button from "./button/index.tsx";
//export * as Calendar from "./calendar";
export * as Checkbox from "./checkbox/index.tsx";
export * as Collapsible from "./collapsible/index.tsx";
export * as Combobox from "./combobox/index.tsx";
export * as ContextMenu from "./context-menu/index.tsx";
//export * as DatePicker from "./date-picker";
export * as Dialog from "./dialog/index.tsx";
export * as DropdownMenu from "./dropdown-menu/index.tsx";
export * as HoverCard from "./hover-card/index.tsx";
export * as Image from "./image/index.tsx";
export * as Link from "./link/index.tsx";
export * as Listbox from "./listbox/index.tsx";
export * as Menubar from "./menubar/index.tsx";
export * as NumberField from "./number-field/index.tsx";
export * as Pagination from "./pagination/index.tsx";
export * as Popover from "./popover/index.tsx";
export * as Progress from "./progress/index.tsx";
export * as RadioGroup from "./radio-group/index.tsx";
export * as Select from "./select/index.tsx";
export * as Separator from "./separator/index.tsx";
export * as Skeleton from "./skeleton/index.tsx";
export * as Slider from "./slider/index.tsx";
export * as Switch from "./switch/index.tsx";
export * as Tabs from "./tabs/index.tsx";
export * as TextField from "./text-field/index.tsx";
export * as Toast from "./toast/index.tsx";
export * as ToggleButton from "./toggle-button/index.tsx";
export * as ToggleGroup from "./toggle-group/index.tsx";
export * as Tooltip from "./tooltip/index.tsx";

// @ts-ignore
console["w" + "arn"](
	`[kobalte]: Importing from "@kobalte/core" is deprecated, use specific imports instead. For more information checkout each component's page at https://kobalte.dev/.`,
);
