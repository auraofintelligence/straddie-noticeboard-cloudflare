import { places } from './notices.js';

const form = document.querySelector('#business-plan');
const route = document.querySelector('#plan-route');
const publishFields = document.querySelector('#publish-fields');
const hostFields = document.querySelector('#host-fields');
const createPlan = document.querySelector('#create-business-plan');
const preview = document.querySelector('#business-preview');
const download = document.querySelector('#download-business-plan');
const copy = document.querySelector('#copy-business-plan');
const status = document.querySelector('#business-status');
const fields = Object.fromEntries(Array.from(form.querySelectorAll('input, select')).map(field => [field.id, field]));

function updateRoute() {
  publishFields.hidden = route.value === 'Host a screen';
  publishFields.disabled = publishFields.hidden;
  hostFields.hidden = route.value === 'Publish notices';
  hostFields.disabled = hostFields.hidden;
}

function invalidatePlan() {
  if (!preview.value) return;
  preview.value = '';
  download.disabled = true;
  copy.disabled = true;
  status.textContent = 'Details changed. Create a fresh copy of the plan.';
}

function buildPlan() {
  const value = name => fields[`business-${name}`].value.trim();
  const lines = [
    'STRADDIE NOTICEBOARD NETWORK',
    'Proposed business pilot — plan for internal review',
    '',
    `Business or venue: ${value('name')}`,
    `Participation: ${route.value}`,
    `Town or area: ${value('place')}`,
    `Lead role: ${value('lead')}`,
    `Backup role: ${value('backup')}`,
    `Permission stage: ${value('permission')}`,
    ''
  ];

  if (!publishFields.disabled) {
    lines.push(
      'PUBLISHING',
      `Topics to agree: ${value('topics')}`,
      `Reviewer role: ${value('reviewer')}`,
      `First public source: ${value('source') || 'To be confirmed'}`,
      '[ ] Draft one notice with a public source, timing and take-down date.',
      '[ ] Confirm permission, facts, public wording and expiry with the named reviewer.',
      '[ ] Decide who records and sends a corrected version to each host.',
      ''
    );
  }

  if (!hostFields.disabled) {
    lines.push(
      'SCREEN HOSTING',
      `Screen to test: ${value('screen')}`,
      `Fallback to practise: ${value('fallback')}`,
      '[ ] Confirm venue approval, screen placement, power, costs and who can pause it.',
      '[ ] Test that people can read and use the display in the intended location.',
      '[ ] Rehearse a correction and expiry. Check the actual screen and record the result.',
      '[ ] Record the printed or saved fallback and agree who keeps it current.',
      ''
    );
  }

  lines.push('Review with the team before committing to a trial.', '');
  return lines.join('\n');
}

function showPlan() {
  for (const field of form.querySelectorAll('input[required]')) {
    field.setCustomValidity(field.value.trim() ? '' : 'Please enter a value.');
  }

  const source = fields['business-source'];
  source.setCustomValidity(source.value && !/^https?:\/\//i.test(source.value) ? 'Use a public link beginning with https:// or http://.' : '');
  if (!form.reportValidity()) return;

  preview.value = buildPlan();
  download.disabled = false;
  copy.disabled = false;
  status.textContent = 'Your setup plan is ready.';
  preview.focus();
}

for (const place of places) fields['business-place'].add(new Option(place, place));
updateRoute();
createPlan.disabled = false;

for (const link of document.querySelectorAll('[data-plan-route]')) {
  link.addEventListener('click', () => {
    route.value = link.dataset.planRoute;
    updateRoute();
    invalidatePlan();
  });
}

route.addEventListener('change', () => {
  updateRoute();
  invalidatePlan();
});
form.addEventListener('input', event => {
  event.target.setCustomValidity('');
  invalidatePlan();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  showPlan();
});
createPlan.addEventListener('click', showPlan);

copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(preview.value);
    status.textContent = 'Setup plan copied.';
  } catch {
    preview.focus();
    preview.select();
    status.textContent = 'The setup plan is selected. Use your device’s copy shortcut.';
  }
});

download.addEventListener('click', () => {
  const objectUrl = URL.createObjectURL(new Blob([preview.value], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'straddie-business-setup-plan.txt';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  status.textContent = 'Setup plan download started.';
});
