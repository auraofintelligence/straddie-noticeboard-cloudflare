const navigation = document.querySelector('.primary-nav');
const menu = navigation.querySelector('.section-menu');
const toggle = menu.querySelector(':scope > summary');
const page = navigation.dataset.navPage;

if (page === 'board' || page === 'screen') {
  const pilot = new URLSearchParams(window.location.search).get('mode') === 'pilot';
  const currentRoute = `${page}-${pilot ? 'pilot' : 'practice'}`;
  for (const link of navigation.querySelectorAll('[data-nav-route]')) {
    if (link.dataset.navRoute === currentRoute) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
}

function closeOutside(event) {
  if (menu.open && !menu.contains(event.target)) menu.open = false;
}

document.addEventListener('click', closeOutside);
document.addEventListener('focusin', closeOutside);
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !menu.open) return;
  event.preventDefault();
  const submenu = document.activeElement?.closest('.nav-more[open]');
  if (submenu && menu.contains(submenu)) {
    submenu.open = false;
    submenu.querySelector(':scope > summary').focus();
    return;
  }
  menu.open = false;
  toggle.focus();
});
