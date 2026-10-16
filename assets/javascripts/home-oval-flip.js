const hero = document.querySelector(".hero-oval");
const disc = hero && hero.querySelector(".hero-v2__banner");
const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hero && disc && motionOk) {
  const EDGE_ON = Math.PI / 2;
  // The ellipse's tall axis at 90° lies level, so the spin ends parallel.
  const LEVEL_DEG = 90;
  // Must match $oval-mask in _home-v2.scss, the shape shown before this runs.
  const ELLIPSE = { cx: 50, cy: 50, rx: 29.32, ry: 41.39, tilt: 45 };
  // Landing plays the flip in reverse: the disc arrives edge-on and level,
  // then swings open to its tilt with a slight overshoot.
  const LANDING_DELAY = 150;
  const LANDING_MS = 1500;
  // Tagline's CSS entrance: 0.85s delay + 1.2s duration (see _home-v2.scss).
  const TEXT_IN_MS = 2100;
  const OVERSHOOT = 1.3;
  const landing = document.documentElement.classList.contains("oval-landing");
  let pinStart = 0;
  let pinEnd = 1;
  let ticking = false;
  // Flip progress still to unwind from the landing (1 edge-on, 0 at rest,
  // briefly negative while it overshoots past the tilt).
  let unwind = landing ? 1 : 0;

  // The flip spans exactly the scroll range where the sticky disc is pinned:
  // from reaching its sticky top until its bottom margin meets the hero's end.
  const measure = () => {
    const rect = disc.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const heroStyle = getComputedStyle(hero);
    const discStyle = getComputedStyle(disc);
    const stickyTop = parseFloat(discStyle.top);
    const heroTop = heroRect.top + window.scrollY;
    const heroContentBottom = heroRect.bottom + window.scrollY - parseFloat(heroStyle.paddingBottom);
    const naturalTop = heroTop + parseFloat(heroStyle.paddingTop) + parseFloat(discStyle.marginTop);
    const pinnedTop = heroContentBottom - parseFloat(discStyle.marginBottom) - rect.height;

    pinStart = naturalTop - stickyTop;
    pinEnd = Math.max(pinStart + 1, pinnedTop - stickyTop);
  };

  // The outline is a polygon in percentages of the square stage. It draws
  // in the same frame it changes, where a swapped mask image would blank
  // the disc while Firefox decodes it.
  const OUTLINE_POINTS = 120;
  let lastClip = "";

  // Turning toward level widens the ellipse past its box, so it scales down
  // just enough for its horizontal extent to stay inside. Squash then
  // flattens it about its center.
  const setOutline = (angle, squash) => {
    const { cx, cy, rx, ry } = ELLIPSE;
    const turn = (angle * Math.PI) / 180;
    const fromLevel = turn - (LEVEL_DEG * Math.PI) / 180;
    const halfWidth = Math.hypot(ry * Math.cos(fromLevel), rx * Math.sin(fromLevel));
    const fit = Math.min(1, cx / halfWidth);
    const a = rx * fit;
    const b = ry * fit;
    const cos = Math.cos(turn);
    const sin = Math.sin(turn);

    const points = [];
    for (let i = 0; i < OUTLINE_POINTS; i += 1) {
      const t = (i / OUTLINE_POINTS) * 2 * Math.PI;
      const ex = a * Math.cos(t);
      const ey = b * Math.sin(t);
      const x = cx + ex * cos - ey * sin;
      const y = cy + (ex * sin + ey * cos) * squash;
      points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
    }
    const clip = `polygon(${points.join(",")})`;
    if (clip !== lastClip) {
      lastClip = clip;
      hero.style.setProperty("--oval-clip", clip);
    }
  };

  // The outline spins as its height follows a disc tipping back on its
  // horizontal axis.
  const update = () => {
    ticking = false;
    const progress = Math.min(1, Math.max(0, (window.scrollY - pinStart) / (pinEnd - pinStart)));
    const turn = unwind + progress * (1 - unwind);
    const { tilt } = ELLIPSE;
    setOutline(tilt + turn * (LEVEL_DEG - tilt), Math.cos(Math.max(0, turn) * EDGE_ON));
    document.body.style.setProperty("--flip", progress.toFixed(4));

    // Fully flipped hands off to the cards; back at the top resets them.
    const flipped = hero.classList.contains("is-flipped");
    if (progress >= 1 && !flipped) {
      hero.classList.add("is-flipped");
      hero.dispatchEvent(new CustomEvent("oval:flipped"));
    } else if (progress <= 0 && flipped) {
      hero.classList.remove("is-flipped");
      hero.dispatchEvent(new CustomEvent("oval:reset"));
    }
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    requestUpdate();
  });

  // Ease-out-back: rises past 1 near the end, then settles on it.
  const settle = (t) => 1 + (OVERSHOOT + 1) * (t - 1) ** 3 + OVERSHOOT * (t - 1) ** 2;

  const land = () => {
    clearTimeout(window.ovalLandingFallback);
    let start = 0;
    const step = (now) => {
      start = start || now;
      const t = Math.min(1, Math.max(0, (now - start - LANDING_DELAY) / LANDING_MS));
      unwind = 1 - settle(t);
      update();
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        unwind = 0;
        update();
      }
    };
    requestAnimationFrame(step);
    // Drop the landing class once the text entrances finish so scroll-exit
    // opacity/blur can run without fighting the entrance fill mode.
    setTimeout(() => {
      document.documentElement.classList.remove("oval-landing");
    }, TEXT_IN_MS);
  };

  measure();
  update();
  hero.classList.add("is-flip-ready");
  if (landing) land();
}
