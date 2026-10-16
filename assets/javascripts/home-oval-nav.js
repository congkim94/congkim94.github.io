const pills = document.querySelectorAll(".home-oval .site-nav__pill");
const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (pills.length && motionOk) {
	pills.forEach((pill) => {
		// The arrow starts later, so it is the last piece to land when present.
		const last = pill.querySelector(".site-nav__ext svg") || pill.querySelector(".site-nav__label > span");
		if (!last) return;

		const roll = () => pill.classList.add("is-rolling");

		pill.addEventListener("pointerenter", roll);
		pill.addEventListener("focus", () => {
			if (pill.matches(":focus-visible")) roll();
		});
		last.addEventListener("transitionend", (event) => {
			if (event.target === last) pill.classList.remove("is-rolling");
		});
	});
}
