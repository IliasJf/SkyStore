// Shop page: filters live in the URL so a filtered list can be shared or bookmarked
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('filters');
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const count = document.getElementById('result-count');
  const chips = document.getElementById('cat-chips');
  const title = document.getElementById('shop-title');

  // Every size used in the catalogue, in catalogue order
  const sizes = [...new Set(PRODUCTS.flatMap((p) => p.sizes || []))];
  form.size.insertAdjacentHTML('beforeend', sizes.map((s) => `<option value="${s}">${s}</option>`).join(''));

  const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const read = () => {
    const params = new URLSearchParams(location.search);
    return {
      cat: params.get('cat') || '',
      q: params.get('q') || '',
      size: params.get('size') || '',
      max: params.get('max') || '',
      sort: params.get('sort') || 'popular',
    };
  };

  const write = (state) => {
    const params = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => { if (v && !(k === 'sort' && v === 'popular')) params.set(k, v); });
    const query = params.toString();
    history.replaceState(null, '', query ? `?${query}` : location.pathname);
    render();
  };

  const render = () => {
    const state = read();
    form.q.value = state.q;
    form.size.value = state.size;
    form.max.value = state.max;
    form.sort.value = state.sort;

    chips.innerHTML = [['', 'All'], ...Object.entries(CATEGORIES)]
      .map(([id, label]) => `<button type="button" class="chip" data-cat="${id}" aria-pressed="${state.cat === id}">${label}</button>`)
      .join('');

    const q = normalize(state.q.trim());
    let list = PRODUCTS.filter((p) =>
      (!state.cat || p.category === state.cat) &&
      (!q || normalize(`${p.name} ${CATEGORIES[p.category]} ${p.colors?.map((c) => c.name).join(' ') || ''}`).includes(q)) &&
      (!state.size || p.sizes?.includes(state.size)) &&
      (!state.max || p.price <= Number(state.max))
    );

    const rank = (p) => (p.tags.includes('bestseller') ? 0 : p.tags.includes('new') ? 1 : 2);
    if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (state.sort === 'new') list.sort((a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')));
    else list.sort((a, b) => rank(a) - rank(b));

    const heading = state.cat ? CATEGORIES[state.cat] : 'Shop';
    title.textContent = heading;
    document.title = `${heading} | SkyStore`;
    count.textContent = `${list.length} product${list.length === 1 ? '' : 's'}${state.q ? ` for “${state.q}”` : ''}`;
    grid.innerHTML = list.map(productCard).join('');
    empty.hidden = list.length > 0;
  };

  chips.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-cat]');
    if (chip) write({ ...read(), cat: chip.dataset.cat });
  });

  form.addEventListener('change', () => write({ ...read(), size: form.size.value, max: form.max.value, sort: form.sort.value }));

  let typing;
  form.q.addEventListener('input', () => {
    clearTimeout(typing);
    typing = setTimeout(() => write({ ...read(), q: form.q.value }), 250);
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); write({ ...read(), q: form.q.value }); });

  const reset = (e) => { e?.preventDefault(); write({ cat: '', q: '', size: '', max: '', sort: 'popular' }); };
  form.addEventListener('reset', reset);
  document.getElementById('empty-reset').addEventListener('click', reset);

  render();
});
