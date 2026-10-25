// Demo account: kept in this browser only. Passwords are stored as a SHA-256 hash, never as text.
// A real shop would do this on a server.
async function hash(text) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);
  const tabs = [$('tab-login'), $('tab-register')];
  const panels = [$('login-form'), $('register-form')];

  const selectTab = (index) => {
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === index));
      t.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    tabs[index].focus();
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => selectTab(i)));
  tabs.forEach((t, i) =>
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') selectTab((i + 1) % 2);
    })
  );

  const showProfile = () => {
    const user = store.get('user', null);
    const session = store.get('session', null);
    const signedIn = user && session === user.email;
    $('auth').hidden = signedIn;
    $('profile').hidden = !signedIn;
    $('account-title').textContent = signedIn ? `Hello, ${user.name.split(' ')[0]}` : 'My account';
    if (!signedIn) return;

    $('profile-name').textContent = user.name;
    $('profile-email').textContent = user.email;
    const orders = store.get('orders', []);
    $('orders').innerHTML = orders
      .map((o) => `
        <li class="order-row">
          <a href="order.html?id=${o.id}"><strong>${o.id}</strong></a>
          <span>${new Date(o.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>${o.lines.reduce((n, l) => n + l.qty, 0)} items</span>
          <span class="price">${money(o.totals.total)}</span>
        </li>`)
      .join('');
    $('orders-empty').hidden = orders.length > 0;
  };

  $('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const errors = [
      [f.name, f.name.value.trim().length < 3 ? 'Enter your full name.' : ''],
      [f.email, !EMAIL.test(f.email.value.trim()) ? 'Enter a valid email address.' : ''],
      [f.password, f.password.value.length < 8 ? 'Use at least 8 characters.' : ''],
    ];
    errors.forEach(([input, message]) => showFieldError(input, message));
    const first = errors.find(([, m]) => m);
    if (first) { first[0].focus(); return; }

    const email = f.email.value.trim().toLowerCase();
    store.set('user', { name: f.name.value.trim(), email, password: await hash(f.password.value) });
    store.set('session', email);
    toast('Account created. Welcome!');
    showProfile();
  });

  $('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const user = store.get('user', null);
    const email = f.email.value.trim().toLowerCase();
    const error = $('login-error');
    if (!user || user.email !== email || user.password !== (await hash(f.password.value))) {
      error.textContent = user ? 'Email or password is wrong.' : 'No account on this device yet. Create one first.';
      error.hidden = false;
      return;
    }
    error.hidden = true;
    store.set('session', email);
    showProfile();
  });

  $('logout').addEventListener('click', () => {
    store.set('session', null);
    showProfile();
    selectTab(0);
    toast('You are signed out.');
  });

  showProfile();
});
