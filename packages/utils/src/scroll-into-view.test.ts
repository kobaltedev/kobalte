import { scrollIntoViewport } from "./scroll-into-view";

describe("scrollIntoViewport", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = "";
		document.documentElement.style.removeProperty("overflow");
	});

	// https://github.com/kobaltedev/kobalte/issues/747
	it("scrolls each scroll parent once when the root element hides overflow", () => {
		document.documentElement.style.overflow = "hidden";
		document.body.innerHTML = `
			<div id="outer" style="overflow: auto">
				<div id="inner" style="overflow: auto">
					<button id="target"></button>
				</div>
			</div>
		`;

		// Throw instead of hanging if the walk up the scroll parents never ends.
		const getComputedStyle = window.getComputedStyle.bind(window);
		let calls = 0;
		vi.spyOn(window, "getComputedStyle").mockImplementation((...args) => {
			if (++calls > 100) {
				throw new Error("scrollIntoViewport did not terminate");
			}
			return getComputedStyle(...args);
		});

		const inner = vi.spyOn(
			document.getElementById("inner")!,
			"scrollTop",
			"set",
		);
		const outer = vi.spyOn(
			document.getElementById("outer")!,
			"scrollTop",
			"set",
		);
		const root = vi.spyOn(document.documentElement, "scrollTop", "set");

		scrollIntoViewport(document.getElementById("target")!);

		expect(inner).toHaveBeenCalledTimes(1);
		expect(outer).toHaveBeenCalledTimes(1);
		expect(root).not.toHaveBeenCalled();
	});
});
