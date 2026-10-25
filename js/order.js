// Order confirmation, read from the orders saved in this browser
// The shop's WhatsApp number goes here, for example '2126XXXXXXXX'. Empty in the demo.
const SHOP_WHATSAPP = '';

document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  const order = store.get('orders', []).find((o) => o.id === id);
  if (!order) {
    document.getElementById('order-root').hidden = true;
    document.getElementById('order-missing').hidden = false;
    return;
  }

  const { delivery, totals } = order;
  document.getElementById('order-id').textContent = `Order number ${order.id}`;
  document.getElementById('order-text').textContent =
    `We will call ${delivery.phone} to confirm, then deliver to ${delivery.city}. You pay ${money(totals.total)} in cash to the courier.`;

  const lines = order.lines.map((l) => ({ ...l, product: null }));
  document.getElementById('order-lines').innerHTML = lines
    .map((l) => `
      <li>
        <img src="${l.image}" alt="" width="56" height="72">
        <span><strong>${escapeHtml(l.name)}</strong>${[`${l.qty} × ${money(l.unit)}`, l.color?.name, l.size && `Size ${l.size}`].filter(Boolean).join(', ')}</span>
        <span class="price">${money(l.total)}</span>
      </li>`)
    .join('');
  document.getElementById('order-totals').innerHTML = totalsHtml(totals);

  const message = [
    `Hello SkyStore, I just placed order ${order.id}.`,
    ...order.lines.map((l) => `- ${l.qty} × ${l.name}${l.size ? ` (size ${l.size})` : ''}`),
    `Total: ${money(totals.total)}, cash on delivery.`,
    `${delivery.name}, ${delivery.address}, ${delivery.city}.`,
  ].join('\n');
  document.getElementById('order-wa').href = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(message)}`;
  document.getElementById('order-wa').target = '_blank';
  document.getElementById('order-wa').rel = 'noopener';
});
