// Home page: bestsellers and new arrivals come from the catalogue
document.addEventListener('DOMContentLoaded', () => {
  const render = () => {
    const best = PRODUCTS.filter((p) => p.tags.includes('bestseller')).concat(PRODUCTS.filter((p) => !p.tags.length)).slice(0, 4);
    const fresh = PRODUCTS.filter((p) => p.tags.includes('new')).slice(0, 4);
    document.getElementById('bestsellers').innerHTML = best.map(productCard).join('');
    document.getElementById('new-in').innerHTML = fresh.map(productCard).join('');
  };
  render();
});
