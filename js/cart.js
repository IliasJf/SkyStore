// Cart page: quantities, removal, promo code and the free delivery bar
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('cart-root');
  if (!root) return;
  const list = document.getElementById('lines');

  const render = () => {
    const lines = cartLines();
    root.hidden = lines.length === 0;
    document.getElementById('cart-empty').hidden = lines.length > 0;
    if (!lines.length) return;

    list.innerHTML = lines
      .map((l) => {
        const { key } = l;
        return `
        <li class="line">
          <a href="product.html?id=${l.id}"><img src="${l.image}" alt="" width="96" height="122" loading="lazy"></a>
          <div class="line-info">
            <a class="line-name" href="product.html?id=${l.id}">${escapeHtml(l.product.name)}</a>
            ${variantText(l) ? `<p class="line-variant">${escapeHtml(variantText(l))}</p>` : ''}
            <p class="line-unit">${money(l.product.price)} each</p>
            <button type="button" class="btn-text" data-remove="${key}">Remove</button>
          </div>
          <div class="stepper" aria-label="Quantity of ${escapeHtml(l.product.name)}">
            <button type="button" data-qty="${key}" data-step="-1" aria-label="One less ${escapeHtml(l.product.name)}"><span aria-hidden="true">−</span></button>
            <output>${l.qty}</output>
            <button type="button" data-qty="${key}" data-step="1" aria-label="One more ${escapeHtml(l.product.name)}" ${l.qty >= MAX_QTY ? 'disabled' : ''}><span aria-hidden="true">+</span></button>
          </div>
          <p class="line-total">${money(l.total)}</p>
        </li>`;
      })
      .join('');

    const t = cartTotals(lines);
    document.getElementById('totals').innerHTML = totalsHtml(t);
    const left = FREE_DELIVERY_FROM - (t.subtotal - t.discount);
    document.getElementById('free-text').textContent = left > 0 ? `Add ${money(left)} more for free delivery.` : 'Your delivery is free.';
    document.getElementById('free-progress').style.transform = `scaleX(${Math.min(1, (t.subtotal - t.discount) / FREE_DELIVERY_FROM)})`;
    const promo = store.get('promo', null);
    if (promo) document.getElementById('promo').value = promo;
  };

  list.addEventListener('click', (e) => {
    const step = e.target.closest('[data-qty]');
    if (step) {
      const line = store.get('cart', []).find((l) => lineKey(l.id, l.size, l.color) === step.dataset.qty);
      setCartQty(step.dataset.qty, line.qty + Number(step.dataset.step));
      render();
      return;
    }
    const remove = e.target.closest('[data-remove]');
    if (remove) {
      setCartQty(remove.dataset.remove, 0);
      render();
      toast('Removed from your cart.');
    }
  });

  document.getElementById('promo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = e.target.promo.value.trim().toUpperCase();
    const msg = document.getElementById('promo-msg');
    if (!code) {
      store.set('promo', null);
      msg.textContent = '';
    } else if (PROMO_CODES[code]) {
      store.set('promo', code);
      msg.textContent = `${code} applied: ${PROMO_CODES[code] * 100}% off.`;
      msg.className = 'promo-msg is-ok';
    } else {
      msg.textContent = 'This code does not exist.';
      msg.className = 'promo-msg is-error';
    }
    render();
  });

  render();
});
