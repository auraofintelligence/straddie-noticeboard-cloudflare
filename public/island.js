const panels = [...document.querySelectorAll('.place-panel[data-place]')];
const selector = document.querySelector('#map-place');
const status = document.querySelector('#place-status');
const canvas = document.querySelector('#island-canvas');
const stage = document.querySelector('#map-stage');
const expand = document.querySelector('#map-expand');
const dialog = document.querySelector('#map-dialog');
const message = document.querySelector('#map-message');
const aerialButton = document.querySelector('#map-aerial');
const streetsButton = document.querySelector('#map-streets');
const activeMarkers = new Map();

const towns = [
  { id: 'place-dunwich', name: 'Dunwich', point: [-27.4992, 153.4025], side: 'bottom' },
  { id: 'place-amity', name: 'Amity Point', point: [-27.3953, 153.4411], side: 'top' },
  { id: 'place-lookout', name: 'Point Lookout', point: [-27.4297, 153.54], side: 'bottom' }
];
const aerialBounds = [[-27.870020610, 151.8], [-27.239765274, 153.639895833]];
const islandBounds = [[-27.745, 153.35], [-27.375, 153.555]];
const aerialTiles = 'https://spatial-img.information.qld.gov.au/arcgis/rest/services/Basemaps/LatestStateProgram_AllUsers/ImageServer/tile/{z}/{y}/{x}';
const streetTiles = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

let map;
let remoteLayer = null;
let activeLayer = 'aerial';
let showingOverview = true;
let expanding = false;
let resizeFrame = 0;

function setMapMessage(text = '') {
  message.textContent = text;
  message.hidden = !text;
}

function updateBackground() {
  const useDetail = activeLayer === 'streets' || map.getZoom() >= 13;
  if (!useDetail) {
    if (remoteLayer) map.removeLayer(remoteLayer);
    remoteLayer = null;
    setMapMessage();
    return;
  }
  const url = activeLayer === 'streets' ? streetTiles : aerialTiles;
  if (remoteLayer?.options.sourceUrl === url) return;
  if (remoteLayer) map.removeLayer(remoteLayer);
  setMapMessage();
  const tiles = L.tileLayer(url, { maxZoom: 17, sourceUrl: url });
  remoteLayer = tiles;
  let failed = false;
  tiles.on('loading', () => { failed = false; });
  tiles.on('tileerror', () => {
    if (remoteLayer !== tiles) return;
    failed = true;
    setMapMessage('Some map detail is unavailable. The saved aerial overview and town markers are still available.');
  });
  tiles.on('load', () => { if (tiles === remoteLayer && !failed) setMapMessage(); });
  tiles.addTo(map);
}

function setLayer(layer) {
  activeLayer = layer;
  aerialButton.setAttribute('aria-pressed', String(layer === 'aerial'));
  streetsButton.setAttribute('aria-pressed', String(layer === 'streets'));
  document.querySelector('#map-street-credit').hidden = layer !== 'streets';
  updateBackground();
}

function fitIsland() {
  const bounds = L.latLngBounds(islandBounds);
  const zoom = map.getBoundsZoom(bounds, false, L.point(30, 63));
  const centre = map.project(bounds.getNorthWest(), zoom).add(map.project(bounds.getSouthEast(), zoom)).divideBy(2);
  // Leave room for the Amity label and use the available bay imagery on larger screens.
  centre.y -= 12;
  const halfWidth = map.getSize().x / 2;
  const west = map.project(aerialBounds[0], zoom).x + halfWidth;
  const east = map.project(aerialBounds[1], zoom).x - halfWidth;
  centre.x = Math.min(east - 1, Math.max(west + 1, centre.x));
  map.setView(map.unproject(centre, zoom), zoom, { animate: false });
  showingOverview = true;
}

function showPlace(id, moveMap = true) {
  const chosen = panels.find(panel => panel.id === id) || panels[0];
  for (const panel of panels) panel.hidden = panel !== chosen;
  selector.value = chosen.id;
  status.textContent = 'Showing ' + chosen.dataset.place + ' information.';
  for (const [key, marker] of activeMarkers) {
    const node = marker.getElement();
    node.classList.toggle('is-current', key === chosen.id);
    node.setAttribute('aria-pressed', String(key === chosen.id));
  }
  if (!map || !moveMap) return;
  const town = towns.find(item => item.id === chosen.id);
  if (!town) {
    fitIsland();
  } else {
    showingOverview = false;
    map.setView(town.point, 14, { animate: false });
  }
}

function choosePlace(id) {
  const panel = document.getElementById(id);
  const address = new URL(location.href);
  if (id === 'place-island') address.searchParams.delete('place');
  else address.searchParams.set('place', panel.dataset.place);
  address.hash = '';
  if (address.href !== location.href) history.pushState(null, '', address);
  showPlace(id);
}

function selectFromAddress() {
  const requestedPlace = new URLSearchParams(location.search).get('place');
  const panel = panels.find(item => location.hash === '#' + item.id)
    || panels.find(item => item.dataset.place === requestedPlace);
  showPlace(panel?.id || 'place-island');
}

function resizeMap() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    map.invalidateSize({ pan: false, animate: false });
    if (showingOverview) fitIsland();
  });
}

function updateExpandControl() {
  const open = document.fullscreenElement === stage || dialog.open;
  expand.textContent = open ? 'Exit full screen' : 'Full screen';
  expand.setAttribute('aria-pressed', String(open));
  resizeMap();
  if (!open) expand.focus({ preventScroll: true });
}

async function toggleFullScreen() {
  if (expanding) return;
  if (dialog.open) { dialog.close(); return; }
  if (document.fullscreenElement === stage) { await document.exitFullscreen(); return; }
  expanding = true;
  try {
    if (!stage.requestFullscreen) throw new Error('Use the expanded view');
    await stage.requestFullscreen();
  } catch {
    dialog.append(stage);
    dialog.showModal();
    document.body.classList.add('is-map-expanded');
    updateExpandControl();
    expand.focus({ preventScroll: true });
  } finally {
    expanding = false;
  }
}

function startMap() {
  const poster = document.querySelector('.map-poster');
  const toolbar = document.querySelector('.map-toolbar');
  toolbar.hidden = false;
  canvas.hidden = false;
  document.querySelector('.map-fallback-links').hidden = true;
  map = L.map(canvas, {
    attributionControl: false, scrollWheelZoom: false, zoomSnap: 0, zoomDelta: 1,
    minZoom: 9, maxZoom: 17, maxBounds: [[-28.2, 151.65], [-26.9, 154.05]],
    maxBoundsViscosity: 1, zoomAnimation: false
  });
  fitIsland();
  L.imageOverlay(poster.src, aerialBounds, { interactive: false, zIndex: 0, pane: 'tilePane' }).addTo(map);
  poster.hidden = true;

  for (const town of towns) {
    const marker = L.marker(town.point, {
      icon: L.divIcon({ className: 'town-marker', iconSize: [30, 30], iconAnchor: [15, 15] }),
      title: town.name, alt: town.name, keyboard: true, autoPanOnFocus: false
    }).addTo(map);
    marker.getElement().setAttribute('aria-label', 'Show ' + town.name);
    marker.bindTooltip(town.name, { permanent: true, interactive: true, direction: town.side, className: 'town-label', opacity: 1,
      offset: town.side === 'top' ? [0, -8] : [0, 6] });
    marker.on('click', () => choosePlace(town.id));
    activeMarkers.set(town.id, marker);
  }

  const fitControl = L.control({ position: 'topleft' });
  fitControl.onAdd = () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'map-fit';
    button.className = 'map-fit';
    button.textContent = 'Fit island';
    button.title = 'Show the whole island';
    L.DomEvent.disableClickPropagation(button);
    button.addEventListener('click', () => choosePlace('place-island'));
    return button;
  };
  fitControl.addTo(map);

  selector.addEventListener('change', () => choosePlace(selector.value));
  aerialButton.addEventListener('click', () => setLayer('aerial'));
  streetsButton.addEventListener('click', () => setLayer('streets'));
  map.on('dragstart zoomstart', () => { showingOverview = false; });
  map.on('zoomend', updateBackground);
  updateBackground();
  expand.addEventListener('click', toggleFullScreen);
  document.addEventListener('fullscreenchange', updateExpandControl);
  dialog.addEventListener('close', () => {
    dialog.previousElementSibling.querySelector('figcaption').before(stage);
    document.body.classList.remove('is-map-expanded');
    updateExpandControl();
  });
  new ResizeObserver(resizeMap).observe(canvas);
}

if (window.L?.map) {
  startMap();
  window.addEventListener('popstate', selectFromAddress);
  window.addEventListener('hashchange', selectFromAddress);
  selectFromAddress();
}
