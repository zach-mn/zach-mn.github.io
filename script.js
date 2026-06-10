// ════════════════════════════════════════════════════
// zachmn.com — interaction & animation
// ════════════════════════════════════════════════════

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

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
  { threshold: 0.12 }
);

document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

// ── Scroll progress bar ──────────────────────────────
const progressBar = document.querySelector('.scroll-progress');
let progressTicking = false;

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  progressTicking = false;
}

window.addEventListener('scroll', () => {
  if (!progressTicking) {
    progressTicking = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });
updateProgress();

// ── Active nav link on scroll ────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => navObserver.observe(section));

// ── Mobile hamburger menu ────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  toggle.classList.toggle('active', open);
  toggle.setAttribute('aria-expanded', open);
  document.body.classList.toggle('menu-open', open);
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

// ── Custom cursor (desktop, motion allowed) ──────────
if (finePointer && !reducedMotion) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
  }, { passive: true });

  (function followCursor() {
    // ring trails the dot with a lerp for a soft, weighty feel
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(followCursor);
  })();

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ── Magnetic elements ────────────────────────────────
if (finePointer && !reducedMotion) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.3;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transform = 'translate(0, 0)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
}

// ── Project card tilt + spotlight ────────────────────
if (finePointer && !reducedMotion) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      card.style.transform =
        `rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 5}deg) translateZ(0)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.transform = 'rotateX(0) rotateY(0)';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });
  });
}

// ── Hero canvas: interactive dot grid ────────────────
(function heroGrid() {
  const canvas = document.getElementById('hero-canvas');
  const hero = document.getElementById('hero');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const SPACING = 30;
  const INFLUENCE = 150;
  let dots = [];
  let width, height, dpr;
  let pointer = { x: -9999, y: -9999 };
  let rafId = null;
  let heroVisible = true;

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dots = [];
    for (let x = SPACING / 2; x < width; x += SPACING) {
      for (let y = SPACING / 2; y < height; y += SPACING) {
        dots.push({ ox: x, oy: y, x, y });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const d of dots) {
      const dx = pointer.x - d.ox;
      const dy = pointer.y - d.oy;
      const dist = Math.hypot(dx, dy);
      const force = Math.max(0, 1 - dist / INFLUENCE);

      // dots ease away from the cursor, then spring home
      const targetX = d.ox - (dx / (dist || 1)) * force * 18;
      const targetY = d.oy - (dy / (dist || 1)) * force * 18;
      d.x += (targetX - d.x) * 0.12;
      d.y += (targetY - d.y) * 0.12;

      const radius = 1 + force * 1.6;
      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = force > 0.02
        ? `rgba(242, 163, 60, ${0.18 + force * 0.65})`
        : 'rgba(237, 232, 223, 0.1)';
      ctx.fill();
    }

    rafId = heroVisible ? requestAnimationFrame(draw) : null;
  }

  function start() {
    if (rafId === null) rafId = requestAnimationFrame(draw);
  }

  build();

  if (reducedMotion) {
    // static grid, no animation loop
    draw();
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    return;
  }

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  // pause the loop when the hero scrolls out of view
  new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible) start();
  }).observe(hero);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      start();
    }, 150);
  });

  start();
})();
