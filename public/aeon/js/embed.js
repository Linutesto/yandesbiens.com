// embed.js — boots the real AEON renderer against the static replay shim.
import { initWorld, setOverlay, setCameraMode } from "./RendererApp.js";
import { connect } from "../ws.js";

const canvas = document.getElementById("world");
const loading = document.getElementById("loading");

try {
  await connect();          // seed world layers + start the motion loop
  await initWorld(canvas);  // the genuine omega renderer
  loading?.classList.add("gone");
} catch (e) {
  console.error("AEON embed failed:", e);
  if (loading) loading.textContent = "⚠ world failed to load";
}

// map-data overlays
document.querySelectorAll("[data-overlay]").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-overlay]").forEach((x) =>
      x.classList.toggle("active", x === b));
    setOverlay(b.dataset.overlay);
  }));

// camera modes
document.querySelectorAll("[data-cam]").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-cam]").forEach((x) =>
      x.classList.toggle("active", x === b));
    setCameraMode(b.dataset.cam, () => {});
  }));
