const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Фильтр портфолио
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
chips.forEach((chip) => chip.addEventListener('click', () => {
  chips.forEach((c) => c.classList.toggle('is-active', c === chip));
  const f = chip.dataset.filter;
  cards.forEach((card) => { card.hidden = f !== 'all' && card.dataset.kind !== f; });
}));

// Подсветка карточки вслед за курсором
cards.forEach((card) => card.addEventListener('pointermove', (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
}));

// Появление блоков при прокрутке
const revealGroups = ['.stats li', '.focus article', '.card', '.job', '.skills > div', '.edu > div', '.about p', '.contact-list li', '.section__title'];
const revealEls = [];
revealGroups.forEach((sel) => document.querySelectorAll(sel).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--d', `${(i % 4) * 0.08}s`);
  revealEls.push(el);
}));
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealEls.forEach((el) => io.observe(el));
}

// Параллакс, бегущие строки и полоса прогресса
const layers = [...document.querySelectorAll('[data-speed]')];
const marquees = [...document.querySelectorAll('[data-marquee]')];
const progress = document.querySelector('.progress');
const hero = document.querySelector('.hero');
const baseTransform = new Map(layers.map((el) => [el, getComputedStyle(el).transform]));

let ticking = false;
function frame() {
  ticking = false;
  const y = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty('--p', max > 0 ? y / max : 0);
  if (reduceMotion) return;

  if (y < hero.offsetHeight + 200) {
    layers.forEach((el) => {
      const base = baseTransform.get(el);
      const shift = `translate3d(0, ${(y * parseFloat(el.dataset.speed)).toFixed(1)}px, 0)`;
      el.style.transform = base && base !== 'none' ? `${shift} ${base}` : shift;
    });
  }
  marquees.forEach((el) => {
    const box = el.parentElement.getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight) return;
    const k = parseFloat(el.dataset.marquee);
    const start = k < 0 ? 0 : -el.scrollWidth / 2;
    const travel = (innerHeight - box.top) * k;
    el.style.transform = `translate3d(${(start + travel).toFixed(1)}px, 0, 0)`;
  });
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
addEventListener('resize', frame);
frame();

// PDF: печать со всеми раскрытыми деталями
const details = document.querySelectorAll('details');
let wasOpen = [];
addEventListener('beforeprint', () => {
  wasOpen = [...details].map((d) => d.open);
  details.forEach((d) => { d.open = true; });
});
addEventListener('afterprint', () => {
  details.forEach((d, i) => { d.open = wasOpen[i]; });
});
document.getElementById('print').addEventListener('click', () => print());
