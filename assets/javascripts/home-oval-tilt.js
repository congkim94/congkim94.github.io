const hero = document.querySelector(".hero-oval");
const stage = hero && hero.querySelector(".hero-oval__stage");
const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// The part of the oval under the cursor presses gently away, and the disc
// eases back flat when the cursor leaves it. The hit test uses the live
// outline home-oval-flip.js sets, so it follows the flip.
if (hero && stage && motionOk && finePointer) {
  const MAX_DEG = 9;
  const EASE = 0.1;
  const SETTLED = 0.01;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let frame = 0;

  // The outline polygon (--oval-clip, in stage %), parsed once per change.
  let lastClip = "";
  let outline = [];
  const readOutline = () => {
    const clip = hero.style.getPropertyValue("--oval-clip");
    if (clip !== lastClip) {
      lastClip = clip;
      outline = Array.from(clip.matchAll(/(-?[\d.]+)% (-?[\d.]+)%/g), (m) => [m[1] / 100, m[2] / 100]);
    }
    return outline;
  };

  // Even-odd ray cast: is the stage-uv point inside the outline?
  const overOval = (u, v) => {
    const points = readOutline();
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      if (yi > v !== yj > v && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };

  const step = () => {
    current.x += (target.x - current.x) * EASE;
    current.y += (target.y - current.y) * EASE;
    stage.style.setProperty("--tilt-x", `${current.x.toFixed(2)}deg`);
    stage.style.setProperty("--tilt-y", `${current.y.toFixed(2)}deg`);
    const moving = Math.abs(target.x - current.x) > SETTLED || Math.abs(target.y - current.y) > SETTLED;
    frame = moving ? requestAnimationFrame(step) : 0;
  };

  const aim = (x, y) => {
    target.x = x;
    target.y = y;
    if (!frame) frame = requestAnimationFrame(step);
  };

  // The stage's untransformed box, from its layout offset in the banner, so
  // the tilt itself doesn't move the hit area.
  const banner = stage.offsetParent;
  const box = () => {
    const rect = banner.getBoundingClientRect();
    return { left: rect.left + stage.offsetLeft, top: rect.top + stage.offsetTop, size: stage.offsetWidth };
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      const { left, top, size } = box();
      const u = (event.clientX - left) / size;
      const v = (event.clientY - top) / size;
      if (!overOval(u, v)) {
        aim(0, 0);
        return;
      }
      // -1 to 1 from the stage center; the side under the cursor recedes.
      const dx = (u - 0.5) * 2;
      const dy = (v - 0.5) * 2;
      aim(-dy * MAX_DEG, dx * MAX_DEG);
    },
    { passive: true }
  );

  document.documentElement.addEventListener("pointerleave", () => aim(0, 0));
}
