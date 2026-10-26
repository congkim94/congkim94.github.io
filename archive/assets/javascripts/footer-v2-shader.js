const canvas = document.getElementById("footer-v2-shader");
const footer = canvas && canvas.closest(".footer-v2");

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && footer && navigator.gpu && motionOk) {
  const { createShader } = await import("./shaders-js.js");

  const restCenter = { x: 0.5, y: 0.5 };
  const mouseCenter = {
    type: "mouse-position",
    originX: 0.5,
    originY: 0.5,
    smoothing: 0.3,
  };
  const lensMouseCenter = {
    type: "mouse-position",
    originX: 0.5,
    originY: 0.5,
    momentum: 0.1,
    smoothing: 0.3,
  };

  try {
    const shader = await createShader(canvas, {
      components: [
        {
          type: "Circle",
          id: "idmswndtu31k0ijducg",
          props: {
            center: restCenter,
            radius: 2,
            softness: 1,
            visible: false,
          },
        },
        {
          type: "ImageTexture",
          id: "idmswmikkdh68i7wwni",
          props: {
            blendMode: "luminosity",
            url: "/assets/images/home-v2/prime-lens.jpg",
            visible: true,
          },
        },
        {
          type: "BokehBlur",
          id: "idmswndp0zcb3g0r9yg",
          props: {
            highlightGain: 9.1,
            highlightThreshold: 0.28,
            radius: {
              type: "map",
              source: "idmswndtu31k0ijducg",
              channel: "alphaInverted",
              inputMax: 1,
              inputMin: 0,
              outputMax: 29,
              outputMin: 0,
            },
          },
        },
        {
          type: "LensDistortion",
          id: "idmswmitb7pbx9juqhs",
          props: {
            center: restCenter,
            focusCenter: 1,
            lensBulge: -0.1,
            spread: 0.26,
            swirl: 0.09,
          },
        },
        {
          type: "Grayscale",
          id: "idmuzrejf6i06sjhykz",
        },
      ],
    });

    footer.classList.add("is-shader");

    footer.addEventListener("pointerenter", function () {
      shader.update("idmswndtu31k0ijducg", { center: mouseCenter });
      shader.update("idmswmitb7pbx9juqhs", { center: lensMouseCenter });
    });

    footer.addEventListener("pointerleave", function () {
      shader.update("idmswndtu31k0ijducg", { center: restCenter });
      shader.update("idmswmitb7pbx9juqhs", { center: restCenter });
    });

    window.addEventListener("pagehide", function () {
      shader.destroy();
    });
  } catch (error) {
    console.warn("Footer shader unavailable.", error);
  }
}
