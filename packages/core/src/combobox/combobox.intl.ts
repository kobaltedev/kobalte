export const COMBOBOX_INTL_TRANSLATIONS = {
	// Annouce option to screen readers on focus.
	focusAnnouncement: (optionText: string, isSelected: boolean) =>
		`${optionText}${isSelected ? ", selected" : ""}`,
	// Annouce the number of options available to screen readers on open.
	countAnnouncement: (optionCount: number) => {
		switch (optionCount) {
			case 1:
				return "one option available";
			default:
				`${optionCount} options available`;
		}
	},
	// Annouce the selection of an option to screen readers.
	selectedAnnouncement: (optionText: string) => `${optionText}, selected`,
	// `aria-label` of Combobox.Trigger.
	triggerLabel: "Show suggestions",
	// `aria-label` of Combobox.Listbox.
	listboxLabel: "Suggestions",
};

export type ComboboxIntlTranslations = typeof COMBOBOX_INTL_TRANSLATIONS;
