// Shared by every page: saved state, header counters, mobile menu, toasts and product cards.

const store = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem('skystore:' + key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem('skystore:' + key, JSON.stringify(value));
    } catch {
      /* storage full or blocked: the page still works for this visit */
    }
  },
};

const money = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' DH';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Cart ---------- */

const MAX_QTY = 10;

function cartLines() {
  return store
    .get('cart', [])
    .map((line) => {
      const product = productById(line.id);
      if (!product) return null;
      const color = product.colors?.find((c) => c.id === line.color);
      return { ...line, key: lineKey(line.id, line.size, line.color), product, color, image: productImages(product, line.color)[0], total: product.price * line.qty };
    })
    .filter(Boolean);
}

const lineKey = (id, size, color) => [id, size || '', color || ''].join('|');

function addToCart(id, { size = null, color = null, qty = 1 } = {}) {
  const cart = store.get('cart', []);
  const key = lineKey(id, size, color);
  const existing = cart.find((l) => lineKey(l.id, l.size, l.color) === key);
  if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty);
  else cart.push({ id, size, color, qty: Math.min(MAX_QTY, qty) });
  store.set('cart', cart);
  updateCounts();
}

function setCartQty(key, qty) {
  let cart = store.get('cart', []);
  if (qty < 1) cart = cart.filter((l) => lineKey(l.id, l.size, l.color) !== key);
  else cart.forEach((l) => { if (lineKey(l.id, l.size, l.color) === key) l.qty = Math.min(MAX_QTY, qty); });
  store.set('cart', cart);
  updateCounts();
}

function cartTotals(lines = cartLines()) {
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const promo = store.get('promo', null);
  const rate = promo && PROMO_CODES[promo] ? PROMO_CODES[promo] : 0;
  const discount = Math.round(subtotal * rate);
  const afterDiscount = subtotal - discount;
  const delivery = lines.length === 0 || afterDiscount >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { subtotal, discount, promo: rate ? promo : null, delivery, total: afterDiscount + delivery };
}

/* ---------- Order summaries (cart, checkout, confirmation) ---------- */

function totalsHtml(t) {
  return `
    <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
    ${t.discount ? `<div class="discount"><dt>Promo ${t.promo}</dt><dd>−${money(t.discount)}</dd></div>` : ''}
    <div><dt>Delivery</dt><dd>${t.delivery ? money(t.delivery) : 'Free'}</dd></div>
    <div class="grand"><dt>Total to pay at the door</dt><dd>${money(t.total)}</dd></div>`;
}

const variantText = (l) => [l.color?.name, l.size && `Size ${l.size}`].filter(Boolean).join(', ');

/* ---------- Wishlist ---------- */

function isSaved(id) {
  return store.get('wish', []).includes(id);
}

function toggleSaved(id) {
  const wish = store.get('wish', []);
  const next = wish.includes(id) ? wish.filter((w) => w !== id) : [...wish, id];
  store.set('wish', next);
  updateCounts();
  return next.includes(id);
}

/* ---------- Header ---------- */

function updateCounts() {
  const count = store.get('cart', []).reduce((sum, l) => sum + l.qty, 0);
  const saved = store.get('wish', []).length;
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
    el.hidden = count === 0;
  });
  document.querySelectorAll('[data-wish-count]').forEach((el) => {
    el.textContent = saved;
    el.hidden = saved === 0;
  });
  document.querySelectorAll('[data-cart-label]').forEach((el) => {
    el.setAttribute('aria-label', `Cart, ${count} item${count === 1 ? '' : 's'}`);
  });
}

function initMenu() {
  const button = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');
  if (!button || !menu) return;
  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  window.matchMedia('(min-width: 860px)').addEventListener('change', close);
}

function markCurrentPage() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((a) => {
    if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page');
  });
}

/* ---------- Toast ---------- */

function toast(message, link) {
  let box = document.querySelector('.toast');
  if (!box) {
    box = document.createElement('div');
    box.className = 'toast';
    box.setAttribute('role', 'status');
    document.body.append(box);
  }
  box.innerHTML = escapeHtml(message) + (link ? ` <a href="${link.href}">${escapeHtml(link.label)}</a>` : '');
  box.classList.add('is-visible');
  clearTimeout(box.timer);
  box.timer = setTimeout(() => box.classList.remove('is-visible'), 3500);
}

/* ---------- Icons ---------- */

const ICONS = {
  heart: '<path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3 5 6.4 5c2 0 3.3 1.1 4 2.3h3.2C14.3 6.1 15.6 5 17.6 5 21 5 22.7 8.4 21.2 11.4 19 15.6 12 20 12 20z" transform="translate(0 -1)"/>',
  bag: '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
};

const icon = (name, size = 20) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

/* ---------- Product card ---------- */

function productCard(product) {
  const image = productImages(product)[0];
  const needsChoice = Boolean(product.sizes);
  const saved = isSaved(product.id);
  const badge = product.tags.includes('new') ? '<span class="badge">New</span>' : product.tags.includes('bestseller') ? '<span class="badge badge--dark">Bestseller</span>' : '';
  const swatches = product.colors
    ? `<span class="card-swatches" aria-label="${product.colors.length} colours">${product.colors.map((c) => `<span style="background:${c.swatch}" title="${escapeHtml(c.name)}"></span>`).join('')}</span>`
    : '';
  return `
    <article class="card">
      <div class="card-media">
        <a href="product.html?id=${product.id}" tabindex="-1" aria-hidden="true">
          <img src="${image}" alt="" width="600" height="764" loading="lazy" decoding="async">
        </a>
        ${badge}
        <button type="button" class="card-save" data-save="${product.id}" aria-pressed="${saved}" aria-label="Save ${escapeHtml(product.name)}">${icon('heart', 18)}</button>
      </div>
      <div class="card-body">
        <h3 class="card-title"><a href="product.html?id=${product.id}">${escapeHtml(product.name)}</a></h3>
        <p class="card-meta">${CATEGORIES[product.category]}${swatches}</p>
        <div class="card-foot">
          <span class="price">${money(product.price)}</span>
          ${needsChoice
            ? `<a class="card-add" href="product.html?id=${product.id}" aria-label="Choose a size for ${escapeHtml(product.name)}">Choose size</a>`
            : `<button type="button" class="card-add" data-add="${product.id}" aria-label="Add ${escapeHtml(product.name)} to cart">${icon('plus', 16)} Add</button>`}
        </div>
      </div>
    </article>`;
}

// One listener for every card on the page, including cards rendered later
document.addEventListener('click', (e) => {
  const save = e.target.closest('[data-save]');
  if (save) {
    const nowSaved = toggleSaved(save.dataset.save);
    save.setAttribute('aria-pressed', String(nowSaved));
    toast(nowSaved ? 'Saved to your wishlist.' : 'Removed from your wishlist.', nowSaved ? { href: 'wishlist.html', label: 'View' } : null);
    document.dispatchEvent(new CustomEvent('wish:change'));
    return;
  }
  const add = e.target.closest('[data-add]');
  if (add) {
    const product = productById(add.dataset.add);
    addToCart(product.id);
    toast(`${product.name} added to your cart.`, { href: 'cart.html', label: 'View cart' });
  }
});

/* ---------- Forms ---------- */

function showFieldError(input, message) {
  const field = input.closest('.field');
  let error = field.querySelector('.field-error');
  if (!message) {
    input.removeAttribute('aria-invalid');
    error?.remove();
    return;
  }
  if (!error) {
    error = document.createElement('p');
    error.className = 'field-error';
    error.id = input.id + '-error';
    field.append(error);
  }
  error.textContent = message;
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', error.id);
}

const MOROCCAN_PHONE = /^(?:\+212|00212|0)[5-7]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- Start ---------- */

document.addEventListener('DOMContentLoaded', () => {
  updateCounts();
  initMenu();
  markCurrentPage();
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
});

// Keep counters right when another tab changes the cart
window.addEventListener('storage', updateCounts);
