const header = document.querySelector('.site-header');
const announcement = document.querySelector('.announcement');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  const shouldStick = window.scrollY > (announcement?.offsetHeight || 38) + 70;
  header.classList.toggle('is-stuck', shouldStick);
  document.body.style.paddingTop = shouldStick ? `${header.offsetHeight}px` : '0';
}, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  mobileMenu.classList.toggle('open', !isOpen);
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileMenu.classList.remove('open');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const tabs = [...document.querySelectorAll('[role="tab"]')];
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const next = tabs[(index + direction + tabs.length) % tabs.length];
    next.focus(); activateTab(next);
  });
});

function activateTab(activeTab) {
  tabs.forEach(tab => {
    const active = tab === activeTab;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
}

const form = document.getElementById('enquiry-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = new FormData(form).get('name').trim().split(' ')[0];
  form.querySelector('.form-status').textContent = `Thank you, ${name}. This demo enquiry is ready to connect to your admissions inbox.`;
  form.reset();
});

document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => {
  if (!detail.open) return;
  document.querySelectorAll('details').forEach(other => { if (other !== detail) other.open = false; });
}));
