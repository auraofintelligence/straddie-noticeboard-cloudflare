const panels = Array.from(document.querySelectorAll('[data-place]'));
const placeLinks = document.querySelectorAll('[data-place-link]');
const status = document.querySelector('#place-status');

function selectPlace(selected) {
  for (const panel of panels) {
    panel.hidden = panel !== selected;
  }
  for (const link of placeLinks) {
    if (link.hash === `#${selected.id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  status.textContent = `Showing ${selected.dataset.place} information.`;
}

function selectFromAddress() {
  const area = new URLSearchParams(location.search).get('place');
  const selected = panels.find((panel) => `#${panel.id}` === location.hash)
    || panels.find((panel) => panel.dataset.place === area)
    || panels[0];
  selectPlace(selected);
}

for (const link of placeLinks) {
  link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const selected = document.getElementById(link.hash.slice(1));
    const nextAddress = new URL(location.href);
    nextAddress.searchParams.set('place', selected.dataset.place);
    nextAddress.hash = '';

    event.preventDefault();
    if (nextAddress.href !== location.href) history.pushState(null, '', nextAddress);
    selectPlace(selected);
  });
}

window.addEventListener('popstate', selectFromAddress);
window.addEventListener('hashchange', selectFromAddress);
selectFromAddress();
