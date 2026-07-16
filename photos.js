const PHOTOS = [
  { src: "photos/m31.jpg", title: "M31 — Andromeda Galaxy", meta: "2025-10 · your telescope · total exposure" },
  { src: "photos/m42.jpg", title: "M42 — Orion Nebula", meta: "2025-12 · your telescope · total exposure" },
  { src: "photos/mw_core.jpg", title: "Milky Way core", meta: "2025-07 · your camera + lens · location" },
  { src: "photos/m45.jpg", title: "M45 — Pleiades", meta: "2025-11 · your telescope · total exposure" },
  { src: "photos/rho_oph.jpg", title: "Rho Ophiuchi cloud complex", meta: "2025-06 · your camera + lens · location" },
  { src: "photos/horsehead.jpg", title: "Horsehead & Flame Nebulae", meta: "2026-01 · your telescope · total exposure" }
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
const lbCap = document.getElementById("lb-caption");

for (const p of PHOTOS) {
  const fig = document.createElement("figure");
  fig.className = "shot";
  fig.innerHTML = `<div class="shot-frame"><img src="${p.src}" alt="${p.title}" loading="lazy"><div class="shot-ph"><span>${p.title}</span><em>image not found — add ${p.src}</em></div></div><figcaption><strong>${p.title}</strong><span>${p.meta}</span></figcaption>`;
  const img = fig.querySelector("img");
  img.addEventListener("error", () => fig.classList.add("missing"));
  img.addEventListener("click", () => {
    lbImg.src = p.src;
    lbCap.textContent = `${p.title} — ${p.meta}`;
    lightbox.classList.add("open");
  });
  gallery.appendChild(fig);
}

document.getElementById("lb-close").addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.classList.remove("open"); });
addEventListener("keydown", e => { if (e.key === "Escape") lightbox.classList.remove("open"); });
