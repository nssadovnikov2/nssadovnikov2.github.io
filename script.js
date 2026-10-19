// Тема: светлая / тёмная, выбор запоминается
const root = document.documentElement;
document.getElementById('theme').addEventListener('click', () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

// Фильтр портфолио
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
chips.forEach((chip) => chip.addEventListener('click', () => {
  chips.forEach((c) => c.classList.toggle('is-active', c === chip));
  const f = chip.dataset.filter;
  cards.forEach((card) => { card.hidden = f !== 'all' && card.dataset.kind !== f; });
}));

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
