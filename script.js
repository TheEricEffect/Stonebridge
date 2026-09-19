// Cookie notice
const cookieNotice = document.getElementById('cookieNotice');
const cookieDismiss = document.getElementById('cookieDismiss');
if (cookieNotice && !localStorage.getItem('cookieNoticeDismissed')) {
  cookieNotice.classList.add('show');
}
if (cookieDismiss) {
  cookieDismiss.addEventListener('click', () => {
    cookieNotice.classList.remove('show');
    localStorage.setItem('cookieNoticeDismissed', 'true');
  });
}

// Mobile nav toggle — header is shared across every page, but guarded
// defensively since this file is now loaded site-wide
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// FAQ accordion — only present on the Contact page; querySelectorAll
// safely no-ops on pages without any .faq-item
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  });
});

// Lead form validation + real submission (Formspree AJAX pattern) —
// only present on the Contact page, so guarded with an existence check
const form = document.getElementById('quoteForm');
if (form) {
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    let valid = true;
    const required = form.querySelectorAll('[required]');
    required.forEach(field => {
      const group = field.closest('.form-group');
      let fieldValid = field.value.trim() !== '';
      if (field.type === 'email' && fieldValid) {
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      }
      group.classList.toggle('invalid', !fieldValid);
      if (!fieldValid) valid = false;
    });
    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        form.querySelectorAll('.form-group, .btn-block').forEach(el => el.style.display = 'none');
        form.querySelector('h3').style.display = 'none';
        formSuccess.classList.add('show');
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Free Inspection';
        alert('Something went wrong sending your request — please call us instead on 083 445 9210.');
      }
    }).catch(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book Free Inspection';
      alert('Something went wrong sending your request — please call us instead on 083 445 9210.');
    });
  });
}
