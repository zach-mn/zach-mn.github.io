// ════════════════════════════════════════════════════
// zachmn.com — light interaction layer
// ════════════════════════════════════════════════════

// ── Scroll reveal (staggered via --rd in CSS) ────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

// ── Header hairline on scroll ────────────────────────
const header = document.querySelector('.site-header');
let scrollTicking = false;

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 8);
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(updateHeader);
  }
}, { passive: true });
updateHeader();

// ── Mobile menu ──────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');

navToggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── Footer year ──────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();
