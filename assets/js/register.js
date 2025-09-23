(function() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');

  function setStatus(message, type = 'info') {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
  }

  function validateField(field) {
    const errorEl = field.parentElement.querySelector('.error');
    if (!errorEl) return true;
    let valid = true;
    errorEl.textContent = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
      errorEl.textContent = 'Required';
      valid = false;
    } else if (field.type === 'email' && field.value) {
      const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value);
      if (!ok) { errorEl.textContent = 'Invalid email'; valid = false; }
    } else if (field.name === 'github' && field.value) {
      const ok = /^[A-Za-z0-9-]{1,39}$/.test(field.value);
      if (!ok) { errorEl.textContent = 'Invalid username'; valid = false; }
    }
    if (!valid) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return valid;
  }

  form.querySelectorAll('input,select,textarea').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');
    let allValid = true;
    form.querySelectorAll('input[required],select[required],textarea[required]').forEach(f => {
      if (!validateField(f)) allValid = false;
    });
    const coc = form.querySelector('input[name=coc]');
    if (!coc.checked) {
      setStatus('You must accept the Code of Conduct.', 'error');
      allValid = false;
    }
    if (!allValid) return;

    // Gather form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // OPTION 1 (default placeholder): Just log and display success (static site).
    console.log('Form submission (demo mode):', data);

    // To implement actual handling:
    // - Replace this block with a fetch() to serverless endpoint
    // - Or integrate with an external service (Formspree, Basin, etc.)
    // - Or create a GitHub Action listening to a JSON commit/PR

    setStatus('Submitted! We will review your request and email confirmation if accepted.', 'success');
    form.reset();
  });
})();
