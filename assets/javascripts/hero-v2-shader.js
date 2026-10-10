const canvas = document.getElementById("hero-v2-shader");
const hero = canvas && canvas.closest(".hero-v2");

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Firefox on phones exposes WebGPU, but its canvas ignores alpha and the
// rays composite wrong. Chrome is fine. Keep the still on those phones.
const ua = navigator.userAgent || "";
const firefoxMobile = /Firefox|FxiOS/i.test(ua) && /Mobile|Android|iPhone|iPad|iPod/i.test(ua);

if (canvas && hero && navigator.gpu && motionOk && !firefoxMobile) {
  // Keep the canvas sized by CSS. Otherwise the shader snapshots the first
  // measured box and can lock a phone canvas to the default 300×150.
  canvas.style.width = "100%";
  canvas.style.height = "calc(100% + 40px)";
  const { createShader } = await import("./shaders-js.js?v=2");

  try {
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
        ],
      },
      {
        toneMapping: "aces",
      }
    );

    hero.classList.add("is-shader");

    window.addEventListener("pagehide", function () {
      shader.destroy();
    });
  } catch (error) {
    console.warn("Hero shader unavailable.", error);
  }
}
