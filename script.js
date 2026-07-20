const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('nav-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll('[data-count]');
let countersStarted = false;

function formatNumber(value) {
  if (value >= 100000) return `${Math.round(value / 1000)}K+`;
  if (value >= 1000) return value.toLocaleString('en-IN');
  return String(value);
}

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count || 0);
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = formatNumber(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = formatNumber(target);
    }
    requestAnimationFrame(tick);
  });
}

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      animateCounters();
      counterObserver.disconnect();
    }
  }, { threshold: 0.2 });
  counterObserver.observe(statsStrip);
}
