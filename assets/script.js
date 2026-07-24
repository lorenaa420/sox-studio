const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

function setMenu(open) {
  if (!menuButton || !navLinks) return;
  menuButton.setAttribute('aria-expanded', String(open));
  navLinks.dataset.open = String(open);
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

window.addEventListener('resize', () => {
  if (window.innerWidth >= 780) setMenu(false);
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 10);
}, { passive: true });

const revealElements = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

/* --- NOVI KOD ZA KONTAKT FORMU (FormSubmit) --- */
const contactForm = document.querySelector('[data-contact-form]');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault(); // Zaustavlja osvježavanje stranice

  const feedback = contactForm.querySelector('.form-message');
  if (feedback) {
    feedback.textContent = 'Slanje upita u tijeku...';
  }

  // Šalje podatke iz forme u pozadini bez mailto: naredbe
  fetch(contactForm.action, {
    method: 'POST',
    body: new FormData(contactForm),
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      if (feedback) feedback.textContent = 'Upit je uspješno poslan! Javit ćemo vam se ubrzo.';
      contactForm.reset(); // Prazni polja nakon uspješnog slanja
    } else {
      if (feedback) feedback.textContent = 'Došlo je do pogreške. Molimo pokušajte ponovno.';
    }
  })
  .catch(error => {
    if (feedback) feedback.textContent = 'Greška s mrežom. Provjerite internetsku vezu.';
  });
});
