const page = document.querySelector(".gate-page");
const canvas = document.getElementById("gate-oval-shader");

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Watercolor on Paper 3 needs WebGPU. Without it, the still oval stays.
if (page && canvas && navigator.gpu && motionOk) {
	canvas.style.width = "100%";
	canvas.style.height = "100%";

	try {
		const { createShader } = await import("./shaders-js.js?v=2");
		const shader = await createShader(canvas, {
			components: [
				{
					type: "MultiPointGradient",
					id: "idmnj829dad4e2znhfh",
					props: {
						colorA: "#fae7de",
						colorB: "#ebdcd3",
						colorC: "#e1ccf0",
						colorD: "#b4c2ed",
						colorE: "#bdd0f0",
						positionA: { x: 0.24, y: 0.08 },
						positionB: { x: 0.53, y: 0.09 },
						positionC: { x: 0.3, y: 0.67 },
						positionD: { x: 0.83, y: 0.86 },
						positionE: { x: 0.82, y: 0.33 },
						smoothness: 2.1,
					},
				},
				{
					type: "WaveDistortion",
					id: "idmnj82qycixav782fm",
					props: {
						angle: 196,
						frequency: 0.8,
						strength: 0.45,
						speed: 1.5,
					},
				},
				{
					type: "Liquify",
					id: "idmnj8439jww4padfya",
					props: {
						damping: 0.7,
						radius: 1.5,
						stiffness: 15,
					},
				},
				{
					type: "Paper",
					id: "idmnj83b5954tzc41gk",
					props: {
						displacement: 1,
						grainScale: 0.1,
						roughness: 0.1,
						seed: 26,
					},
				},
				{
					type: "FilmGrain",
					id: "idmnj835n6dmajlns09",
					props: {
						strength: 0.4,
					},
				},
			],
		});

		let frames = 0;
		const revealWhenDrawn = () => {
			frames += 1;
			if (frames < 3) {
				requestAnimationFrame(revealWhenDrawn);
				return;
			}
			page.classList.add("is-shader");
		};
		requestAnimationFrame(revealWhenDrawn);

		window.addEventListener("pagehide", function () {
			shader.destroy();
		});
	} catch (error) {
		console.warn("Password oval shader unavailable.", error);
	}
}
