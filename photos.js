const PHOTOS = [
  {
    src: "photos/cygnus.jpg",
    title: "Cygnus wide field",
    meta: "June 2026 · New Haven, CT · Canon EOS 70D (astro-modified) · 4020 s total",
    desc: "A wide-field view of Cygnus along the summer Milky Way, taking in the North America and Pelican Nebulae, the glowing Sadr region, and the faint arcs of the Veil Nebula, the remnant of a supernova that exploded thousands of years ago. Shot from New Haven with an astro-modified Canon EOS 70D and a dual narrowband filter, through a Canon EF 24-70mm f/2.8L II USM at f/2.8, ISO 1250, with 4020 s of total exposure."
  },
  {
    src: "photos/m51.jpg",
    title: "M51 · Whirlpool Galaxy",
    meta: "May 2026 · Baltimore, MD · Canon EOS 70D (astro-modified) · 1920 s total",
    desc: "The Whirlpool Galaxy M51 and its companion NGC 5195 in Canes Venatici, some 30 million light-years away. The pair is a textbook interacting system: a close passage of the smaller galaxy stirred up the Whirlpool's grand-design spiral, and one arm appears to bridge across to the companion, which is actually passing behind the disk. This was also the first object in which spiral structure was ever recognized, sketched by Lord Rosse in 1845 with his 72-inch reflector. Captured from Baltimore with an astro-modified Canon EOS 70D and a Canon EF 70-300mm f/4-5.6L IS USM at f/5.6, ISO 640, with 1920 s of total exposure."
  },
  {
    src: "photos/comet_a3.jpg",
    title: "C/2023 A3 · Comet Tsuchinshan-ATLAS",
    meta: "October 2024 · Baltimore, MD · Canon EOS 5D Mark IV · f/2.8 · ISO 320 · 2.5 s",
    desc: "Comet C/2023 A3 (Tsuchinshan-ATLAS) in the evening sky of mid-October 2024, days after its closest approach to Earth. The broad plume sweeping away from the Sun is the dust tail, grains released from the nucleus and pushed outward by sunlight. The thin spike extending in the opposite direction is an antitail: not a real second tail, but a perspective effect that appeared for a few days around October 14, when Earth crossed the comet's orbital plane and saw its spread-out dust sheet edge-on. The comet is named for its independent discoverers, China's Purple Mountain (Zijinshan) Observatory and the ATLAS survey. Shot from Baltimore with a Canon EOS 5D Mark IV and a Canon EF 24-70mm f/2.8L II USM at f/2.8, ISO 320, 2.5 s."
  },
  {
    src: "photos/eclipse2024.jpg",
    pos: "50% 20%",
    title: "Total solar eclipse sequence",
    meta: "April 2024 · Shalersville, OH · Canon EOS 5D Mark IV · 35 frames",
    desc: "The April 8, 2024 total solar eclipse over Shalersville, Ohio: a composite of 35 frames following the Sun from first contact, through totality, to last contact as it slid down the afternoon sky. The partial phases were shot at f/3.5, ISO 800, 1/50 s through a Baader solar film filter; the central totality frame, with the corona showing, was taken unfiltered at f/3.5, ISO 1000, 1/50 s. Canon EOS 5D Mark IV with a Canon EF 16-35mm f/2.8L II USM."
  },
  {
    src: "photos/eclipse2024_closeup.jpg",
    title: "Diamond ring and Baily's beads",
    meta: "April 2024 · Shalersville, OH · Nikon Z 8 · f/8 · ISO 400 · 1/2000 s",
    desc: "The same eclipse up close, at the edge of totality. The brilliant flash is the diamond ring: the last rays of photosphere shining through valleys on the lunar limb, which break up into the beads named after Francis Baily. The pearly glow around the black lunar disk is the corona, the Sun's outer atmosphere at over a million kelvin, and the pink features hugging the limb are prominences, loops of cooler chromospheric plasma held aloft by magnetic fields and glowing in the light of hydrogen. Nikon Z 8 with a Sigma 150-600mm F5-6.3 DG OS HSM."
  },
  {
    src: "photos/annular2023.jpg",
    title: "Ring of fire",
    meta: "October 2023 · San Antonio, TX · Canon EOS 5D Mark IV · f/8 · ISO 100 · 1/2000 s",
    desc: "The annular solar eclipse of October 14, 2023. An annular eclipse happens when the Moon passes directly in front of the Sun while near the far point of its orbit: its disk appears slightly too small to cover the photosphere, leaving an unbroken ring of sunlight. Because that ring stays blindingly bright, the sky never darkens and the entire event must be shot through a solar filter, here a NiSi ND100000 that cuts the light by nearly 17 stops. Canon EOS 5D Mark IV with a Sigma 150-600mm F5-6.3 DG OS HSM."
  },
  {
    src: "photos/m45-pleiades.jpg",
    title: "M45 · The Pleiades",
    meta: "October 2023 · Baltimore, MD · Canon EOS 6D",
    captionHtml: "M45 · The Pleiades · October 2023 · Baltimore, MD · <a class=\"egg\" href=\"egg.html\">Canon EOS 6D</a>",
    desc: "A close-up of the northern Pleiades. The three brilliant blue stars are <strong>Maia</strong> (wrapped in its reflection nebula, NGC 1432), together with <strong>Taygeta</strong> and <strong>Celaeno</strong>. All three are hot B-type stars lighting up the dust cloud the cluster is currently drifting through. Shot from the Maryland Space Grant Observatory with the <a href=\"https://md.spacegrant.org/observatory-open-house/morris-w-offit-telescope/\" target=\"_blank\" rel=\"noopener\">Morris W. Offit Telescope</a> and a Canon EOS 6D, together with <a href=\"https://www.gavin-wang.com\" target=\"_blank\" rel=\"noopener\">Gavin Wang</a>."
  }
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");
const lbCap = document.getElementById("lb-caption");

for (const p of PHOTOS) {
  const row = document.createElement("article");
  row.className = "photo-row reveal";
  row.innerHTML = `<div class="photo-frame"><img src="${p.src}" alt="${p.title}" loading="lazy"${p.pos ? ` style="object-position:${p.pos}"` : ""}><div class="shot-ph"><span>${p.title}</span><em>image not found · add ${p.src}</em></div></div><div class="photo-info"><h3>${p.title}</h3><p class="photo-meta">${p.meta}</p><p class="photo-desc">${p.desc}</p></div>`;
  const img = row.querySelector("img");
  img.addEventListener("error", () => row.classList.add("missing"));
  img.addEventListener("click", () => {
    lbImg.src = p.src;
    lbCap.innerHTML = p.captionHtml || `${p.title} · ${p.meta}`;
    lightbox.classList.add("open");
  });
  gallery.appendChild(row);
  if (window.revealObserver) window.revealObserver.observe(row);
  else row.classList.add("in");
}

document.getElementById("lb-close").addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.classList.remove("open"); });
addEventListener("keydown", e => { if (e.key === "Escape") lightbox.classList.remove("open"); });
