export const DATE_FIELD_INTL_MESSAGES = {
	era: "era",
	year: "year",
	month: "month",
	day: "day",
	hour: "hour",
	minute: "minute",
	second: "second",
	dayPeriod: "AM/PM",
	timeZoneName: "time zone",
	selectedDateDescription: (date: string) => `Selected Date: ${date}`,
	placeholder: {
		year: "yyyy",
		month: "mm",
		day: "dd",
	},
};

export type DateFieldIntlTranslations = typeof DATE_FIELD_INTL_MESSAGES;
