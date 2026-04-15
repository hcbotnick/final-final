const TOTAL = 13181818;
const PER_ICON = 1000;
const COUNT = Math.ceil(TOTAL / PER_ICON);

const inner = document.getElementById('inner');
const track = document.getElementById('track');
const btn = document.getElementById('btn');
const cntEl = document.getElementById('cnt');
const pctEl = document.getElementById('pct');
const finale = document.getElementById('finale');
const spdBtns = document.querySelectorAll('.spd-btn');
const spdLabel = document.getElementById('spd-label');

function treeSVG(color, opacity) {
  const dark = color === '#3B6D11' ? '#1a4a06'
             : color === '#639922' ? '#3B6D11'
             : '#639922';
  return `<svg width="18" height="24" viewBox="0 0 18 24" style="display:block;opacity:${opacity}">
    <polygon points="9,1 17,13 1,13" fill="${color}"/>
    <polygon points="9,6 16,17 2,17" fill="${dark}"/>
    <rect x="7.5" y="17" width="3" height="6" rx="1" fill="#633806"/>
  </svg>`;
}

const frag = document.createDocumentFragment();

for (let i = 0; i < COUNT; i++) {
  const pct = i / COUNT;
  const color = pct < 0.33 ? '#3B6D11'
              : pct < 0.66 ? '#639922'
              : '#97C459';
  const op = (0.5 + Math.sin(i * 0.7) * 0.25 + Math.cos(i * 1.9) * 0.15).toFixed(2);
  const span = document.createElement('span');
  span.className = 'tree-icon';
  span.innerHTML = treeSVG(color, Math.max(0.35, Math.min(1, op)));
  frag.appendChild(span);
}

const endcard = document.createElement('div');
endcard.id = 'endcard';
endcard.innerHTML = `
  <div style="text-align:center">
    <div class="big">13,181,818</div>
    <div class="lbl">trees needed every year</div>
  </div>`;
frag.appendChild(endcard);
inner.appendChild(frag);

let raf, speed = 1.5, running = false, done = false;

function tick() {
  const max = track.scrollWidth - track.clientWidth;
  if (track.scrollLeft >= max - 1) {
    done = true;
    running = false;
    btn.textContent = '↺ Start over';
    finale.style.display = 'block';
    update();
    return;
  }
  track.scrollLeft += speed;
  update();
  raf = requestAnimationFrame(tick);
}

function update() {
  const max = track.scrollWidth - track.clientWidth;
  const p = max > 0 ? track.scrollLeft / max : 0;
  const trees = Math.min(Math.round(p * COUNT) * PER_ICON, TOTAL);
  cntEl.textContent = trees.toLocaleString('en-US');
  pctEl.textContent = (p * 100).toFixed(1) + '%';
}

track.addEventListener('scroll', update);

btn.addEventListener('click', () => {
  if (done) {
    track.scrollLeft = 0;
    done = false;
    running = false;
    finale.style.display = 'none';
    btn.textContent = '▶ Auto-scroll';
    spdBtns.forEach(b => b.style.display = 'none');
    spdLabel.style.display = 'none';
    update();
    return;
  }
  if (running) {
    cancelAnimationFrame(raf);
    running = false;
    btn.textContent = '▶ Auto-scroll';
    spdBtns.forEach(b => b.style.display = 'none');
    spdLabel.style.display = 'none';
  } else {
    running = true;
    btn.textContent = '⏸ Pause';
    spdBtns.forEach(b => b.style.display = '');
    spdLabel.style.display = '';
    raf = requestAnimationFrame(tick);
  }
});

spdBtns.forEach(b => {
  b.addEventListener('click', () => {
    speed = parseFloat(b.dataset.s);
  });
});