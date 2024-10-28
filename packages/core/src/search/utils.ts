/*
 * Executes timeout callback after a set time
 */
export const DebouncerTimeout = () => {
	let _debounceMillisecond = 0;
	let lastCallbackTime = 0;
	let timeout: NodeJS.Timeout;

	return {
		debounce: (callback: () => void) => {
			if (lastCallbackTime > Date.now() - _debounceMillisecond)
				clearTimeout(timeout);
			timeout = setTimeout(callback, _debounceMillisecond);
			lastCallbackTime = Date.now();
			return timeout;
		},
		setDebounceMillisecond: (debounceMillisecond = 0) => {
			_debounceMillisecond = debounceMillisecond;
		},
	};
};
