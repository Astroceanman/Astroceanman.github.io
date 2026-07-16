const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

const SKY_SRC = { x: 140, y: 330, w: 3720, h: 1858 };
const skyImg = new Image();
let skyReady = false;
skyImg.onload = () => { skyReady = true; build(); };
skyImg.src = "assets/gaia_allsky.jpg";

const BRIGHT = [
  [227.2, -8.9, -1.46, 0.00], [261.2, -25.3, -0.74, 0.15], [315.7, -0.7, -0.27, 0.71],
  [15.2, 69.1, -0.05, 1.23], [67.4, 19.2, 0.03, 0.00], [162.6, 4.6, 0.08, 0.80],
  [209.2, -25.2, 0.13, -0.03], [213.7, 13.0, 0.34, 0.42], [290.8, -58.8, 0.46, -0.16],
  [199.8, -9.0, 0.50, 1.85], [311.8, 1.2, 0.61, -0.23], [47.7, -8.9, 0.77, 0.22],
  [300.1, -0.4, 0.76, -0.24], [181.0, -20.2, 0.85, 1.54], [351.9, 15.1, 0.96, 1.83],
  [316.1, 50.8, 0.97, -0.24], [192.2, 23.4, 1.14, 1.00], [20.5, -64.9, 1.16, 0.09],
  [84.3, 2.0, 1.25, 0.09], [302.5, 3.2, 1.25, -0.24]
];

const COLOR_STOPS = [
  [-0.6, 155, 180, 255], [0.0, 202, 216, 255], [0.6, 248, 247, 255],
  [1.0, 255, 244, 234], [1.6, 255, 224, 188], [2.5, 255, 196, 142], [4.0, 255, 160, 100]
];

function starColor(c) {
  if (c <= COLOR_STOPS[0][0]) return COLOR_STOPS[0].slice(1);
  for (let i = 1; i < COLOR_STOPS.length; i++) {
    if (c <= COLOR_STOPS[i][0]) {
      const [c0, ...a] = COLOR_STOPS[i - 1];
      const [c1, ...b] = COLOR_STOPS[i];
      const t = (c - c0) / (c1 - c0);
      return a.map((v, k) => Math.round(v + t * (b[k] - v)));
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1].slice(1);
}

const D2R = Math.PI / 180;
let W, H, CX, CY, SX, SY, staticLayer, animStars = [], meteors = [];

function project(l, b) {
  const lam = -((l + 180) % 360 - 180) * D2R;
  const phi = b * D2R;
  const z = Math.sqrt(1 + Math.cos(phi) * Math.cos(lam / 2));
  return [CX + (Math.cos(phi) * Math.sin(lam / 2) / z) * SX, CY - (Math.sin(phi) / z) * SY];
}

function starRadius(m) { return 0.4 + 2.6 * Math.pow(10, -0.18 * m); }
function starAlpha(m) { return Math.min(1, 1.25 * Math.pow(10, -0.09 * m)); }

function build() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
  CX = W / 2; CY = H / 2;
  SX = Math.sqrt((W / 2) * (W / 2) + (H / 2 + 250) * (H / 2 + 250) * 4) * 1.02;
  SY = SX / 2;

  staticLayer = document.createElement("canvas");
  staticLayer.width = W; staticLayer.height = H + 300;
  const g = staticLayer.getContext("2d");
  g.fillStyle = "#04060e";
  g.fillRect(0, 0, W, H + 300);

  if (skyReady) {
    g.drawImage(skyImg, SKY_SRC.x, SKY_SRC.y, SKY_SRC.w, SKY_SRC.h, CX - SX, CY - SY, SX * 2, SY * 2);
    g.fillStyle = "rgba(4,6,14,0.42)";
    g.fillRect(0, 0, W, H + 300);
    const veil = g.createLinearGradient(0, 0, 0, H);
    veil.addColorStop(0, "rgba(4,6,14,0.5)");
    veil.addColorStop(0.25, "rgba(4,6,14,0)");
    veil.addColorStop(1, "rgba(4,6,14,0.25)");
    g.fillStyle = veil;
    g.fillRect(0, 0, W, H + 300);
  }

  animStars = [];
  const all = GAIA.concat(BRIGHT);
  for (const [l, b, m, c] of all) {
    const [x, y] = project(l, b);
    if (x < -20 || x > W + 20 || y < -20 || y > H + 320) continue;
    const [r, gr, bl] = starColor(c);
    const rad = starRadius(m);
    const alpha = starAlpha(m);
    if (m >= 5.2) {
      g.globalAlpha = alpha * 0.9;
      g.fillStyle = `rgb(${r},${gr},${bl})`;
      g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
    } else {
      animStars.push({ x, y, rad, alpha, col: `${r},${gr},${bl}`, ph: Math.random() * Math.PI * 2, spd: 0.4 + Math.random() * 1.2 });
    }
  }
  g.globalAlpha = 1;
}

function spawnMeteor() {
  const x = Math.random() * W * 0.8 + W * 0.1;
  const y = Math.random() * H * 0.35;
  const a = Math.PI * (0.65 + Math.random() * 0.2);
  meteors.push({ x, y, vx: Math.cos(a) * 9, vy: Math.sin(a) * 9, life: 1 });
}

let scrollY = 0;
addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
addEventListener("resize", build);

function frame(t) {
  const time = t / 1000;
  const dy = -Math.min(250, scrollY * 0.05);
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(staticLayer, 0, dy);

  for (const s of animStars) {
    const tw = 0.82 + 0.18 * Math.sin(time * s.spd + s.ph);
    ctx.globalAlpha = s.alpha * tw;
    ctx.fillStyle = `rgb(${s.col})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y + dy, s.rad, 0, Math.PI * 2);
    ctx.fill();
    if (s.rad > 1.5) {
      ctx.globalAlpha = s.alpha * tw * 0.14;
      ctx.beginPath();
      ctx.arc(s.x, s.y + dy, s.rad * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (Math.random() < 0.0025 && meteors.length < 2) spawnMeteor();
  for (const m of meteors) {
    const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 10, m.y - m.vy * 10);
    grad.addColorStop(0, `rgba(220,235,255,${0.85 * m.life})`);
    grad.addColorStop(1, "rgba(220,235,255,0)");
    ctx.globalAlpha = 1;
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.vx * 10, m.y - m.vy * 10);
    ctx.stroke();
    m.x += m.vx;
    m.y += m.vy;
    m.life -= 0.012;
  }
  meteors = meteors.filter(m => m.life > 0 && m.x > -100 && m.y < H + 100);

  ctx.globalAlpha = 1;
  requestAnimationFrame(frame);
}

build();
requestAnimationFrame(frame);

const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) e.target.classList.add("in");
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => io.observe(el));
