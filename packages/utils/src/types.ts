export type ValidationState = "valid" | "invalid";

export type Orientation = "horizontal" | "vertical";

export interface RangeValue<T> {
	/** The start value of the range. */
	start: T;

	/** The end value of the range. */
	end: T;
}
