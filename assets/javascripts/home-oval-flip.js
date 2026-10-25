const hero = document.querySelector(".hero-oval");
const disc = hero && hero.querySelector(".hero-v2__banner");
const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hero && disc && motionOk) {
  // Must match $oval-mask in _home-v2.scss, the shape shown before this runs.
  const ELLIPSE = { cx: 50, cy: 50, rx: 29.32, ry: 41.39, tilt: 45 };
  // The ellipse's tall axis at 90° lies level. The rest outline uses this
  // so a 45° tilt still fits inside the stage.
  const LEVEL_DEG = 90;
  // Letters fade in over 533ms, 29ms apart. The last finishes near 3.29s.
  // The glow, nav, cards, and footer start at 3.2s. Drop .oval-landing after.
  const LANDING_DONE_MS = 7600;
  const landing = document.documentElement.classList.contains("oval-landing");

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

  // Rest pose. The landing glow is a CSS scale, not a flip.
  setOutline(ELLIPSE.tilt, 1);
  hero.classList.add("is-flip-ready");
  if (landing) {
    clearTimeout(window.ovalLandingFallback);
    setTimeout(() => {
      document.documentElement.classList.remove("oval-landing");
    }, LANDING_DONE_MS);
  }
}
