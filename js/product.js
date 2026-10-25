// Product page: one template for every product, chosen by ?id=
const SIZE_GUIDES = {
  clothing: {
    head: ['Size', 'Chest (cm)', 'Waist (cm)'],
    rows: [['S', '88–94', '74–80'], ['M', '94–100', '80–86'], ['L', '100–106', '86–92'], ['XL', '106–112', '92–98'], ['XXL', '112–118', '98–104']],
  },
  shoes: {
    head: ['EU size', 'Foot length (cm)'],
    rows: [['40', '25.0'], ['41', '25.7'], ['42', '26.4'], ['43', '27.1'], ['44', '27.8'], ['45', '28.5']],
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const product = productById(new URLSearchParams(location.search).get('id'));
  const root = document.getElementById('product-root');

  if (!product) {
    root.innerHTML = `<div class="empty empty--page"><h1>This product does not exist.</h1><p>It may have sold out or moved.</p><a class="btn" href="products.html">Go to the shop</a></div>`;
    document.title = 'Product not found | SkyStore';
    return;
  }

  let color = product.colors ? product.colors[0].id : null;
  let size = null;
  let qty = 1;

  const $ = (id) => document.getElementById(id);
  const mainImg = $('main-img');

  document.title = `${product.name} | SkyStore`;
  document.querySelector('meta[name="description"]').content = `${product.name}, ${money(product.price)}. ${product.description}`;
  $('crumb-cat').textContent = CATEGORIES[product.category];
  $('crumb-cat').href = `products.html?cat=${product.category}`;
  $('p-cat').textContent = CATEGORIES[product.category];
  $('p-name').textContent = product.name;
  $('p-price').textContent = money(product.price);
  $('p-desc').textContent = product.description;
  $('p-details').innerHTML = product.details.map((d) => `<li>${escapeHtml(d)}</li>`).join('');

  /* Gallery */
  const showImages = () => {
    const images = productImages(product, color);
    const colorName = product.colors?.find((c) => c.id === color)?.name;
    mainImg.src = images[0];
    mainImg.alt = colorName ? `${product.name} in ${colorName.toLowerCase()}` : product.name;
    $('thumbs').innerHTML = images.length > 1
      ? images.map((src, i) => `<button type="button" class="thumb" data-src="${src}" aria-pressed="${i === 0}" aria-label="Photo ${i + 1} of ${images.length}"><img src="${src}" alt="" width="120" height="153"></button>`).join('')
      : '';
  };
  $('thumbs').addEventListener('click', (e) => {
    const thumb = e.target.closest('.thumb');
    if (!thumb) return;
    mainImg.src = thumb.dataset.src;
    $('thumbs').querySelectorAll('.thumb').forEach((t) => t.setAttribute('aria-pressed', String(t === thumb)));
  });

  /* Colours */
  if (product.colors) {
    $('color-set').hidden = false;
    $('colors').innerHTML = product.colors
      .map((c) => `<label class="swatch"><input type="radio" name="color" value="${c.id}" ${c.id === color ? 'checked' : ''}><span style="background:${c.swatch}"></span><span class="sr-only">${escapeHtml(c.name)}</span></label>`)
      .join('');
    $('color-name').textContent = product.colors[0].name;
    $('colors').addEventListener('change', (e) => {
      color = e.target.value;
      $('color-name').textContent = product.colors.find((c) => c.id === color).name;
      showImages();
    });
  }
  showImages();

  /* Sizes */
  if (product.sizes) {
    $('size-set').hidden = false;
    $('sizes').innerHTML = product.sizes
      .map((s) => `<label class="size"><input type="radio" name="size" value="${s}"><span>${s}</span></label>`)
      .join('');
    $('sizes').addEventListener('change', (e) => {
      size = e.target.value;
      $('size-error').hidden = true;
      $('size-set').removeAttribute('aria-invalid');
    });

    const guide = product.category === 'shoes' ? SIZE_GUIDES.shoes : SIZE_GUIDES.clothing;
    $('guide-body').innerHTML = `<table class="table"><thead><tr>${guide.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${guide.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="hint">Between two sizes, take the bigger one.</p>`;
    if (product.category === 'accessories') $('open-guide').hidden = true;
  }
  const dialog = $('size-guide');
  $('open-guide').addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target.closest('[data-close]')) dialog.close(); });

  /* Quantity */
  const setQty = (n) => {
    qty = Math.max(1, Math.min(MAX_QTY, n));
    $('qty').textContent = qty;
    $('qty-minus').disabled = qty <= 1;
    $('qty-plus').disabled = qty >= MAX_QTY;
  };
  $('qty-minus').addEventListener('click', () => setQty(qty - 1));
  $('qty-plus').addEventListener('click', () => setQty(qty + 1));
  setQty(1);

  /* Add to cart */
  $('buy-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (product.sizes && !size) {
      $('size-error').hidden = false;
      $('size-set').setAttribute('aria-invalid', 'true');
      $('sizes').querySelector('input').focus();
      return;
    }
    addToCart(product.id, { size, color, qty });
    toast(`${product.name}${size ? `, size ${size}` : ''} added to your cart.`, { href: 'cart.html', label: 'View cart' });
  });

  /* Wishlist */
  const save = $('save-btn');
  const syncSave = () => {
    const saved = isSaved(product.id);
    save.setAttribute('aria-pressed', String(saved));
    save.setAttribute('aria-label', saved ? 'Remove from wishlist' : 'Save to wishlist');
  };
  save.addEventListener('click', () => {
    const saved = toggleSaved(product.id);
    syncSave();
    toast(saved ? 'Saved to your wishlist.' : 'Removed from your wishlist.');
  });
  syncSave();

  /* Related: same category first, then the rest */
  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
    .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 4);
  $('related').innerHTML = related.map(productCard).join('');

  /* Structured data for search engines */
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: new URL(productImages(product, color)[0], location.href).href,
    description: product.description,
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'MAD', availability: 'https://schema.org/InStock' },
  });
  document.head.append(ld);
});
