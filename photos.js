const PHOTOS = [
  {
    src: "photos/cygnus.jpg",
    title: "Cygnus wide field",
    meta: "June 2026 · New Haven · Canon EOS 70D (astro-modified) · 4020 s total",
    desc: "A wide-field view of Cygnus along the summer Milky Way, taking in the North America and Pelican Nebulae, the glowing Sadr region, and the faint arcs of the Veil Nebula. Shot from New Haven with an astro-modified Canon EOS 70D and a dual narrowband filter, through a Canon EF 24-70mm f/2.8L II USM at f/2.8, ISO 1250, with 4020 s of total exposure."
  },
  {
    src: "photos/m31.jpg",
    title: "M31 · Andromeda Galaxy",
    meta: "2025-10 · your telescope · total exposure",
    desc: "Write a few sentences about this image: where you shot it, the conditions that night, what drew you to the target, or what it took to process. This block can comfortably hold three or four lines."
  },
  {
    src: "photos/m42.jpg",
    title: "M42 · Orion Nebula",
    meta: "2025-12 · your telescope · total exposure",
    desc: "Description goes here."
  },
  {
    src: "photos/mw_core.jpg",
    title: "Milky Way core",
    meta: "2025-07 · your camera + lens · location",
    desc: "Description goes here."
  },
  {
    src: "photos/m45-pleiades.jpg",
    title: "M45 · The Pleiades",
    meta: "October 2023 · Canon EOS 6D",
    desc: "A close-up of the northern Pleiades. The three brilliant blue stars are <strong>Maia</strong> (wrapped in its reflection nebula, NGC 1432), together with <strong>Taygeta</strong> and <strong>Celaeno</strong>. All three are hot B-type stars lighting up the dust cloud the cluster is currently drifting through. Shot from the Maryland Space Grant Observatory with the <a href=\"https://md.spacegrant.org/observatory-open-house/morris-w-offit-telescope/\" target=\"_blank\" rel=\"noopener\">Morris W. Offit Telescope</a> and a Canon EOS 6D, together with <a href=\"https://www.gavin-wang.com\" target=\"_blank\" rel=\"noopener\">Gavin Wang</a>."
  },
  {
    src: "photos/rho_oph.jpg",
    title: "Rho Ophiuchi cloud complex",
    meta: "2025-06 · your camera + lens · location",
    desc: "Description goes here."
  },
  {
    src: "photos/horsehead.jpg",
    title: "Horsehead & Flame Nebulae",
    meta: "2026-01 · your telescope · total exposure",
    desc: "Description goes here."
  }
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
const lbCap = document.getElementById("lb-caption");

for (const p of PHOTOS) {
  const row = document.createElement("article");
  row.className = "photo-row reveal";
  row.innerHTML = `<div class="photo-frame"><img src="${p.src}" alt="${p.title}" loading="lazy"><span class="photo-credit">© Zhibin You</span><div class="shot-ph"><span>${p.title}</span><em>image not found · add ${p.src}</em></div></div><div class="photo-info"><h3>${p.title}</h3><p class="photo-meta">${p.meta}</p><p class="photo-desc">${p.desc}</p></div>`;
  const img = row.querySelector("img");
  img.addEventListener("error", () => row.classList.add("missing"));
  img.addEventListener("click", () => {
    lbImg.src = p.src;
    lbCap.textContent = `${p.title} · ${p.meta}`;
    lightbox.classList.add("open");
  });
  gallery.appendChild(row);
  if (window.revealObserver) window.revealObserver.observe(row);
  else row.classList.add("in");
}

document.getElementById("lb-close").addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.classList.remove("open"); });
addEventListener("keydown", e => { if (e.key === "Escape") lightbox.classList.remove("open"); });
