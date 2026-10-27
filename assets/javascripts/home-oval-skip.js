const root = document.documentElement;
const button = document.querySelector(".landing-skip");
const cursor = document.querySelector(".landing-skip-cursor");

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)");

const SKIP_FADE_MS = 700;
// The hint fades out over this long, and that fade finishes as the last
// word's first letter begins.
const HINT_FADE_MS = 200;
// A touch can land the moment the page appears. Hold the skip, and the
// line that offers it, so the opening has a beat first.
const TOUCH_SKIP_DELAY_MS = 300;
let hintTimer = 0;
let hintHideTimer = 0;
let hintArmTimer = 0;

function release(el) {
	el.style.opacity = "";
	el.style.scale = "";
	el.style.filter = "";
}

function fadeIn(el, opacity, scale, filter) {
	const isGlow = el.classList.contains("hero-oval__stage");
	// The oval's 30px blur is the glow itself. Leave it alone; the fade
	// was replacing it and the soft edge only came back when the fade ended.
	const blurMatch = isGlow ? null : /blur\(([\d.]+)px\)/.exec(filter || "");
	const blur = blurMatch ? Number(blurMatch[1]) : 0;
	const glowScale = isGlow && scale && scale !== "none" ? scale : "";
	const settled = Number(opacity) >= 0.99 && blur < 0.5 && (!glowScale || Number(glowScale) >= 0.99);

	if (settled) {
		release(el);
		return;
	}

	const from = { opacity: Number(opacity) };
	const to = { opacity: 1 };
	if (!isGlow) {
		from.filter = `blur(${blur}px)`;
		to.filter = "blur(0px)";
	}
	if (glowScale) {
		from.scale = glowScale;
		to.scale = 1;
	}

	const anim = el.animate([from, to], {
		duration: SKIP_FADE_MS,
		easing: "cubic-bezier(0.22, 1, 0.36, 1)",
		fill: "forwards",
	});
	anim.onfinish = () => {
		release(el);
		anim.cancel();
	};
}

function reveal() {
	if (!root.classList.contains("oval-landing")) return;

	const nodes = [
		...document.querySelectorAll(".hero-v2__char"),
		document.querySelector(".hero-oval__stage"),
		document.querySelector("header.site-nav"),
		document.querySelector("#my-work"),
		document.querySelector(".footer-v2"),
	].filter(Boolean);

	// Read the in-progress styles before the landing timeline is removed,
	// then hold them so the fade starts where the animation left off.
	const held = nodes.map((el) => {
		const style = getComputedStyle(el);
		return { el, opacity: style.opacity, scale: style.scale, filter: style.filter };
	});

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	root.classList.add("is-skip-fading");
	root.classList.remove("oval-landing", "is-skip-ready", "is-skip-cursor");
	clearTimeout(window.ovalLandingFallback);
	hideHint(true);
	window.setTimeout(() => {
		root.classList.remove("is-skip-fading");
		setChromeInert(false);
	}, reduceMotion ? 0 : SKIP_FADE_MS);

	if (reduceMotion) return;

	held.forEach(({ el, opacity, scale, filter }) => {
		el.style.opacity = opacity;
		if (el.classList.contains("hero-oval__stage") && scale && scale !== "none") el.style.scale = scale;
		if (!el.classList.contains("hero-oval__stage") && filter && filter !== "none") el.style.filter = filter;
		fadeIn(el, opacity, scale, filter);
	});
}

function whenDecoded(img) {
	if (!img) return Promise.resolve();
	if (img.decode) return img.decode().catch(() => {});
	if (img.complete) return Promise.resolve();
	return new Promise((resolve) => {
		img.addEventListener("load", resolve, { once: true });
		img.addEventListener("error", resolve, { once: true });
	});
}

const chrome = [
	document.querySelector("header.site-nav"),
	document.querySelector("#my-work"),
	document.querySelector(".footer-v2"),
].filter(Boolean);

function setChromeInert(on) {
	chrome.forEach((el) => {
		el.inert = on;
	});
}

if (root.classList.contains("oval-landing") && button && cursor) {
	// The homepage sheet is transformed, which would trap a fixed line
	// at the bottom of the page instead of the screen.
	document.body.prepend(button);
	document.body.append(cursor);
	setChromeInert(true);

	const glow = new Image();
	glow.src = "/assets/images/home-v2/oval-glow-fallback.png?v=1";

	const ready = Promise.all([
		document.fonts.ready.catch(() => {}),
		whenDecoded(glow),
		...[...document.querySelectorAll(".bento img:not([loading='lazy'])")].map(whenDecoded),
	]);

	function armSkip() {
		if (!root.classList.contains("oval-landing")) return;
		if (root.classList.contains("is-rest-started")) return;
		// Paint the line at rest (down, invisible) before the entrance
		// class, or the fade-up never runs.
		if (coarsePointer.matches && !root.classList.contains("is-skip-hint-gone")) {
			button.hidden = false;
			button.offsetWidth;
		}
		root.classList.add("is-skip-ready");
	}

	ready.then(() => {
		if (!root.classList.contains("oval-landing")) return;
		scheduleHintHide();
		if (coarsePointer.matches) {
			hintArmTimer = window.setTimeout(armSkip, TOUCH_SKIP_DELAY_MS);
			return;
		}
		armSkip();
	});

	scheduleHintHide();

	// Cancelling pointerdown can drop the click that would have cleared a
	// flag. Tie the swallow to this gesture and drop it on the next turn
	// if that click never comes, so the following click still works.
	let skipPointerId = null;
	document.addEventListener("pointerdown", (event) => {
		if (root.classList.contains("is-rest-started")) return;
		if (!root.classList.contains("is-skip-ready")) return;
		if (!root.classList.contains("oval-landing")) return;
		if (event.button !== 0) return;
		skipPointerId = event.pointerId;
		event.preventDefault();
		reveal();
	}, true);

	function releaseSkipGesture(event) {
		if (event.pointerId !== skipPointerId) return;
		const id = skipPointerId;
		window.setTimeout(() => {
			if (skipPointerId === id) skipPointerId = null;
		}, 0);
	}

	document.addEventListener("pointerup", releaseSkipGesture, true);
	document.addEventListener("pointercancel", releaseSkipGesture, true);

	document.addEventListener("click", (event) => {
		if (skipPointerId === null) return;
		skipPointerId = null;
		event.preventDefault();
		event.stopPropagation();
	}, true);

	document.addEventListener("pointermove", (event) => {
		if (root.classList.contains("is-rest-started")) return;
		if (!finePointer.matches) return;
		if (!root.classList.contains("is-skip-ready")) return;
		if (event.pointerType === "touch") return;
		cursor.style.transform = `translate3d(${event.clientX + 12}px, ${event.clientY + 14}px, 0)`;
		root.classList.add("is-skip-cursor");
	});

	document.addEventListener("pointerout", (event) => {
		if (event.relatedTarget) return;
		root.classList.remove("is-skip-cursor");
	});

	const landing = new MutationObserver(() => {
		if (root.classList.contains("oval-landing")) return;
		root.classList.remove("is-skip-ready", "is-skip-cursor");
		hideHint(true);
		if (!root.classList.contains("is-skip-fading")) setChromeInert(false);
		landing.disconnect();
	});
	landing.observe(root, { attributes: true, attributeFilter: ["class"] });
}

// The last word is "everyone." Its first letter waits --i * 29ms. The hint
// starts fading one fade earlier, so it is gone as that word begins.
function hideHint(immediate) {
	window.clearTimeout(hintTimer);
	window.clearTimeout(hintHideTimer);
	// A scheduled fade-out still leaves the tap itself available. Only a
	// finished landing should cancel the delayed arm.
	if (immediate) window.clearTimeout(hintArmTimer);
	root.classList.add("is-skip-hint-gone");
	if (!button) return;
	if (immediate) {
		button.hidden = true;
		return;
	}
	hintHideTimer = window.setTimeout(() => {
		button.hidden = true;
	}, HINT_FADE_MS);
}

function msUntilLastWord() {
	const char = document.querySelector(".hero-oval__tagline .hero-v2__word:last-child .hero-v2__char");
	if (!char) return null;
	const anim = char.getAnimations().find((item) => item.animationName === "oval-char-in");
	if (!anim || anim.currentTime == null || !anim.effect) return null;
	return anim.effect.getTiming().delay - anim.currentTime;
}

function scheduleHintHide(tries) {
	if (!coarsePointer.matches) return;
	window.clearTimeout(hintTimer);
	const remaining = msUntilLastWord();
	if (remaining == null) {
		if ((tries || 0) > 8) return;
		window.requestAnimationFrame(() => scheduleHintHide((tries || 0) + 1));
		return;
	}
	const wait = remaining - HINT_FADE_MS;
	if (wait <= 0) {
		root.classList.add("is-skip-hint-gone");
		return;
	}
	hintTimer = window.setTimeout(() => {
		if (!root.classList.contains("oval-landing")) return;
		hideHint(false);
	}, wait);
}
