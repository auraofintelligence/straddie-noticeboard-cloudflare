const form = document.querySelector('#session-form');
const minutesField = document.querySelector('#session-minutes');
const activityField = document.querySelector('#session-activity');
const dateField = document.querySelector('#session-date');
const reviewerField = document.querySelector('#session-reviewer');
const calculate = document.querySelector('#calculate-session');
const total = document.querySelector('#session-total');
const preview = document.querySelector('#session-preview');
const download = document.querySelector('#download-session');
const print = document.querySelector('#print-session');
const status = document.querySelector('#session-status');
const example = total.textContent;

function humanDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const units = [];
  if (hours) units.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (remainingMinutes) units.push(`${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`);
  return units.join(' and ');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const minutes = minutesField.valueAsNumber;
  if (!Number.isSafeInteger(minutes) || minutes < 1) {
    minutesField.setCustomValidity('Enter a positive number of whole minutes.');
    minutesField.reportValidity();
    return;
  }

  const duration = humanDuration(minutes);
  const activity = activityField.value.trim();
  const reviewer = reviewerField.value.trim();
  const worksheet = [
    'Voluntary session worksheet',
    'Status: Unconfirmed personal draft for review',
    '',
    ...(activity ? [`Activity: ${activity}`] : []),
    ...(dateField.value ? [`Session date: ${dateField.value}`] : []),
    `Voluntary minutes: ${minutes}`,
    `Session length: ${duration}`,
    ...(reviewer ? [`Role that could confirm the time: ${reviewer}`] : []),
    '',
    'Check the activity and time. Agree what to share with the organiser and whether they can confirm it.',
    ''
  ];

  total.textContent = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} of voluntary time = ${duration}.`;
  preview.textContent = worksheet.join('\n');
  preview.hidden = false;
  download.disabled = false;
  print.disabled = false;
  status.textContent = 'Your worksheet is ready.';
});

form.addEventListener('input', () => {
  minutesField.setCustomValidity('');
  if (preview.hidden) return;
  total.textContent = example;
  preview.textContent = '';
  preview.hidden = true;
  download.disabled = true;
  print.disabled = true;
  status.textContent = 'Details changed. Calculate the session again to use the new details.';
});

download.addEventListener('click', () => {
  const objectUrl = URL.createObjectURL(new Blob([preview.textContent], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'voluntary-session-worksheet.txt';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  status.textContent = 'Worksheet download started.';
});

print.addEventListener('click', () => {
  document.body.classList.add('print-session-only');
  window.print();
});

window.addEventListener('afterprint', () => document.body.classList.remove('print-session-only'));
calculate.disabled = false;
