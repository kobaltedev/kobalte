import type {
	ComboboxBaseItemComponentProps as SearchRootItemComponentProps,
	ComboboxBaseSectionComponentProps as SearchRootSectionComponentProps,
} from "../combobox/combobox-base";
// Search implements combobox without filter, hence the import alias
import {
	ComboboxContent as Content,
	type ComboboxContentCommonProps as SearchContentCommonProps,
	type ComboboxContentOptions as SearchContentOptions,
	type ComboboxContentProps as SearchContentProps,
	type ComboboxContentRenderProps as SearchContentRenderProps,
} from "../combobox/combobox-content";
import {
	ComboboxControl as Control,
	type ComboboxControlCommonProps as SearchControlCommonProps,
	type ComboboxControlOptions as SearchControlOptions,
	type ComboboxControlProps as SearchControlProps,
	type ComboboxControlRenderProps as SearchControlRenderProps,
} from "../combobox/combobox-control";
import {
	ComboboxHiddenSelect as HiddenSelect,
	type ComboboxHiddenSelectProps as SearchHiddenSelectProps,
} from "../combobox/combobox-hidden-select";
import {
	ComboboxIcon as Icon,
	type ComboboxIconProps as SearchIconProps,
} from "../combobox/combobox-icon";
import {
	ComboboxInput as Input,
	type ComboboxInputCommonProps as SearchInputCommonProps,
	type ComboboxInputOptions as SearchInputOptions,
	type ComboboxInputProps as SearchInputProps,
	type ComboboxInputRenderProps as SearchInputRenderProps,
} from "../combobox/combobox-input";
import {
	ComboboxListbox as Listbox,
	type ComboboxListboxCommonProps as SearchListboxCommonProps,
	type ComboboxListboxOptions as SearchListboxOptions,
	type ComboboxListboxProps as SearchListboxProps,
	type ComboboxListboxRenderProps as SearchListboxRenderProps,
} from "../combobox/combobox-listbox";
import {
	ComboboxPortal as Portal,
	type ComboboxPortalProps as SearchPortalProps,
} from "../combobox/combobox-portal";
import type { ComboboxTriggerMode as SearchTriggerMode } from "../combobox/types";
import {
	FormControlDescription as Description,
	FormControlLabel as Label,
	type FormControlDescriptionCommonProps as SearchDescriptionCommonProps,
	type FormControlDescriptionOptions as SearchDescriptionOptions,
	type FormControlDescriptionProps as SearchDescriptionProps,
	type FormControlDescriptionRenderProps as SearchDescriptionRenderProps,
	type FormControlLabelCommonProps as SearchLabelCommonProps,
	type FormControlLabelOptions as SearchLabelOptions,
	type FormControlLabelProps as SearchLabelProps,
	type FormControlLabelRenderProps as SearchLabelRenderProps,
} from "../form-control";
import {
	Item,
	ItemDescription,
	ItemLabel,
	type ListboxItemCommonProps as SearchItemCommonProps,
	type ListboxItemDescriptionCommonProps as SearchItemDescriptionCommonProps,
	type ListboxItemDescriptionOptions as SearchItemDescriptionOptions,
	type ListboxItemDescriptionProps as SearchItemDescriptionProps,
	type ListboxItemDescriptionRenderProps as SearchItemDescriptionRenderProps,
	type ListboxItemLabelCommonProps as SearchItemLabelCommonProps,
	type ListboxItemLabelOptions as SearchItemLabelOptions,
	type ListboxItemLabelProps as SearchItemLabelProps,
	type ListboxItemLabelRenderProps as SearchItemLabelRenderProps,
	type ListboxItemOptions as SearchItemOptions,
	type ListboxItemProps as SearchItemProps,
	type ListboxItemRenderProps as SearchItemRenderProps,
	type ListboxSectionCommonProps as SearchSectionCommonProps,
	type ListboxSectionOptions as SearchSectionOptions,
	type ListboxSectionProps as SearchSectionProps,
	type ListboxSectionRenderProps as SearchSectionRenderProps,
	Section,
} from "../listbox";
import {
	Arrow,
	type PopperArrowOptions as SearchArrowOptions,
	type PopperArrowProps as SearchArrowProps,
} from "../popper";

import {
	SearchIndicator as Indicator,
	type SearchIndicatorCommonProps,
	type SearchIndicatorOptions,
	type SearchIndicatorProps,
} from "./search-indicator";
import {
	SearchNoResult as NoResult,
	type SearchNoResultCommonProps,
	type SearchNoResultOptions,
	type SearchNoResultProps,
} from "./search-no-result";

// Wrappers over Combobox need to redefine prop types
import {
	SearchRoot as Root,
	type SearchMultipleSelectionOptions,
	type SearchRootCommonProps,
	type SearchRootOptions,
	type SearchRootProps,
	type SearchRootRenderProps,
	type SearchSingleSelectionOptions,
} from "./search-root";

export type {
	SearchArrowOptions,
	SearchArrowProps,
	SearchContentCommonProps,
	SearchContentOptions,
	SearchContentProps,
	SearchContentRenderProps,
	SearchControlCommonProps,
	SearchControlOptions,
	SearchControlProps,
	SearchControlRenderProps,
	SearchDescriptionCommonProps,
	SearchDescriptionOptions,
	SearchDescriptionProps,
	SearchDescriptionRenderProps,
	SearchHiddenSelectProps,
	SearchIconProps,
	SearchIndicatorCommonProps,
	SearchIndicatorOptions,
	SearchIndicatorProps,
	SearchInputCommonProps,
	SearchInputOptions,
	SearchInputProps,
	SearchInputRenderProps,
	SearchItemCommonProps,
	SearchItemDescriptionCommonProps,
	SearchItemDescriptionOptions,
	SearchItemDescriptionProps,
	SearchItemDescriptionRenderProps,
	SearchItemLabelCommonProps,
	SearchItemLabelOptions,
	SearchItemLabelProps,
	SearchItemLabelRenderProps,
	SearchItemOptions,
	SearchItemProps,
	SearchItemRenderProps,
	SearchLabelCommonProps,
	SearchLabelOptions,
	SearchLabelProps,
	SearchLabelRenderProps,
	SearchListboxCommonProps,
	SearchListboxOptions,
	SearchListboxProps,
	SearchListboxRenderProps,
	SearchMultipleSelectionOptions,
	SearchNoResultCommonProps,
	SearchNoResultOptions,
	SearchNoResultProps,
	SearchPortalProps,
	SearchRootCommonProps,
	SearchRootItemComponentProps,
	SearchRootOptions,
	SearchRootProps,
	SearchRootRenderProps,
	SearchRootSectionComponentProps,
	SearchSectionCommonProps,
	SearchSectionOptions,
	SearchSectionProps,
	SearchSectionRenderProps,
	SearchSingleSelectionOptions,
	SearchTriggerMode,
};

export {
	Arrow,
	Content,
	Control,
	Description,
	HiddenSelect,
	Icon,
	Indicator,
	Input,
	Item,
	ItemDescription,
	ItemLabel,
	Label,
	Listbox,
	NoResult,
	Portal,
	Root,
	Section,
};

export const Search = Object.assign(Root, {
	Arrow,
	Content,
	Control,
	Description,
	HiddenSelect,
	Icon,
	Input,
	Item,
	ItemDescription,
	ItemLabel,
	Label,
	Listbox,
	Portal,
	Section,
	NoResult,
	Indicator,
});

/**
 * API will most probably change
 */
export { type SearchContextValue, useSearchContext } from "./search-context";
