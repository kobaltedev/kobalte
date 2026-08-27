export const DATE_PICKER_INTL_MESSAGES = {
	selectedDateDescription: (date: string) => `Selected Date: ${date}`,
	selectedRangeDescription: (startDate: string, endDate: string) =>
		`Selected Range: ${startDate} to ${endDate}`,
};

export type DatePickerIntlTranslations = typeof DATE_PICKER_INTL_MESSAGES;
