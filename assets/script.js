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

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get('name') || '';
  const email = data.get('email') || '';
  const business = data.get('business') || '';
  const service = data.get('service') || '';
  const message = data.get('message') || '';
  const subject = encodeURIComponent(`Upit za web — ${business || name}`);
  const body = encodeURIComponent(`Ime i prezime: ${name}\nE-mail: ${email}\nObrt/tvrtka: ${business}\nZanima me: ${service}\n\nPoruka:\n${message}`);
  const feedback = contactForm.querySelector('.form-message');
  if (feedback) feedback.textContent = 'Otvaramo vaš e-mail program s pripremljenom porukom…';
  window.location.href = `mailto:sox.contactinfo@gmail.com?subject=${subject}&body=${body}`;
});
