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
    'Proposed island-wide school-holiday launch and ongoing service plan for internal review',
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
      '[ ] Confirm permission, facts, public wording, expiry and the author’s selected outlet types with the named reviewer.',
      '[ ] Decide who sends corrections to each recipient and checks acknowledgement across venues.',
      ''
    );
  }

  if (!hostFields.disabled) {
    const transportSite = fields['business-screen'].selectedOptions[0]?.dataset.transportSite;
    lines.push(
      'SCREEN HOSTING',
      `Screen to test: ${value('screen')}`,
      `Fallback to practise: ${value('fallback')}`,
      '[ ] Confirm venue approval, hardware ownership, accessible screen placement, power and who can pause it.',
      '[ ] Test the display from the intended viewing positions. Confirm the roster and holiday backup.',
      '[ ] Rehearse a correction and expiry. Check the actual screen and record the result.',
      '[ ] Record the printed or saved fallback and agree who keeps it current.',
      '[ ] Assign ongoing maintenance and budget for repairs, replacement and support.'
    );
    if (transportSite === 'onboard') {
      lines.push(
        '[ ] Confirm approval with the bus operator and vehicle owner. Use the approved passenger display, wide format and supported vehicle power.',
        '[ ] Check readability from passenger seats and agree who can pause the community rotation so route, stop, access and safety information takes priority.'
      );
    }
    if (transportSite === 'stop') {
      lines.push(
        '[ ] Confirm approval with the site owner, stop asset owner and transport operator. Check placement, weather exposure, reach, glare and boarding clearance.',
        '[ ] Keep official service, access and safety information prominent. Test independent power if the installation is designed to use it.'
      );
    }
    lines.push('');
  }

  lines.push('Review with the team before confirming this outlet’s participation dates and ongoing responsibilities.', '');
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
