// Checkout: validates the delivery details, saves the order and opens its confirmation
const miniLinesHtml = (lines) =>
  lines
    .map((l) => `
      <li>
        <img src="${l.image}" alt="" width="56" height="72" loading="lazy">
        <span><strong>${escapeHtml(l.product?.name || l.name)}</strong>${[l.qty + ' × ' + money(l.unit ?? l.product.price), variantText(l)].filter(Boolean).join(', ')}</span>
        <span class="price">${money(l.total)}</span>
      </li>`)
    .join('');

document.addEventListener('DOMContentLoaded', () => {
  const lines = cartLines();
  const root = document.getElementById('checkout-root');
  if (!lines.length) {
    root.hidden = true;
    document.getElementById('checkout-empty').hidden = false;
    return;
  }

  const form = document.getElementById('checkout-form');
  form.city.insertAdjacentHTML('beforeend', CITIES.map((c) => `<option>${c}</option>`).join(''));
  document.getElementById('mini-lines').innerHTML = miniLinesHtml(lines);
  const totals = cartTotals(lines);
  document.getElementById('co-totals').innerHTML = totalsHtml(totals);

  // Fill in what we already know from the account or the last order
  const known = store.get('user', null) || store.get('lastDelivery', null);
  if (known) {
    ['name', 'phone', 'city', 'address'].forEach((k) => { if (known[k]) form[k].value = known[k]; });
  }

  const rules = {
    name: (v) => (v.trim().length < 3 ? 'Enter your full name.' : ''),
    phone: (v) => (!MOROCCAN_PHONE.test(v.replace(/[\s.-]/g, '')) ? 'Enter a Moroccan phone number, for example 06 12 34 56 78.' : ''),
    city: (v) => (!v ? 'Choose your city.' : ''),
    address: (v) => (v.trim().length < 6 ? 'Enter your street and building.' : ''),
  };

  const check = (name) => {
    const message = rules[name](form[name].value);
    showFieldError(form[name], message);
    return message;
  };

  // Re-check a field once it has been marked wrong, so the error clears as soon as it is fixed
  Object.keys(rules).forEach((name) => {
    form[name].addEventListener('input', () => { if (form[name].getAttribute('aria-invalid')) check(name); });
    form[name].addEventListener('change', () => { if (form[name].getAttribute('aria-invalid')) check(name); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = Object.keys(rules).map((name) => [name, check(name)]).filter(([, m]) => m);
    const box = document.getElementById('form-errors');
    if (errors.length) {
      box.hidden = false;
      box.innerHTML = `<p><strong>Please fix ${errors.length === 1 ? 'one field' : `${errors.length} fields`}:</strong></p><ul>${errors.map(([n, m]) => `<li><a href="#c-${n}">${m}</a></li>`).join('')}</ul>`;
      box.focus();
      return;
    }
    box.hidden = true;

    const delivery = {
      name: form.name.value.trim(),
      phone: form.phone.value.replace(/[\s.-]/g, ''),
      city: form.city.value,
      zip: form.zip.value.trim(),
      address: form.address.value.trim(),
      note: form.note.value.trim(),
    };
    const id = 'SKY-' + Date.now().toString(36).toUpperCase().slice(-6);
    const order = {
      id,
      date: new Date().toISOString(),
      delivery,
      lines: lines.map((l) => ({ id: l.id, name: l.product.name, size: l.size, color: l.color ? { name: l.color.name } : null, qty: l.qty, unit: l.product.price, total: l.total, image: l.image })),
      totals,
      email: store.get('user', null)?.email || null,
    };
    store.set('orders', [order, ...store.get('orders', [])]);
    store.set('lastDelivery', delivery);
    store.set('cart', []);
    store.set('promo', null);
    location.href = `order.html?id=${id}`;
  });
});
