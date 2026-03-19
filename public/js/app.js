// ══════════════════════════════════════════
// NEW CHỢ — Frontend Application
// ══════════════════════════════════════════

const API = '';
let CATS = [];
let currentCat = '';
let currentView = 'list';

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
function fmt(p) { return '$' + Number(p).toFixed(2); }

// ── Fetch helpers ─────────────────────
async function api(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

// ── Load all data ─────────────────────
async function init() {
  try {
    const [products, arrivals, specials, services, household, settings] = await Promise.all([
      api('/api/products'),
      api('/api/new-arrivals'),
      api('/api/specials'),
      api('/api/services'),
      api('/api/household'),
      api('/api/settings'),
    ]);

    CATS = products;
    if (CATS.length) currentCat = CATS[0].id;

    renderSettings(settings);
    buildTabs();
    renderProducts();
    renderArrivals(arrivals);
    renderSpecials(specials);
    renderServices(services);
    renderHousehold(household);
    buildTicker(products);
    initReveal();
  } catch (err) {
    console.error('Init error:', err);
    document.getElementById('prod-panel').innerHTML =
      '<div class="prod-empty"><span>⚠️</span>Không thể tải dữ liệu. Vui lòng thử lại sau.</div>';
  }
}

// ── Settings / Contact ────────────────
function renderSettings(s) {
  if (!s || !Object.keys(s).length) {
    s = {
      topbar_text: 'Open 7 Days · Mon–Fri 9am–6:30pm | Sat–Sun 9am–6pm · 📞 0480 179 941',
      phone: '0480 179 941', email: 'info@newcho.com.au',
      website: 'www.newcho.com.au', facebook: 'facebook.com/newcho',
      address_line1: 'The Avenue Shopping Centre',
      address_line2: 'Shop 9 – 136 The Avenue',
      address_line3: 'Sunshine West VIC 3020',
      hours_mon_fri: '9:00am – 6:30pm', hours_sat: '9:00am – 6:00pm', hours_sun: '9:00am – 6:00pm',
      maps_url: 'https://maps.google.com/?q=136+The+Avenue+Sunshine+West+VIC+3020',
      hero_title: 'Fresh.', hero_title_em: 'Asian. Local.',
      hero_subtitle: "Everything from vibrant produce and pantry staples to hot coffee and everyday services — all under one roof at NEW CHỢ, Sunshine West.",
    };
  }

  const tb = document.getElementById('topbar-text');
  if (tb) tb.innerHTML = '🌿 <b>' + esc(s.topbar_text || '') + '</b>';

  const ht = document.getElementById('hero-title');
  if (ht && s.hero_title) ht.innerHTML = esc(s.hero_title) + '<em>' + esc(s.hero_title_em || '') + '</em>';

  const hs = document.getElementById('hero-subtitle');
  if (hs && s.hero_subtitle) hs.textContent = s.hero_subtitle;

  const ci = document.getElementById('contact-info');
  if (ci) {
    ci.innerHTML = `
      <h3>Store Information</h3>
      <div class="irow"><div class="iicon">📍</div><div><div class="ilabel">Address</div><div class="ival">${esc(s.address_line1 || '')}<br>${esc(s.address_line2 || '')}<br>${esc(s.address_line3 || '')}</div></div></div>
      <div class="irow"><div class="iicon">📞</div><div><div class="ilabel">Phone</div><div class="ival"><a href="tel:${esc(s.phone || '')}">${esc(s.phone || '')}</a></div></div></div>
      <div class="irow"><div class="iicon">✉️</div><div><div class="ilabel">Email</div><div class="ival"><a href="mailto:${esc(s.email || '')}">${esc(s.email || '')}</a></div></div></div>
      <div class="irow"><div class="iicon">🌐</div><div><div class="ilabel">Website</div><div class="ival"><a href="https://${esc(s.website || '')}" target="_blank">${esc(s.website || '')}</a></div></div></div>
      <div class="irow"><div class="iicon">📘</div><div><div class="ilabel">Facebook</div><div class="ival"><a href="https://${esc(s.facebook || '')}" target="_blank">${esc(s.facebook || '')}</a></div></div></div>
      <div class="irow" style="border:none"><div class="iicon">🕐</div><div style="flex:1"><div class="ilabel">Opening Hours</div>
        <table class="hours-t">
          <tr><td>Monday</td><td>${esc(s.hours_mon_fri || '')}</td></tr>
          <tr><td>Tuesday</td><td>${esc(s.hours_mon_fri || '')}</td></tr>
          <tr><td>Wednesday</td><td>${esc(s.hours_mon_fri || '')}</td></tr>
          <tr><td>Thursday</td><td>${esc(s.hours_mon_fri || '')}</td></tr>
          <tr><td>Friday</td><td>${esc(s.hours_mon_fri || '')}</td></tr>
          <tr><td>Saturday</td><td>${esc(s.hours_sat || '')}</td></tr>
          <tr><td>Sunday</td><td>${esc(s.hours_sun || '')}</td></tr>
        </table>
      </div></div>`;
  }

  const mb = document.getElementById('map-box');
  if (mb) {
    mb.innerHTML = `
      <div class="mi">🗺️</div>
      <div style="font-weight:800;font-size:1rem">Find Us on Google Maps</div>
      <p style="color:var(--muted);font-size:.8rem;font-weight:400;line-height:1.6;margin-top:.5rem">${esc(s.address_line1 || '')}<br>${esc(s.address_line2 || '')}<br>${esc(s.address_line3 || '')}</p>
      <a href="${esc(s.maps_url || '#')}" target="_blank" class="btn btn-green" style="margin-top:1rem;font-size:.78rem">Open in Maps</a>`;
  }
}

// ── Product tabs ──────────────────────
function buildTabs() {
  const el = document.getElementById('cat-tabs');
  if (!el) return;
  el.innerHTML = CATS.map(c =>
    `<button class="ct${c.id === currentCat ? ' active' : ''}" data-cat="${esc(c.id)}">${esc(c.label)}</button>`
  ).join('');
  el.querySelectorAll('.ct').forEach(btn => {
    btn.addEventListener('click', () => setCat(btn.dataset.cat));
  });
}

function setCat(id) {
  currentCat = id;
  document.getElementById('prod-search').value = '';
  document.getElementById('prod-sort').value = 'default';
  buildTabs();
  renderProducts();
}

// ── View toggle ───────────────────────
document.getElementById('vbtn-list').addEventListener('click', () => setView('list'));
document.getElementById('vbtn-grid').addEventListener('click', () => setView('grid'));

function setView(v) {
  currentView = v;
  document.getElementById('vbtn-list').classList.toggle('active', v === 'list');
  document.getElementById('vbtn-grid').classList.toggle('active', v === 'grid');
  renderProducts();
}

// ── Search & sort ─────────────────────
document.getElementById('prod-search').addEventListener('input', renderProducts);
document.getElementById('prod-sort').addEventListener('change', renderProducts);

// ── Render products ───────────────────
function renderProducts() {
  const panel = document.getElementById('prod-panel');
  const badge = document.getElementById('prod-count');
  if (!panel || !CATS.length) return;

  const cat = CATS.find(c => c.id === currentCat);
  if (!cat) { panel.innerHTML = ''; return; }

  const q = (document.getElementById('prod-search').value || '').toLowerCase().trim();
  const sortBy = document.getElementById('prod-sort').value;

  let items = [...cat.items];
  if (q) items = items.filter(i => i.n.toLowerCase().includes(q) || i.v.toLowerCase().includes(q));

  if (sortBy === 'az') items.sort((a, b) => a.n.localeCompare(b.n));
  else if (sortBy === 'za') items.sort((a, b) => b.n.localeCompare(a.n));
  else if (sortBy === 'price-asc') items.sort((a, b) => a.p - b.p);
  else if (sortBy === 'price-desc') items.sort((a, b) => b.p - a.p);

  badge.textContent = items.length + ' sản phẩm';

  if (!items.length) {
    panel.innerHTML = '<div class="prod-empty"><span>🔍</span>Không tìm thấy sản phẩm nào</div>';
    return;
  }

  if (currentView === 'list') {
    panel.innerHTML = `<div class="plist">${items.map((it, i) => `
      <div class="prow">
        <span class="prow-num">${i + 1}</span>
        <div class="prow-thumb">${it.img
          ? `<img src="${esc(it.img)}" alt="" style="width:38px;height:38px;object-fit:cover;display:block;border-radius:7px" onerror="this.outerHTML='<div class=thumb-emoji>${esc(it.e)}</div>'">`
          : `<div class="thumb-emoji">${esc(it.e)}</div>`
        }</div>
        <div class="prow-info">
          <div class="prow-viet">${esc(it.v)}</div>
          <div class="prow-name">${esc(it.n)}</div>
        </div>
        <span class="prow-price">${fmt(it.p)}</span>
        <button class="addbtn" onclick="addC(this)">+</button>
      </div>`).join('')}</div>`;
  } else {
    panel.innerHTML = `<div class="pgrid">${items.map(it => `
      <div class="pc">
        <div class="pc-imgwrap">${it.img
          ? `<img src="${esc(it.img)}" alt="" onerror="this.outerHTML='<div class=pfb>${esc(it.e)}</div>'">`
          : `<div class="pfb">${esc(it.e)}</div>`
        }</div>
        <div class="pb">
          <div class="pviet">${esc(it.v)}</div>
          <div class="pname">${esc(it.n)}</div>
          <div class="pfoot">
            <span class="pprice">${fmt(it.p)}</span>
            <button class="addbtn" onclick="addC(this)">+</button>
          </div>
        </div>
      </div>`).join('')}</div>`;
  }
}

// ── Add to cart animation ─────────────
function addC(btn) {
  btn.textContent = '✓';
  btn.classList.add('done');
  btn.disabled = true;
  setTimeout(() => { btn.textContent = '+'; btn.classList.remove('done'); btn.disabled = false; }, 1400);
}

// ── New Arrivals ──────────────────────
function renderArrivals(items) {
  const el = document.getElementById('arrivals-grid');
  if (!el) return;
  if (!items.length) { el.innerHTML = '<div class="prod-empty"><span>📦</span>Chưa có sản phẩm mới</div>'; return; }
  el.innerHTML = items.map(it => `
    <div class="pc arrival-card">
      <span class="new-badge">NEW</span>
      <div class="pc-imgwrap">${it.img
        ? `<img src="${esc(it.img)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=pfb>${esc(it.e)}</div>'">`
        : `<div class="pfb">${esc(it.e)}</div>`
      }</div>
      <div class="pb">
        <div class="pviet">${esc(it.v)}</div>
        <div class="pname">${esc(it.n)}</div>
        <div class="pfoot">
          <span class="pprice">${fmt(it.p)}</span>
          <button class="addbtn" onclick="addC(this)">+</button>
        </div>
      </div>
    </div>`).join('');
}

// ── Specials ──────────────────────────
function renderSpecials(items) {
  const el = document.getElementById('specials-grid');
  if (!el) return;
  if (!items.length) { el.innerHTML = '<div class="prod-empty"><span>🏷️</span>Chưa có khuyến mãi</div>'; return; }
  el.innerHTML = items.map(it => {
    const save = (it.was - it.now).toFixed(2);
    return `
    <div class="scard">
      ${it.img
        ? `<img class="scard-img" src="${esc(it.img)}" alt="" loading="lazy" onerror="this.style.display='none'">`
        : `<div class="pfb" style="display:flex;height:100px">${esc(it.v?.charAt(0) || '🏷️')}</div>`
      }
      <div class="sbody">
        <div class="sviet">${esc(it.v)}</div>
        <div class="sname">${esc(it.n)}</div>
        <div class="was">Was ${fmt(it.was)}</div>
        <div class="now">${fmt(it.now)}</div>
        <span class="savebadge">Save $${save}</span>
      </div>
    </div>`;
  }).join('');
}

// ── Services ──────────────────────────
function renderServices(items) {
  const el = document.getElementById('services-grid');
  if (!el) return;
  if (!items.length) { el.innerHTML = '<div class="prod-empty"><span>🔧</span>Chưa có dịch vụ</div>'; return; }
  el.innerHTML = items.map(it => `
    <div class="svc">
      <div class="svc-icon">${esc(it.icon)}</div>
      <h3>${esc(it.title)}</h3>
      <p>${esc(it.desc)}</p>
      ${it.badge ? `<span class="svc-badge">${esc(it.badge)}</span>` : ''}
    </div>`).join('');
}

// ── Household ─────────────────────────
function renderHousehold(items) {
  const el = document.getElementById('household-grid');
  if (!el) return;
  if (!items.length) { el.innerHTML = '<div class="prod-empty"><span>🏠</span>Chưa có sản phẩm</div>'; return; }
  el.innerHTML = items.map(it => `
    <div class="pc">
      <div class="pc-imgwrap"><div class="pfb">${esc(it.e)}</div></div>
      <div class="pb">
        <div class="pviet">${esc(it.v)}</div>
        <div class="pname">${esc(it.n)}</div>
        <div class="pfoot">
          <span class="pprice">${fmt(it.p)}</span>
          <button class="addbtn" onclick="addC(this)">+</button>
        </div>
      </div>
    </div>`).join('');
}

// ── Ticker ────────────────────────────
function buildTicker(cats) {
  const el = document.getElementById('ticker-track');
  if (!el || !cats.length) return;
  const samples = [];
  cats.forEach(c => {
    c.items.slice(0, 2).forEach(it => {
      samples.push(`${esc(it.n)} – ${fmt(it.p)}`);
    });
  });
  const html = samples.map(t => `<span class="ti">${t}</span>`).join('');
  el.innerHTML = html + html;
}

// ── Mobile menu ───────────────────────
const ham = document.getElementById('ham');
const mobNav = document.getElementById('mob-nav');

ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mobNav.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(a => {
  a.addEventListener('click', () => {
    ham.classList.remove('open');
    mobNav.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (mobNav.classList.contains('open') && !mobNav.contains(e.target) && !ham.contains(e.target)) {
    ham.classList.remove('open');
    mobNav.classList.remove('open');
  }
});

// ── Scroll reveal ─────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── Active nav on scroll ──────────────
const navIds = ['home', 'about', 'products', 'new-arrivals', 'specials', 'services', 'household', 'contact'];
window.addEventListener('scroll', () => {
  let cur = '';
  navIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) cur = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + cur) a.classList.add('active');
  });
});

// ── Start ─────────────────────────────
init();
