// Contact form: checks the fields and confirms. The demo does not send the message anywhere.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = [
      [form.name, form.name.value.trim().length < 2 ? 'Enter your name.' : ''],
      [form.email, !EMAIL.test(form.email.value.trim()) ? 'Enter a valid email address.' : ''],
      [form.message, form.message.value.trim().length < 10 ? 'Write a few words so we can help.' : ''],
    ];
    errors.forEach(([input, message]) => showFieldError(input, message));
    const first = errors.find(([, m]) => m);
    if (first) { first[0].focus(); return; }

    const success = document.getElementById('contact-success');
    success.textContent = `Thanks ${form.name.value.trim().split(' ')[0]}, your message is ready. This is a demo store, so nothing was sent.`;
    success.hidden = false;
    form.reset();
  });
});
