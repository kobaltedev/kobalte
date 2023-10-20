export const COMBOBOX_INTL_TRANSLATIONS = {
  focusAnnouncement: () => "{optionText}{isSelected, select, true {, selected} other {}}",
  countAnnouncement: () => "{optionCount, plural, one {# option} other {# options}} available.",
  selectedAnnouncement: (optionText: string) => `${optionText}, selected`,
  triggerLabel: "Show suggestions",
  listboxLabel: "Suggestions",
};

export type ComboboxIntlTranslations = typeof COMBOBOX_INTL_TRANSLATIONS;
