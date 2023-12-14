export const COMBOBOX_INTL_TRANSLATIONS = {
  focusAnnouncement: (optionText: string, isSelected: boolean) =>
    `${optionText}${isSelected ? ", selected" : ""}`,
  countAnnouncement: (optionCount: number) => {
    switch (optionCount) {
      case 1:
        return "one option available";
      default:
        `${optionCount} options available`;
    }
  },
  selectedAnnouncement: (optionText: string) => `${optionText}, selected`,
  triggerLabel: "Show suggestions",
  listboxLabel: "Suggestions",
};

export type ComboboxIntlTranslations = typeof COMBOBOX_INTL_TRANSLATIONS;
