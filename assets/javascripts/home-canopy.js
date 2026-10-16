const canvas = document.getElementById("home-canopy-shader");

// The canopy scene keeps a clear band above the first leaves. Size the frame
// so those leaves, not the empty band, stop just short of the project cards.
const LEAF_GAP = 24;
const FRAME_TOP = 0.3;
const SCALE = 0.68;

function placeCanopy(target) {
  const work = document.querySelector(".work-v2");
  const footer = document.querySelector(".footer-v2");
  if (!work || !footer) return;

  // Use the footer edge, not the document height. During the intro the page
  // is locked to the viewport, which would otherwise shrink this measurement.
  const workBottom = work.getBoundingClientRect().bottom + window.scrollY;
  const pageBottom = footer.getBoundingClientRect().bottom + window.scrollY;
  const reach = Math.max(280, pageBottom - workBottom - LEAF_GAP);
  const height = Math.round((reach / (1 - FRAME_TOP)) * SCALE);
  // Keep the shader's widescreen frame so the leaves scale with the page
  // instead of sinking to the bottom of a tall, narrow canvas.
  const width = Math.round(height * (16 / 9));

  target.style.width = width + "px";
  target.style.height = height + "px";
}

if (canvas) {
  placeCanopy(canvas);

  const { mountCanopyShadow } = await import("./canopy-shadow.js");
  mountCanopyShadow(canvas);

  const refresh = () => placeCanopy(canvas);
  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh);
  if (document.fonts) document.fonts.ready.then(refresh);

  const work = document.querySelector(".work-v2");
  const footer = document.querySelector(".footer-v2");
  if (work && typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(refresh);
    observer.observe(work);
    if (footer) observer.observe(footer);
  }
}
