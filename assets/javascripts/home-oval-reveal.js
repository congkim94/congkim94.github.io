const grid = document.querySelector(".home-oval .work-v2__grid");
const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (grid && motionOk) {
  // Share of the window height a card travels above the bottom edge while
  // it fades from 0 to 1.
  const FADE_SPAN = 0.35;
  const DRIFT_PX = 40;
  const items = Array.from(grid.children);
  let ticking = false;

  const update = () => {
    ticking = false;
    const span = window.innerHeight * FADE_SPAN;
    items.forEach((item) => {
      const progress = parseFloat(item.style.getPropertyValue("--card-in")) || 0;
      // Measure the untransformed top so the drift doesn't feed back in.
      const top = item.getBoundingClientRect().top - (1 - progress) * DRIFT_PX;
      const next = Math.min(1, Math.max(0, (window.innerHeight - top) / span));
      item.style.setProperty("--card-in", next.toFixed(3));
    });
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  grid.classList.add("is-reveal-ready");
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}
