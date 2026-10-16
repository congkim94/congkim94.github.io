const canvas = document.getElementById("hero-v2-shader");
const hero = canvas && canvas.closest(".hero-v2");

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Browsers without WebGL2 keep the flat page colour.
if (canvas && hero && motionOk) {
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  try {
    const { mountAfternoonSunlight } = await import("./afternoon-sunlight-2.js");
    const sunlight = mountAfternoonSunlight(canvas, { preset: 2 });

    // Optional light placement: data-light-center="x y" (0 to 1 from the
    // top-left), data-light-size (radius in canvas heights), and
    // data-noise-scale (higher packs in more, finer streaks).
    const { lightCenter, lightSize, noiseScale } = canvas.dataset;
    if (lightCenter || lightSize || noiseScale) {
      const preset = { ...sunlight.renderer.preset };
      if (lightCenter) preset.maskCenter = lightCenter.split(" ").map(Number);
      if (lightSize) preset.maskSize = Number(lightSize);
      if (noiseScale) preset.noiseScale = Number(noiseScale);
      sunlight.setPreset(preset);
    }

    // Stay hidden through the sentence reveal. A return from a project has
    // already dropped the lock, so only the first frames are held back.
    let frames = 0;
    const revealWhenDrawn = () => {
      frames += 1;
      if (frames < 3 || document.body.classList.contains("is-intro-locked")) {
        requestAnimationFrame(revealWhenDrawn);
        return;
      }
      hero.classList.add("is-shader");
    };
    requestAnimationFrame(revealWhenDrawn);

    window.addEventListener("pagehide", function () {
      sunlight.destroy();
    });
  } catch (error) {
    console.warn("Hero shader unavailable.", error);
  }
}
