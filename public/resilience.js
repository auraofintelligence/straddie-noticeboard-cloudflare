const form = document.querySelector('#power-form');
const energy = document.querySelector('#power-energy');
const screen = document.querySelector('#power-screen');
const player = document.querySelector('#power-player');
const router = document.querySelector('#power-router');
const reserve = document.querySelector('#power-reserve');
const estimate = document.querySelector('#power-estimate');
const totals = document.querySelector('#power-totals');
const results = document.querySelector('#power-results');
const pending = document.querySelector('#power-pending');
const error = document.querySelector('#power-error');
const rows = ['screen', 'full', 'reserve'].map(name => ({
  text: document.querySelector(`#runtime-${name}`),
  bar: document.querySelector(`#runtime-${name}-bar`)
}));
const formatNumber = new Intl.NumberFormat('en-AU', { maximumSignificantDigits: 6 });

function formatDuration(runtime) {
  if (runtime === null) return 'Screen off';
  if (runtime === 0) return '0 min';
  if (runtime < 1 / 60) return 'Under 1 min';

  const hours = Math.floor(runtime);
  const minutes = Math.floor((runtime - hours) * 60 + 1e-9);
  if (minutes === 60) return `${formatNumber.format(hours + 1)} hr`;
  if (!hours) return `${minutes} min`;
  return `${formatNumber.format(hours)} hr${minutes ? ` ${minutes} min` : ''}`;
}

function showError(message) {
  results.hidden = true;
  pending.hidden = true;
  error.textContent = message;
}

function calculateRuntime() {
  const usableWh = energy.valueAsNumber;
  const screenW = screen.valueAsNumber;
  const totalW = screenW + player.valueAsNumber + router.valueAsNumber;
  const plannedWh = usableWh * ((100 - reserve.valueAsNumber) / 100);

  if (totalW === 0) {
    showError('Enter measured watts for at least one device to estimate runtime.');
    return;
  }

  const durations = [screenW ? usableWh / screenW : null, usableWh / totalW, plannedWh / totalW];
  if (!Number.isFinite(totalW) || durations.some(duration => duration !== null && !Number.isFinite(duration))) {
    showError('Check the battery energy and measured watts. Those values are outside the calculation range.');
    return;
  }

  totals.textContent = `${formatNumber.format(totalW)} W total · ${formatNumber.format(plannedWh)} Wh after reserve`;
  const longest = Math.max(...durations);
  for (const [index, row] of rows.entries()) {
    const duration = durations[index];
    row.text.textContent = formatDuration(duration);
    row.bar.value = longest > 0 && duration !== null ? duration / longest * 100 : 0;
  }

  error.textContent = '';
  pending.hidden = true;
  results.hidden = false;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  calculateRuntime();
});

form.addEventListener('input', () => {
  results.hidden = true;
  error.textContent = '';
  pending.hidden = false;
});

estimate.disabled = false;
if (form.checkValidity()) calculateRuntime();
