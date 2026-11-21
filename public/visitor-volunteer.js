const original = {
  version: 'Original edition',
  time: '10:00 am AEST',
  checked: '8:30 am on the demonstration day',
  details: 'Meet at the courtyard entrance. A volunteer can direct visitors to the step-free entrance and seating.',
};

const correction = {
  version: 'Corrected edition',
  time: '11:30 am AEST',
  checked: '9:15 am on the demonstration day',
  details: 'Meet at the covered entrance. The organiser has checked the step-free route and moved the welcome point and seating there.',
};

const controls = document.querySelector('#handover-controls');
const correct = document.querySelector('#handover-correct');
const connection = document.querySelector('#handover-connection');
const confirm = document.querySelector('#handover-confirm');
const reset = document.querySelector('#handover-reset');
const status = document.querySelector('#handover-status');
const display = document.querySelector('#handover-display');
const displayedVersion = document.querySelector('#display-version');
const displayedTime = document.querySelector('#display-time');
const displayedDetails = document.querySelector('#display-details');
const displayedCheck = document.querySelector('#display-checked');
const offlineNote = document.querySelector('#display-offline');
const roles = document.querySelector('#handover-roles');
const roleButtons = roles.querySelectorAll('[data-handover-role]');
const coordinatorTask = document.querySelector('#next-coordinator');
const visitorTask = document.querySelector('#next-visitor');
const hostTask = document.querySelector('#next-host');
const source = document.querySelector('#source-versions');

let published = original;
let displayed = original;
let online = true;
let confirmed = false;

function selectRole(selected) {
  for (const button of roleButtons) {
    const current = button === selected;
    button.setAttribute('aria-pressed', String(current));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !current;
  }
}

function render() {
  const revised = published === correction;
  correct.disabled = revised;
  confirm.disabled = !online || confirmed;
  reset.disabled = !revised && online && !confirmed;
  connection.textContent = online ? 'Disconnect example screen' : 'Reconnect example screen';
  display.classList.toggle('is-offline', !online);
  displayedVersion.textContent = displayed.version;
  displayedTime.textContent = displayed.time;
  displayedDetails.textContent = displayed.details;
  displayedCheck.textContent = displayed.checked;
  offlineNote.hidden = online;

  if (!online) {
    status.textContent = published !== displayed
      ? 'Correction issued. The offline screen still shows the original saved copy.'
      : 'The screen is offline and shows its last saved copy. Current checks are unavailable.';
  } else {
    status.textContent = `${displayed.version} received. ${confirmed ? 'Host confirmed the visible copy.' : 'Host confirmation is due.'}`;
  }

  coordinatorTask.textContent = revised
    ? 'Update the private roster for the later start and reassign the welcome point. Ask each volunteer to confirm their shift.'
    : 'Check the meeting point with the organiser and confirm who will welcome visitors.';
  visitorTask.textContent = online
    ? 'Read the organiser’s source and check the route to the displayed arrival point.'
    : 'Check with the organiser or venue staff before relying on the time or meeting point in the saved copy.';
  if (!online) hostTask.textContent = 'Flag the saved copy at the venue. Reconnect, check the delivered edition and confirm what visitors can see.';
  else if (confirmed) hostTask.textContent = 'Record when the edition was visible and let the coordinator know. Take it down after 1:00 pm.';
  else hostTask.textContent = 'Check the visible time and entrance against the organiser’s edition, then confirm the screen copy.';
}

correct.addEventListener('click', () => {
  published = correction;
  if (online) displayed = published;
  confirmed = false;
  render();
});

connection.addEventListener('click', () => {
  online = !online;
  if (online) displayed = published;
  confirmed = false;
  render();
});

confirm.addEventListener('click', () => {
  confirmed = true;
  render();
});

reset.addEventListener('click', () => {
  published = original;
  displayed = original;
  online = true;
  confirmed = false;
  selectRole(roleButtons[0]);
  render();
});

for (const button of roleButtons) {
  button.addEventListener('click', () => selectRole(button));
}
display.querySelector('a[href="#source-versions"]').addEventListener('click', () => { source.open = true; });

selectRole(roleButtons[0]);
render();
controls.hidden = false;
roles.hidden = false;
