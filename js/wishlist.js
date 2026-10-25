// Wishlist: the products saved with the heart button
document.addEventListener('DOMContentLoaded', () => {
  const render = () => {
    const saved = store.get('wish', []).map(productById).filter(Boolean);
    document.getElementById('wish-grid').innerHTML = saved.map(productCard).join('');
    document.getElementById('wish-empty').hidden = saved.length > 0;
  };
  document.addEventListener('wish:change', render);
  render();
});
