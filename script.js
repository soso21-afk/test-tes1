const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateNavbar = () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
};
updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

const closeMenu = () => {
  navToggle?.classList.remove('open');
  navLinks?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const selector = anchor.getAttribute('href');
    if (!selector || selector === '#') return;

    const target = document.querySelector(selector);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

const revealItems = [...document.querySelectorAll('.reveal')];
revealItems.forEach((item, index) => item.style.setProperty('--delay', `${Math.min(index % 3, 2) * 80}ms`));

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-item[open]').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const form = document.querySelector('.contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const button = form.querySelector('button[type="submit"]');
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<span class="spinner" aria-hidden="true"></span> Envoi en cours';

  window.setTimeout(() => {
    button.innerHTML = 'Demande envoyée';
    button.style.background = '#1a7a50';
    form.reset();

    window.setTimeout(() => {
      button.innerHTML = original;
      button.style.background = '';
      button.disabled = false;
    }, 3200);
  }, 900);
});

const style = document.createElement('style');
style.textContent = '.spinner{width:17px;height:17px;border:2px solid rgba(255,255,255,.38);border-top-color:#fff;border-radius:50%;animation:spin .75s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(style);
