// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// Active nav link on scroll
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--text)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => navObserver.observe(section));

// Mobile hamburger menu
const toggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  navMenu.classList.toggle('open');
  document.body.classList.toggle('menu-open');
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    toggle.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});
