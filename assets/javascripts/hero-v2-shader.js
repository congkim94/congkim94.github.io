const canvas = document.getElementById("hero-v2-shader");
const hero = canvas && canvas.closest(".hero-v2");

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let shaderInstance = null;
let starting = false;
let hideBound = false;

function coverHero() {
  hero.classList.add("is-shader-cover");
}

function onPageHide() {
  // Drop the live canvas before the page is frozen, so coming back does not
  // restore a half-presented frame. The cover stays up until the next mount.
  hero.classList.remove("is-shader");
  coverHero();
  if (shaderInstance) {
    shaderInstance.destroy();
    shaderInstance = null;
  }
}

async function mount() {
  if (!canvas || !hero || !navigator.gpu || !motionOk || starting || shaderInstance) return;
  starting = true;
  coverHero();
  // Keep the canvas sized by CSS. Otherwise the shader snapshots the first
  // measured box and can lock a phone canvas to the default 300×150.
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  try {
    const { createShader } = await import("./shaders-js.js?v=2");
    const shader = await createShader(
      canvas,
      {
        components: [
          {
            type: "Godrays",
            id: "idmufzvsriksgy6t6dl",
            props: {
              center: { x: 0.78, y: -0.19 },
              density: 0.4,
              intensity: 1,
              speed: 1.6,
              spotty: 0.1,
              visible: false,
            },
          },
          {
            type: "MultiPointGradient",
            id: "idmufzsuusm8qapktap",
            props: {
              colorA: "#ffffff",
              colorB: "#d6d6d6",
              colorC: "#cfcfcf",
              colorD: "#e0e0e0",
              colorE: "#a9afb8",
              positionA: { x: 0.68, y: 0.34 },
              positionB: { x: 0.57, y: 0.68 },
              positionC: { x: 0.15, y: 0.16 },
              positionD: { x: 0.95, y: 0.45 },
              positionE: { x: 0.27, y: 0.54 },
            },
          },
          {
            type: "DisplacementMap",
            id: "idmufztfv2nbcx684o9",
            props: {
              amount: 1,
              angle: {
                mode: "loop",
                type: "auto-animate",
                speed: 0.1,
                easing: "linear",
                outputMax: 360,
                outputMin: 0,
              },
              channelMode: "directional",
              source: "idmufzvsriksgy6t6dl",
            },
          },
          {
            type: "ChromaticAberration",
            id: "idmv0yz8wl6q95zomyr",
            props: {
              strength: 0.12,
            },
          },
        ],
      },
      {
        toneMapping: "aces",
      }
    );

    shaderInstance = shader;
    if (!hideBound) {
      hideBound = true;
      window.addEventListener("pagehide", onPageHide);
    }

    // The shader resolves before it has presented a full frame. Chrome can
    // composite only the top of a WebGPU canvas on those first frames, so
    // keep the cover up until the bitmap matches the banner.
    let frames = 0;
    let stable = 0;
    const revealWhenDrawn = () => {
      frames += 1;
      const rect = canvas.getBoundingClientRect();
      const tallEnough = canvas.height > rect.height * 0.9;
      const wideEnough = canvas.width > rect.width * 0.9;
      stable = rect.height > 40 && tallEnough && wideEnough ? stable + 1 : 0;
      if ((frames < 8 || stable < 4) && frames < 120) {
        requestAnimationFrame(revealWhenDrawn);
        return;
      }
      hero.classList.add("is-shader");
    };
    requestAnimationFrame(revealWhenDrawn);
  } catch (error) {
    hero.classList.remove("is-shader-cover");
    console.warn("Hero shader unavailable.", error);
  } finally {
    starting = false;
  }
}

window.addEventListener("pageshow", function (event) {
  if (event.persisted) mount();
});

mount();
