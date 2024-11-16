export const TIME_FIELD_INTL_MESSAGES = {
	hour: "hour",
	minute: "minute",
	second: "second",
	dayPeriod: "AM/PM",
	timeZoneName: "time zone",
	selectedTimeDescription: (time: string) => `Selected Time: ${time}`,
};

export type TimeFieldIntlTranslations = typeof TIME_FIELD_INTL_MESSAGES;
